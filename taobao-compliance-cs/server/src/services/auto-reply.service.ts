import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AutomatedTemplate } from '../entities/automated-template.entity';
import { User } from '../entities/user.entity';
import { Message, MessageDirection, ContentType } from '../entities/message.entity';

@Injectable()
export class AutoReplyService {
  private loopCounters: Map<number, { count: number; lastSent: Date }> = new Map();

  constructor(
    @InjectRepository(AutomatedTemplate)
    private templateRepository: Repository<AutomatedTemplate>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  /**
   * 查找匹配的FAQ模板
   */
  async findMatchingTemplate(
    userMessage: string,
    sessionId: number,
  ): Promise<AutomatedTemplate | null> {
    const templates = await this.templateRepository.find({
      where: { enabled: 1 },
    });

    const normalizedMessage = userMessage.toLowerCase().trim();

    // 精确匹配关键词
    for (const template of templates) {
      if (template.keywords) {
        const keywords = template.keywords.split(',').map((k) => k.trim().toLowerCase());
        if (keywords.some((keyword) => normalizedMessage.includes(keyword))) {
          return template;
        }
      }
    }

    // 模糊匹配（简单实现，可扩展）
    for (const template of templates) {
      if (template.keywords) {
        const keywords = template.keywords.split(',').map((k) => k.trim().toLowerCase());
        for (const keyword of keywords) {
          if (normalizedMessage.includes(keyword) || keyword.includes(normalizedMessage)) {
            return template;
          }
        }
      }
    }

    return null;
  }

  /**
   * 检查是否可以发送循环消息
   */
  canSendLoopMessage(template: AutomatedTemplate, sessionId: number): boolean {
    if (template.max_loops === 0) {
      // 无限制
      const counter = this.loopCounters.get(sessionId);
      if (!counter) {
        return true;
      }
      const now = new Date();
      const elapsed = (now.getTime() - counter.lastSent.getTime()) / 1000;
      return elapsed >= template.loop_interval;
    } else {
      // 有限制
      const counter = this.loopCounters.get(sessionId);
      if (!counter) {
        return true;
      }
      if (counter.count >= template.max_loops) {
        return false;
      }
      const now = new Date();
      const elapsed = (now.getTime() - counter.lastSent.getTime()) / 1000;
      return elapsed >= template.loop_interval;
    }
  }

  /**
   * 记录循环消息发送
   */
  recordLoopMessage(sessionId: number) {
    const counter = this.loopCounters.get(sessionId) || { count: 0, lastSent: new Date(0) };
    counter.count += 1;
    counter.lastSent = new Date();
    this.loopCounters.set(sessionId, counter);
  }

  /**
   * 获取欢迎语模板
   */
  async getWelcomeTemplate(): Promise<AutomatedTemplate | null> {
    return await this.templateRepository.findOne({
      where: { name: '欢迎语', enabled: 1 },
    });
  }

  /**
   * 获取默认回复模板
   */
  async getDefaultReplyTemplate(): Promise<AutomatedTemplate | null> {
    return await this.templateRepository.findOne({
      where: { name: '默认回复', enabled: 1 },
    });
  }

  /**
   * 解析模板内容（支持JSON格式的图片等）
   */
  parseTemplateContent(template: AutomatedTemplate): {
    content: string;
    contentType: ContentType;
  } {
    try {
      const parsed = JSON.parse(template.content);
      return {
        content: parsed.text || parsed.content || template.content,
        contentType: parsed.type === 'image' ? ContentType.IMAGE : ContentType.TEXT,
      };
    } catch {
      return {
        content: template.content,
        contentType: ContentType.TEXT,
      };
    }
  }
}


