import { IsString, IsEnum, IsInt, IsOptional, Min, Max } from 'class-validator';
import { SensitiveWordType } from '../entities/sensitive-word.entity';

export class CreateSensitiveWordDto {
  @IsString()
  word: string;

  @IsEnum(SensitiveWordType)
  @IsOptional()
  type?: SensitiveWordType;

  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  severity?: number;

  @IsInt()
  @IsOptional()
  enabled?: number;
}

export class UpdateSensitiveWordDto {
  @IsString()
  @IsOptional()
  word?: string;

  @IsEnum(SensitiveWordType)
  @IsOptional()
  type?: SensitiveWordType;

  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  severity?: number;

  @IsInt()
  @IsOptional()
  enabled?: number;
}


