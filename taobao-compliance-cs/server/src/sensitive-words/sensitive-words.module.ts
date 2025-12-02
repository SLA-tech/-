import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensitiveWordsController } from './sensitive-words.controller';
import { SensitiveWordsService } from './sensitive-words.service';
import { SensitiveWord } from '../entities/sensitive-word.entity';
import { SensitiveWordDetectorService } from '../services/sensitive-word-detector.service';

@Module({
  imports: [TypeOrmModule.forFeature([SensitiveWord])],
  controllers: [SensitiveWordsController],
  providers: [SensitiveWordsService, SensitiveWordDetectorService],
  exports: [SensitiveWordDetectorService],
})
export class SensitiveWordsModule {}


