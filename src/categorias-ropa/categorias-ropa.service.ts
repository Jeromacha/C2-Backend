// src/categorias-ropa/categorias-ropa.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaRopa } from './entities/categoria-ropa.entity';
import { CreateCategoriaRopaDto } from './dto/create-categoria-ropa.dto';

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
}
