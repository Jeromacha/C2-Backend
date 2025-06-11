// src/ropa/ropa.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ropa } from './entities/ropa.entity';
import { CategoriaRopa } from '../categorias-ropa/entities/categoria-ropa.entity';
import { CreateRopaDto } from './dto/create-ropa.dto';

@Injectable()
export class RopaService {
  constructor(
    @InjectRepository(Ropa)
    private readonly ropaRepo: Repository<Ropa>,

    @InjectRepository(CategoriaRopa)
    private readonly categoriaRepo: Repository<CategoriaRopa>,
  ) {}

  async create(dto: CreateRopaDto): Promise<Ropa> {
    const categoria = await this.categoriaRepo.findOneBy({ nombre: dto.categoriaNombre });
    if (!categoria) {
      throw new NotFoundException(`Categoría '${dto.categoriaNombre}' no encontrada.`);
    }

    const ropa = this.ropaRepo.create({
      ...dto,
      categoria,
    });

    return this.ropaRepo.save(ropa);
  }

  async findAll(): Promise<Ropa[]> {
    return this.ropaRepo.find({ relations: ['tallas'] });
  }

  async findOne(nombre: string, color: string): Promise<Ropa> {
    const ropa = await this.ropaRepo.findOne({
      where: { nombre, color },
      relations: ['tallas'],
    });

    if (!ropa) {
      throw new NotFoundException(`Prenda '${nombre}' de color '${color}' no encontrada.`);
    }

    return ropa;
  }

  async remove(nombre: string, color: string): Promise<void> {
    const ropa = await this.findOne(nombre, color);
    await this.ropaRepo.remove(ropa);
  }
}
