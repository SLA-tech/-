import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, SessionStatus } from '../entities/user.entity';
import { Message } from '../entities/message.entity';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async findAll(page: number, limit: number) {
    const [data, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { updated_at: 'DESC' },
    });
    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['messages'],
    });
    return user;
  }

  async close(id: number) {
    await this.userRepository.update(id, {
      current_status: SessionStatus.CLOSED,
    });
    return await this.userRepository.findOne({ where: { id } });
  }

  async block(id: number) {
    await this.userRepository.update(id, {
      current_status: SessionStatus.BLOCKED,
      risk_level: 2,
    });
    return await this.userRepository.findOne({ where: { id } });
  }
}


