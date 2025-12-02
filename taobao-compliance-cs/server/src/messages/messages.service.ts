import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, SessionStatus } from '../entities/user.entity';
import { Message, MessageDirection, ContentType } from '../entities/message.entity';
import { InboundMessageDto } from '../dto/message.dto';
import { SensitiveWordDetectorService } from '../services/sensitive-word-detector.service';
import { AutoReplyService } from '../services/auto-reply.service';
import { RedirectService } from '../services/redirect.service';
import { AuditService } from '../services/audit.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private sensitiveWordDetector: SensitiveWordDetectorService,
    private autoReplyService: AutoReplyService,
    private redirectService: RedirectService,
    private auditService: AuditService,
  ) {}

  /**
   * 处理接收到的消息
   */
  async processInboundMessage(dto: InboundMessageDto) {
    // 1. 获取或创建会话
    let user = await this.userRepository.findOne({
      where: { taobao_user_id: dto.taobao_user_id },
    });

    if (!user) {
      user = this.userRepository.create({
        taobao_user_id: dto.taobao_user_id,
        current_status: SessionStatus.OPEN,
        risk_level: 0,
      });
      await this.userRepository.save(user);
    }

    // 如果会话已关闭或已阻止，不处理
    if (user.current_status !== SessionStatus.OPEN) {
      return;
    }

    // 2. 敏感词检测
    const detection = this.sensitiveWordDetector.detect(dto.content);
    
    // 3. 保存消息
    const message = this.messageRepository.create({
      session_id: user.id,
      direction: MessageDirection.INBOUND,
      content: dto.content,
      content_type: dto.content_type || ContentType.TEXT,
      matched_rules: detection.matched
        ? detection.words.map((w) => w.word).join(',')
        : '',
    });
    await this.messageRepository.save(message);

    // 4. 处理敏感词拦截
    if (detection.shouldBlock) {
      // 高风险：关闭会话
      user.current_status = SessionStatus.BLOCKED;
      user.risk_level = 2;
      await this.userRepository.save(user);

      await this.auditService.log('system', '高风险会话已拦截', {
        session_id: user.id,
        words: detection.words.map((w) => w.word),
        severity: detection.maxSeverity,
      });

      // 发送拦截回复
      await this.sendBlockedReply(user.id);
      return;
    } else if (detection.matched) {
      // 中低风险：记录并提示
      user.risk_level = Math.max(user.risk_level, detection.maxSeverity >= 5 ? 1 : 0);
      await this.userRepository.save(user);

      await this.auditService.log('system', '敏感词检测', {
        session_id: user.id,
        words: detection.words.map((w) => w.word),
        severity: detection.maxSeverity,
      });

      // 发送提示回复
      await this.sendSensitiveWarning(user.id);
    }

    // 5. 自动回复处理
    const template = await this.autoReplyService.findMatchingTemplate(
      dto.content,
      user.id,
    );

    if (template) {
      const parsed = this.autoReplyService.parseTemplateContent(template);
      await this.sendOutboundMessage(user.id, parsed.content, parsed.contentType);
    } else {
      // 检查是否是首次会话
      const messageCount = await this.messageRepository.count({
        where: { session_id: user.id, direction: MessageDirection.INBOUND },
      });

      if (messageCount === 1) {
        // 首次会话，发送欢迎语
        const welcomeTemplate = await this.autoReplyService.getWelcomeTemplate();
        if (welcomeTemplate) {
          const parsed = this.autoReplyService.parseTemplateContent(welcomeTemplate);
          await this.sendOutboundMessage(user.id, parsed.content, parsed.contentType);
        }
      } else {
        // 默认回复
        const defaultTemplate = await this.autoReplyService.getDefaultReplyTemplate();
        if (defaultTemplate) {
          const parsed = this.autoReplyService.parseTemplateContent(defaultTemplate);
          await this.sendOutboundMessage(user.id, parsed.content, parsed.contentType);
        }
      }
    }
  }

  /**
   * 发送出站消息
   */
  async sendOutboundMessage(
    sessionId: number,
    content: string,
    contentType: ContentType = ContentType.TEXT,
  ) {
    const message = this.messageRepository.create({
      session_id: sessionId,
      direction: MessageDirection.OUTBOUND,
      content,
      content_type: contentType,
    });
    await this.messageRepository.save(message);
    return message;
  }

  /**
   * 发送拦截回复
   */
  private async sendBlockedReply(sessionId: number) {
    const content =
      '抱歉，我们无法提供涉及违法或违规的服务，请使用合法合规的描述或咨询当地执法机构。';
    await this.sendOutboundMessage(sessionId, content);
  }

  /**
   * 发送敏感词警告
   */
  private async sendSensitiveWarning(sessionId: number) {
    const content = '请注意，您的消息可能包含敏感内容，请使用合法合规的描述。';
    await this.sendOutboundMessage(sessionId, content);
  }

  /**
   * 获取会话消息
   */
  async getSessionMessages(sessionId: number) {
    return await this.messageRepository.find({
      where: { session_id: sessionId },
      order: { created_at: 'ASC' },
    });
  }
}


