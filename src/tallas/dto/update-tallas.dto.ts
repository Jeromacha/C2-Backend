// src/tallas/dto/update-talla.dto.ts
import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTallaDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  cantidad?: number;
}
