import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateZapatoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsNumber()
  precio: number;

  @IsNotEmpty()
  @IsString()
  categoriaNombre: string; // Aquí el nombre de la categoría a relacionar
}
