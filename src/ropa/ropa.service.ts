import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ropa } from './entities/ropa.entity';
import { CategoriaRopa } from '../categorias-ropa/entities/categoria-ropa.entity';
import { CreateRopaDto } from './dto/create-ropa.dto';
import { UpdateRopaDto } from './dto/update-ropa.dto';

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

  async update(nombre: string, color: string, dto: UpdateRopaDto): Promise<Ropa> {
    const ropa = await this.ropaRepo.findOne({
      where: { nombre, color },
      relations: ['tallas'],
    });
    if (!ropa) {
      throw new NotFoundException(`Prenda '${nombre}' de color '${color}' no encontrada.`);
    }

    // No permitir cambiar PKs aquí
    if ((dto as any).nombre || (dto as any).color) {
      throw new BadRequestException('No se permite cambiar nombre o color en este endpoint.');
    }

    // Validar categoría si viene en el DTO
    if (dto.categoriaNombre) {
      const categoria = await this.categoriaRepo.findOneBy({ nombre: dto.categoriaNombre });
      if (!categoria) {
        throw new NotFoundException(`Categoría '${dto.categoriaNombre}' no encontrada.`);
      }
      ropa.categoria = categoria;
      ropa.categoriaNombre = dto.categoriaNombre;
    }

    // Mezclar campos restantes
    if (dto.precio !== undefined) ropa.precio = dto.precio;
    if (dto.imagen_url !== undefined) ropa.imagen_url = dto.imagen_url;
    if (dto.observaciones !== undefined) ropa.observaciones = dto.observaciones;

    return this.ropaRepo.save(ropa);
  }

  async remove(nombre: string, color: string): Promise<void> {
    const ropa = await this.findOne(nombre, color);
    await this.ropaRepo.remove(ropa);
  }
}
