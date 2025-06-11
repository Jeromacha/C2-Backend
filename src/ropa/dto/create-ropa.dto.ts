// src/ropa/dto/create-ropa.dto.ts
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateRopaDto {
  @IsString()
  nombre: string;

  @IsString()
  color: string;

  @IsNumber()
  precio: number;

  @IsString()
  imagen_url: string;

  @IsString()
  categoriaNombre: string;

  @IsString()
  @IsOptional()
  observaciones?: string;  // ✅ Agregado
}
