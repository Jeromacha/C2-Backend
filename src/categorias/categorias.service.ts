import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepo: Repository<Categoria>,
  ) {}

  create(data: CreateCategoriaDto) {
    const categoria = this.categoriaRepo.create(data);
    return this.categoriaRepo.save(categoria);
  }

  findAll() {
    return this.categoriaRepo.find();
  }

  /**
   * Actualiza (renombra) una categoría cuya PK es 'nombre'.
   * Si en updateDto.nombre viene un valor distinto, se cambia la PK.
   */
  async update(nombreActual: string, updateDto: UpdateCategoriaDto) {
    const categoria = await this.categoriaRepo.findOne({ where: { nombre: nombreActual } });
    if (!categoria) throw new NotFoundException(`Categoría '${nombreActual}' no encontrada.`);

    // Aplica cambios (por ahora solo 'nombre')
    if (typeof updateDto.nombre === 'string' && updateDto.nombre.trim().length > 0) {
      categoria.nombre = updateDto.nombre.trim();
    }

    // Si en el futuro agregas más campos, se mergean aquí
    // Object.assign(categoria, updateDto);

    return this.categoriaRepo.save(categoria);
  }
}
