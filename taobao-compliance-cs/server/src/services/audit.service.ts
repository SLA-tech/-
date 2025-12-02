import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async log(actor: string, action: string, meta?: Record<string, any>) {
    const log = this.auditLogRepository.create({
      actor,
      action,
      meta,
    });
    await this.auditLogRepository.save(log);
  }

  async getLogs(limit = 100, offset = 0) {
    return await this.auditLogRepository.find({
      take: limit,
      skip: offset,
      order: { created_at: 'DESC' },
    });
  }
}


