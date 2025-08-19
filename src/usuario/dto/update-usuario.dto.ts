import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';

// Hace que todos los campos sean opcionales para el update
export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {}
