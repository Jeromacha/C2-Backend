// src/tallas/dto/update-talla.dto.ts
import { IsOptional, IsInt, Min } from 'class-validator';

export class UpdateTallaDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  cantidad?: number;
}
