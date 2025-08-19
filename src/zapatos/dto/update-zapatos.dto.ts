import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateZapatoDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  ubicacion?: string;

  @IsOptional()
  @IsString()
  imagen_url?: string;

  @IsOptional()
  @IsNumber()
  precio?: number;

  @IsOptional()
  @IsString()
  categoriaNombre?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
