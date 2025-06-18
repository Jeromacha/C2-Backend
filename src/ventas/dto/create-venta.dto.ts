// src/ventas/dto/create-venta.dto.ts
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export enum TipoProducto {
  ZAPATO = 'zapato',
  ROPA = 'ropa',
}

export class CreateVentaDto {
  @IsEnum(TipoProducto)
  tipo: TipoProducto;

  // Solo obligatorio si tipo === 'zapato'
  @IsNumber()
  @IsOptional()
  zapato_id?: number;

  // Solo obligatorio si tipo === 'ropa'
  @IsString()
  @IsOptional()
  nombre_producto?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsNotEmpty()
  talla: string;

  @IsNumber()
  @IsNotEmpty()
  precio: number;

  @IsNumber()
  @IsNotEmpty()
  usuario_id: number;
}
