import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export enum TipoProducto {
  ZAPATO = 'zapato',
  ROPA = 'ropa',
  BOLSO = 'bolso',
}

export class CreateVentaDto {
  @IsEnum(TipoProducto)
  tipo: TipoProducto;

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
  talla?: string; // solo ropa/zapato

  @IsNumber()
  @IsNotEmpty()
  precio: number;

  @IsNumber()
  @IsNotEmpty()
  usuario_id: number;

  // Nuevo para bolso
  @IsOptional()
  @IsString()
  bolso_id?: string;
}
