import { Controller, Get, Post, Body, Patch, Param, NotFoundException } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post()
  create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriasService.create(createCategoriaDto);
  }

  @Get()
  findAll() {
    return this.categoriasService.findAll();
  }

  /**
   * PATCH /categorias/:nombreActual
   * Body: { nombre?: string }
   * Si envías "nombre", se renombra la categoría (como es PK).
   */
  @Patch(':nombre')
  async update(
    @Param('nombre') nombreActual: string,
    @Body() updateDto: UpdateCategoriaDto,
  ) {
    const updated = await this.categoriasService.update(nombreActual, updateDto);
    if (!updated) {
      throw new NotFoundException(`Categoría '${nombreActual}' no encontrada.`);
    }
    return updated;
  }
}
