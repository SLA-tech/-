import {
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/v1/sessions')
// @UseGuards(JwtAuthGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  async findAll(@Query('page') page = '1', @Query('limit') limit = '20') {
    return await this.sessionsService.findAll(parseInt(page), parseInt(limit));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.sessionsService.findOne(parseInt(id));
  }

  @Put(':id/close')
  async close(@Param('id') id: string) {
    return await this.sessionsService.close(parseInt(id));
  }

  @Put(':id/block')
  async block(@Param('id') id: string) {
    return await this.sessionsService.block(parseInt(id));
  }
}


