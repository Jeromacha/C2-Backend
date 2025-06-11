// src/zapatos/dto/create-zapatos.dto.ts
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateZapatoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  ubicacion: string;

  @IsString()
  @IsNotEmpty()
  imagen_url: string;

  @IsNumber()
  precio: number;

  @IsString()
  @IsNotEmpty()
  categoriaNombre: string;
}
