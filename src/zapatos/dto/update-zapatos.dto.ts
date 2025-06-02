import { PartialType } from '@nestjs/mapped-types';
import { CreateZapatoDto } from './create-zapatos.dto';

export class UpdateZapatoDto extends PartialType(CreateZapatoDto) {}
