import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateBolsoDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  precio?: number;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cantidad?: number;
}
