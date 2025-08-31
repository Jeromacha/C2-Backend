import { IsString, IsNotEmpty, IsNumber, IsOptional, IsInt } from 'class-validator';

export class CreateZapatoDto {
  @IsInt()
  id: number;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  ubicacion?: string;

  @IsString()
  @IsOptional()
  imagen_url?: string;

  @IsNumber()
  precio: number;

  @IsString()
  @IsNotEmpty()
  categoriaNombre: string;

  @IsString()
  @IsOptional()
  observaciones?: string;
}
