import { Controller, Post, Body, Get, Patch, Param, NotFoundException } from '@nestjs/common';
import { CategoriasRopaService } from './categorias-ropa.service';
import { CreateCategoriaRopaDto } from './dto/create-categoria-ropa.dto';
import { UpdateCategoriaRopaDto } from './dto/update-categoria-ropa.dto';

@Controller('categorias-ropa')
export class CategoriasRopaController {
  constructor(private readonly categoriasService: CategoriasRopaService) {}

  @Post()
  create(@Body() dto: CreateCategoriaRopaDto) {
    return this.categoriasService.create(dto);
  }

  @Get()
  findAll() {
    return this.categoriasService.findAll();
  }

  /**
   * Renombra/actualiza la categoría de ropa cuya PK es `nombre`.
   * PATCH /categorias-ropa/:nombreActual
   * Body: { nombre?: string }
   */
  @Patch(':nombre')
  async update(
    @Param('nombre') nombreActual: string,
    @Body() dto: UpdateCategoriaRopaDto,
  ) {
    const updated = await this.categoriasService.update(nombreActual, dto);
    if (!updated) {
      throw new NotFoundException(`Categoría de ropa '${nombreActual}' no encontrada.`);
    }
    return updated;
  }
}
