// src/tallas-ropa/dto/create-talla-ropa.dto.ts
import { IsString, IsInt, Min } from 'class-validator';

export class CreateTallaRopaDto {
  @IsString()
  talla: string;

  @IsInt()
  @Min(0)
  cantidad: number;

  @IsString()
  ropa_nombre: string;

  @IsString()
  ropa_color: string;
}
