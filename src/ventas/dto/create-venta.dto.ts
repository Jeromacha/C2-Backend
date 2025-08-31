import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export enum TipoProducto {
  ZAPATO = 'zapato',
  ROPA   = 'ropa',
  BOLSO  = 'bolso',
}

export class CreateVentaDto {
  @IsEnum(TipoProducto)
  tipo: TipoProducto;

  // ⚠️ SIN fecha: la pone la DB (como en devoluciones)

  @IsOptional()
  @IsNumber()
  zapato_id?: number;

  @IsOptional()
  @IsString()
  nombre_producto?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  talla?: string;

  @IsNumber()
  @IsNotEmpty()
  precio: number;

  @IsNumber()
  @IsNotEmpty()
  usuario_id: number;

  @IsOptional()
  @IsString()
  bolso_id?: string;
}
