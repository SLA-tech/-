import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SensitiveWord } from '../entities/sensitive-word.entity';
import { CreateSensitiveWordDto, UpdateSensitiveWordDto } from '../dto/sensitive-word.dto';
import { SensitiveWordDetectorService } from '../services/sensitive-word-detector.service';

@Injectable()
export class SensitiveWordsService {
  constructor(
    @InjectRepository(SensitiveWord)
    private sensitiveWordRepository: Repository<SensitiveWord>,
    private detectorService: SensitiveWordDetectorService,
  ) {}

  async findAll() {
    return await this.sensitiveWordRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async create(dto: CreateSensitiveWordDto) {
    const word = this.sensitiveWordRepository.create({
      word: dto.word,
      type: dto.type,
      severity: dto.severity || 5,
      enabled: dto.enabled !== undefined ? dto.enabled : 1,
    });
    const saved = await this.sensitiveWordRepository.save(word);
    // 重新加载词库
    await this.detectorService.reloadWords();
    return saved;
  }

  async update(id: number, dto: UpdateSensitiveWordDto) {
    await this.sensitiveWordRepository.update(id, dto);
    const updated = await this.sensitiveWordRepository.findOne({ where: { id } });
    // 重新加载词库
    await this.detectorService.reloadWords();
    return updated;
  }

  async remove(id: number) {
    await this.sensitiveWordRepository.delete(id);
    // 重新加载词库
    await this.detectorService.reloadWords();
  }
}


