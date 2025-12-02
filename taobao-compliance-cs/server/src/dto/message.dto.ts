import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import { ContentType } from '../entities/message.entity';

export class InboundMessageDto {
  @IsString()
  taobao_user_id: string;

  @IsString()
  content: string;

  @IsEnum(ContentType)
  @IsOptional()
  content_type?: ContentType;

  @IsObject()
  @IsOptional()
  source_meta?: Record<string, any>;
}

export class OutboundMessageDto {
  @IsString()
  session_id: string;

  @IsString()
  content: string;

  @IsEnum(ContentType)
  @IsOptional()
  content_type?: ContentType;
}


