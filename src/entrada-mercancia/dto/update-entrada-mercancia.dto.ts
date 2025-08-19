import { PartialType } from '@nestjs/mapped-types';
import { CreateEntradaMercanciaDto } from './create-entrada-mercancia.dto';

/**
 * Update parcial: todos los campos opcionales.
 * Al actualizar una entrada, el servicio revierte el efecto anterior
 * en inventario y aplica el nuevo (si cambian campos relevantes o cantidad).
 */
export class UpdateEntradaMercanciaDto extends PartialType(CreateEntradaMercanciaDto) {}
