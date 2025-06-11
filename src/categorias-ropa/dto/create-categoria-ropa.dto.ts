// src/categorias-ropa/dto/create-categoria-ropa.dto.ts
import { IsString } from 'class-validator';

export class CreateCategoriaRopaDto {
  @IsString()
  nombre: string;
}
