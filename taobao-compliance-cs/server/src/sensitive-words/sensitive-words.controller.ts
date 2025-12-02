import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SensitiveWordsService } from './sensitive-words.service';
import { CreateSensitiveWordDto, UpdateSensitiveWordDto } from '../dto/sensitive-word.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/v1/sensitive-words')
// @UseGuards(JwtAuthGuard)
export class SensitiveWordsController {
  constructor(private readonly sensitiveWordsService: SensitiveWordsService) {}

  @Get()
  async findAll() {
    return await this.sensitiveWordsService.findAll();
  }

  @Post()
  async create(@Body() dto: CreateSensitiveWordDto) {
    return await this.sensitiveWordsService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateSensitiveWordDto) {
    return await this.sensitiveWordsService.update(parseInt(id), dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.sensitiveWordsService.remove(parseInt(id));
    return { status: 'ok' };
  }
}


