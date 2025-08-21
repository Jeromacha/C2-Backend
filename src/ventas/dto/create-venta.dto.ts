import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsISO8601 } from "class-validator";

export enum TipoProducto {
  ZAPATO = 'zapato',
  ROPA = 'ropa',
  BOLSO = 'bolso',
}

export class CreateVentaDto {
  @IsEnum(TipoProducto)
  tipo: TipoProducto;

  // NUEVO: fecha de la venta (YYYY-MM-DD o ISO8601)
  @IsISO8601({ strict: false }, { message: 'fecha debe ser una fecha válida (YYYY-MM-DD o ISO8601)' })
  @IsNotEmpty()
  fecha: string;

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
