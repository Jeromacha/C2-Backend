import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaRopaDto } from './create-categoria-ropa.dto';

export class UpdateCategoriaRopaDto extends PartialType(CreateCategoriaRopaDto) {}
