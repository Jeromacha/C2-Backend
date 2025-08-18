import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBolsoDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsNumber()
  precio: number;

  @IsNumber()
  @IsNotEmpty()
  cantidad: number;   // 👈 agregado obligatorio en el DTO

  @IsOptional()
  @IsString()
  observaciones?: string;
}
