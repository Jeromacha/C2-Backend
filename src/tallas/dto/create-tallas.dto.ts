// src/tallas/dto/create-talla.dto.ts
import { IsNumber, IsInt, Min } from 'class-validator';

export class CreateTallaDto {
  @IsNumber()
  talla: number;

  @IsInt()
  @Min(0)
  cantidad: number;

  @IsInt()
  zapato_id: number;
}
