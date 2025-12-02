import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';
import { AutomatedTemplate } from '../entities/automated-template.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AutomatedTemplate])],
  controllers: [TemplatesController],
  providers: [TemplatesService],
})
export class TemplatesModule {}


