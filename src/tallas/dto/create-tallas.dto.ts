import { IsNumber, Min } from 'class-validator';

export class CreateTallaDto {
  @IsNumber({}, { message: 'talla debe ser un número' })
  @Min(20, { message: 'talla no puede ser menor a 20' })
  talla: number;

  @IsNumber({}, { message: 'cantidad debe ser un número' })
  @Min(0, { message: 'cantidad no puede ser menor a 0' })
  cantidad: number;

  @IsNumber({}, { message: 'zapatoId debe ser un número' })
  zapatoId: number;
}
