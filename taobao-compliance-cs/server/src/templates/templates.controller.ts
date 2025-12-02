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
import { TemplatesService } from './templates.service';
import { CreateTemplateDto, UpdateTemplateDto } from '../dto/template.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/v1/templates')
// @UseGuards(JwtAuthGuard)
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  async findAll() {
    return await this.templatesService.findAll();
  }

  @Post()
  async create(@Body() dto: CreateTemplateDto) {
    return await this.templatesService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateTemplateDto) {
    return await this.templatesService.update(parseInt(id), dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.templatesService.remove(parseInt(id));
    return { status: 'ok' };
  }
}


