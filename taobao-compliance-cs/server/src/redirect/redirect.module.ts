import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedirectController } from './redirect.controller';
import { RedirectService } from '../services/redirect.service';
import { User, Message } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Message])],
  controllers: [RedirectController],
  providers: [RedirectService],
})
export class RedirectModule {}


