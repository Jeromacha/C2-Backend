import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Zapato } from './entities/zapato.entity';
import { CreateZapatoDto } from './dto/create-zapatos.dto';
import { UpdateZapatoDto } from './dto/update-zapatos.dto';
import { Categoria } from '../categorias/entities/categoria.entity';

@Injectable()
export class ZapatosService {
  constructor(
    @InjectRepository(Zapato)
    private readonly zapatoRepo: Repository<Zapato>,

    @InjectRepository(Categoria)
    private readonly categoriaRepo: Repository<Categoria>,
  ) {}

  async create(dto: CreateZapatoDto): Promise<Zapato> {
    const categoria = await this.categoriaRepo.findOneBy({
      nombre: dto.categoriaNombre,
    });
    if (!categoria) {
      throw new NotFoundException(
        `Categoría '${dto.categoriaNombre}' no encontrada.`,
      );
    }

    const zapato = this.zapatoRepo.create({
      id: dto.id,
      nombre: dto.nombre,
      ubicacion: dto.ubicacion,
      imagen_url: dto.imagen_url,
      precio: dto.precio,
      categoriaNombre: dto.categoriaNombre,
      observaciones: dto.observaciones,
      categoria,
    });

    return await this.zapatoRepo.save(zapato);
  }

  async findAll(): Promise<Zapato[]> {
    return this.zapatoRepo.find({ relations: ['tallas'] });
  }

  async findOne(id: number): Promise<Zapato> {
    const zapato = await this.zapatoRepo.findOne({
      where: { id },
      relations: ['tallas'],
    });
    if (!zapato) {
      throw new NotFoundException(`Zapato con ID ${id} no encontrado.`);
    }
    return zapato;
  }

  async update(id: number, dto: UpdateZapatoDto): Promise<Zapato> {
    const zapato = await this.zapatoRepo.findOne({ where: { id } });
    if (!zapato) {
      throw new NotFoundException(`Zapato con ID ${id} no encontrado.`);
    }

    // Si cambia la categoría, validar que exista
    if (dto.categoriaNombre) {
      const categoria = await this.categoriaRepo.findOneBy({
        nombre: dto.categoriaNombre,
      });
      if (!categoria) {
        throw new NotFoundException(
          `Categoría '${dto.categoriaNombre}' no encontrada.`,
        );
      }
      zapato.categoriaNombre = dto.categoriaNombre;
      zapato.categoria = categoria;
    }

    // Asignar el resto de campos (sin tocar el id)
    if (dto.nombre !== undefined) zapato.nombre = dto.nombre;
    if (dto.ubicacion !== undefined) zapato.ubicacion = dto.ubicacion;
    if (dto.imagen_url !== undefined) zapato.imagen_url = dto.imagen_url;
    if (dto.precio !== undefined) zapato.precio = dto.precio;
    if (dto.observaciones !== undefined) zapato.observaciones = dto.observaciones;

    return this.zapatoRepo.save(zapato);
  }

  async remove(id: number): Promise<void> {
    const result = await this.zapatoRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Zapato con ID ${id} no encontrado.`);
    }
  }
}
