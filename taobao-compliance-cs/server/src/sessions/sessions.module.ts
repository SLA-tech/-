import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { User, Message } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Message])],
  controllers: [SessionsController],
  providers: [SessionsService],
})
export class SessionsModule {}


