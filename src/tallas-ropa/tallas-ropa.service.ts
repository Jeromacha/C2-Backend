// src/tallas-ropa/tallas-ropa.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TallaRopa } from './entities/talla-ropa.entity';
import { Ropa } from '../ropa/entities/ropa.entity';
import { CreateTallaRopaDto } from './dto/create-talla-ropa.dto';

@Injectable()
export class TallasRopaService {
  constructor(
    @InjectRepository(TallaRopa)
    private readonly tallaRepo: Repository<TallaRopa>,

    @InjectRepository(Ropa)
    private readonly ropaRepo: Repository<Ropa>,
  ) {}

  async create(dto: CreateTallaRopaDto): Promise<TallaRopa> {
    const ropa = await this.ropaRepo.findOne({
      where: { nombre: dto.ropa_nombre, color: dto.ropa_color },
    });

    if (!ropa) {
      throw new NotFoundException(`Ropa '${dto.ropa_nombre}' color '${dto.ropa_color}' no encontrada`);
    }

    const talla = this.tallaRepo.create({
      talla: dto.talla,
      cantidad: dto.cantidad,
      ropa,
      ropa_nombre: dto.ropa_nombre,
      ropa_color: dto.ropa_color,
    });

    return await this.tallaRepo.save(talla);
  }

  async findAll(): Promise<TallaRopa[]> {
    return this.tallaRepo.find({ relations: ['ropa'] });
  }

  async findOne(talla: string, ropa_nombre: string, ropa_color: string): Promise<TallaRopa> {
    const result = await this.tallaRepo.findOne({
      where: { talla, ropa_nombre, ropa_color },
      relations: ['ropa'],
    });

    if (!result) {
      throw new NotFoundException(`Talla '${talla}' para prenda '${ropa_nombre}' color '${ropa_color}' no encontrada`);
    }

    return result;
  }

  async update(talla: string, ropa_nombre: string, ropa_color: string, cantidad: number): Promise<TallaRopa> {
    const existing = await this.findOne(talla, ropa_nombre, ropa_color);
    existing.cantidad = cantidad;
    return this.tallaRepo.save(existing);
  }

  async remove(talla: string, ropa_nombre: string, ropa_color: string): Promise<void> {
    const existing = await this.findOne(talla, ropa_nombre, ropa_color);
    await this.tallaRepo.remove(existing);
  }
}
