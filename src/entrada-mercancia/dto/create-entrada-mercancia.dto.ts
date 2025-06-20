import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { TipoProducto } from '../../ventas/dto/create-venta.dto';

export class CreateEntradaMercanciaDto {
  @IsEnum(TipoProducto)
  tipo: TipoProducto;

  @IsNumber()
  @IsOptional()
  zapato_id?: number;

  @IsString()
  @IsOptional()
  ropa_nombre?: string;

  @IsString()
  @IsOptional()
  ropa_color?: string;

  @IsString()
  @IsOptional()
  bolso_id?: string;

  @IsString()
  @IsOptional()
  talla?: string;

  @IsNumber()
  @IsNotEmpty()
  cantidad: number;

  @IsNumber()
  @IsNotEmpty()
  usuario_id: number;
}
