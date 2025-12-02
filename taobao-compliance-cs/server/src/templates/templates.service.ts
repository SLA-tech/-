import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AutomatedTemplate } from '../entities/automated-template.entity';
import { CreateTemplateDto, UpdateTemplateDto } from '../dto/template.dto';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(AutomatedTemplate)
    private templateRepository: Repository<AutomatedTemplate>,
  ) {}

  async findAll() {
    return await this.templateRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async create(dto: CreateTemplateDto) {
    const template = this.templateRepository.create({
      name: dto.name,
      content: dto.content,
      loop_interval: dto.loop_interval || 60,
      max_loops: dto.max_loops || 0,
      keywords: dto.keywords,
      enabled: dto.enabled !== undefined ? dto.enabled : 1,
    });
    return await this.templateRepository.save(template);
  }

  async update(id: number, dto: UpdateTemplateDto) {
    await this.templateRepository.update(id, dto);
    return await this.templateRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    await this.templateRepository.delete(id);
  }
}


