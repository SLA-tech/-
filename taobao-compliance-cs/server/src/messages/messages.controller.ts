import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { InboundMessageDto, OutboundMessageDto } from '../dto/message.dto';

@Controller('api/v1/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('inbound')
  async receiveMessage(@Body() dto: InboundMessageDto) {
    await this.messagesService.processInboundMessage(dto);
    return { status: 'ok' };
  }

  @Post('outbound')
  async sendMessage(@Body() dto: OutboundMessageDto) {
    await this.messagesService.sendOutboundMessage(
      parseInt(dto.session_id),
      dto.content,
      dto.content_type,
    );
    return { status: 'queued' };
  }

  @Get('session/:sessionId')
  async getSessionMessages(@Param('sessionId') sessionId: string) {
    return await this.messagesService.getSessionMessages(parseInt(sessionId));
  }
}


