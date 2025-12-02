import { IsString, IsInt, IsOptional, Min } from 'class-validator';

export class CreateTemplateDto {
  @IsString()
  name: string;

  @IsString()
  content: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  loop_interval?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  max_loops?: number;

  @IsString()
  @IsOptional()
  keywords?: string;

  @IsInt()
  @IsOptional()
  enabled?: number;
}

export class UpdateTemplateDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  loop_interval?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  max_loops?: number;

  @IsString()
  @IsOptional()
  keywords?: string;

  @IsInt()
  @IsOptional()
  enabled?: number;
}


