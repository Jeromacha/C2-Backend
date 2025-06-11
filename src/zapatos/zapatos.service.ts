import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Zapato } from './entities/zapato.entity';
import { CreateZapatoDto } from './dto/create-zapatos.dto';
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
    const categoria = await this.categoriaRepo.findOneBy({ nombre: dto.categoriaNombre });
    if (!categoria) {
      throw new NotFoundException(`Categoría '${dto.categoriaNombre}' no encontrada.`);
    }

    const zapato = this.zapatoRepo.create({
      nombre: dto.nombre,
      ubicacion: dto.ubicacion,
      imagen_url: dto.imagen_url,
      precio: dto.precio,
      categoriaNombre: dto.categoriaNombre,
      categoria: categoria,
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
    if (!zapato) throw new NotFoundException(`Zapato con ID ${id} no encontrado.`);
    return zapato;
  }

  async remove(id: number): Promise<void> {
    const result = await this.zapatoRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Zapato con ID ${id} no encontrado.`);
    }
  }
}
