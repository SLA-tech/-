import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { User, Message } from '../entities';
import { SensitiveWordDetectorService } from '../services/sensitive-word-detector.service';
import { AutoReplyService } from '../services/auto-reply.service';
import { RedirectService } from '../services/redirect.service';
import { AuditService } from '../services/audit.service';
import { SensitiveWord, AutomatedTemplate, AuditLog } from '../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Message, SensitiveWord, AutomatedTemplate, AuditLog]),
  ],
  controllers: [MessagesController],
  providers: [
    MessagesService,
    SensitiveWordDetectorService,
    AutoReplyService,
    RedirectService,
    AuditService,
  ],
})
export class MessagesModule {}


