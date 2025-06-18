// src/entrada-mercancia/dto/create-entrada-mercancia.dto.ts
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { TipoProducto } from '../../ventas/dto/create-venta.dto';

export class CreateEntradaMercanciaDto {
  @IsEnum(TipoProducto)
  tipo: TipoProducto;

  // Solo si es zapato
  @IsNumber()
  @IsOptional()
  zapato_id?: number;

  // Solo si es ropa
  @IsString()
  @IsOptional()
  ropa_nombre?: string;

  @IsString()
  @IsOptional()
  ropa_color?: string;

  @IsString()
  @IsNotEmpty()
  talla: string;

  @IsNumber()
  @IsNotEmpty()
  cantidad: number;

  @IsNumber()
  @IsNotEmpty()
  usuario_id: number;
}
