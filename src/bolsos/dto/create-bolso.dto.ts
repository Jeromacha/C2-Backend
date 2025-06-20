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

  @IsOptional()
  @IsString()
  observaciones?: string;
}
