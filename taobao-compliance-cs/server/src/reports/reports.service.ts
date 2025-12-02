import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async getSensitiveSummary(from?: Date, to?: Date) {
    const query = this.messageRepository
      .createQueryBuilder('message')
      .where('message.matched_rules IS NOT NULL');

    if (from) {
      query.andWhere('message.created_at >= :from', { from });
    }
    if (to) {
      query.andWhere('message.created_at <= :to', { to });
    }

    const messages = await query.getMany();

    // 统计触发词
    const wordCount: Record<string, number> = {};
    messages.forEach((msg) => {
      if (msg.matched_rules) {
        const words = msg.matched_rules.split(',');
        words.forEach((word) => {
          wordCount[word] = (wordCount[word] || 0) + 1;
        });
      }
    });

    // TOP触发词
    const topWords = Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));

    return {
      total_triggers: messages.length,
      top_words: topWords,
      date_range: {
        from: from || null,
        to: to || null,
      },
    };
  }
}


