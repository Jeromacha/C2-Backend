import { IsNumber, IsPositive, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTallaDto {
  // Permitimos medios puntos (ej: 38.5), por eso IsNumber.
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  talla: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  cantidad: number;

  @Type(() => Number)
  @IsInt()
  zapato_id: number;
}
