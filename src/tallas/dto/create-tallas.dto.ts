// src/tallas/dto/create-talla.dto.ts
import { IsInt, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTallaDto {
  @Type(() => Number)
  @IsPositive()
  talla: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  cantidad: number;

  @Type(() => Number)
  @IsInt()
  zapato_id: number;
}
