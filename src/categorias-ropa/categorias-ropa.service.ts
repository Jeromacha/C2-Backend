import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaRopa } from './entities/categoria-ropa.entity';
import { CreateCategoriaRopaDto } from './dto/create-categoria-ropa.dto';
import { UpdateCategoriaRopaDto } from './dto/update-categoria-ropa.dto';

@Injectable()
export class CategoriasRopaService {
  constructor(
    @InjectRepository(CategoriaRopa)
    private readonly categoriaRepo: Repository<CategoriaRopa>,
  ) {}

  async create(dto: CreateCategoriaRopaDto): Promise<CategoriaRopa> {
    const exists = await this.categoriaRepo.findOneBy({ nombre: dto.nombre });
    if (exists) {
      throw new ConflictException(`La categoría '${dto.nombre}' ya existe.`);
    }
    const categoria = this.categoriaRepo.create(dto);
    return await this.categoriaRepo.save(categoria);
  }

  findAll(): Promise<CategoriaRopa[]> {
    return this.categoriaRepo.find();
  }

  /**
   * Actualiza/renombra la categoría de ropa (PK = nombre).
   * Si dto.nombre viene y existe en otra fila, lanza Conflict.
   */
  async update(nombreActual: string, dto: UpdateCategoriaRopaDto): Promise<CategoriaRopa> {
    const categoria = await this.categoriaRepo.findOne({ where: { nombre: nombreActual } });
    if (!categoria) throw new NotFoundException(`Categoría de ropa '${nombreActual}' no encontrada.`);

    // Si desea renombrar, validar duplicado
    if (dto.nombre && dto.nombre !== nombreActual) {
      const dup = await this.categoriaRepo.findOne({ where: { nombre: dto.nombre } });
      if (dup) throw new ConflictException(`La categoría '${dto.nombre}' ya existe.`);
      categoria.nombre = dto.nombre;
    }

    // Si en el futuro agregas más campos en la entidad, los mergeas aquí:
    // Object.assign(categoria, dto);

    return this.categoriaRepo.save(categoria);
  }
}
