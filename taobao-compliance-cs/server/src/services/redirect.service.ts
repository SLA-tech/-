import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Message, MessageDirection, ContentType } from '../entities/message.entity';

@Injectable()
export class RedirectService {
  private redirectCache: Map<string, number> = new Map(); // 内存缓存：用户ID -> 时间戳
  private readonly REDIRECT_COOLDOWN = 3600 * 1000; // 1小时（毫秒）

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {
    // 定期清理过期缓存
    setInterval(() => {
      const now = Date.now();
      for (const [key, timestamp] of this.redirectCache.entries()) {
        if (now - timestamp > this.REDIRECT_COOLDOWN) {
          this.redirectCache.delete(key);
        }
      }
    }, 60000); // 每分钟清理一次
  }

  /**
   * 检查是否可以发送H5链接
   */
  async canSendRedirect(taobaoUserId: string): Promise<boolean> {
    const timestamp = this.redirectCache.get(taobaoUserId);
    if (!timestamp) {
      return true;
    }
    const now = Date.now();
    return now - timestamp > this.REDIRECT_COOLDOWN;
  }

  /**
   * 记录已发送H5链接
   */
  async recordRedirect(taobaoUserId: string) {
    this.redirectCache.set(taobaoUserId, Date.now());
  }

  /**
   * 生成H5链接
   */
  generateH5Link(sessionId: number): string {
    const baseUrl = process.env.H5_BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/redirect/${sessionId}`;
  }

  /**
   * 发送H5链接消息
   */
  async sendRedirectMessage(sessionId: number, taobaoUserId: string): Promise<Message> {
    const h5Link = this.generateH5Link(sessionId);
    const content = `如需详细沟通，请访问我们的客服页面：${h5Link}，页面内可一键添加企业微信客服。`;

    const message = this.messageRepository.create({
      session_id: sessionId,
      direction: MessageDirection.OUTBOUND,
      content,
      content_type: ContentType.TEXT,
    });

    await this.messageRepository.save(message);
    await this.recordRedirect(taobaoUserId);

    return message;
  }
}

