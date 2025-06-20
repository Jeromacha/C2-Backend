// src/devoluciones/dto/create-devolucion.dto.ts
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export enum TipoProducto {
  ZAPATO = 'zapato',
  ROPA = 'ropa',
  BOLSO = 'bolso', 
}

export class CreateDevolucionDto {
  @IsEnum(TipoProducto)
  tipo: TipoProducto;

  @IsString()
  @IsNotEmpty()
  producto_entregado: string;

  @IsString()
  @IsOptional()
  color_entregado?: string;

  @IsString()
  @IsNotEmpty()
  talla_entregada: string;

  @IsString()
  @IsNotEmpty()
  producto_recibido: string;

  @IsString()
  @IsOptional()
  color_recibido?: string;

  @IsString()
  @IsNotEmpty()
  talla_recibida: string;

  @IsNumber()
  @IsNotEmpty()
  precio_entregado: number;

  @IsNumber()
  @IsNotEmpty()
  precio_recibido: number;

  @IsNumber()
  @IsNotEmpty()
  diferencia_pago: number;

  @IsNumber()
  @IsNotEmpty()
  usuario_id: number;
}
