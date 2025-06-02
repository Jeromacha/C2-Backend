import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Zapato } from './entities/zapato.entity';
import { Categoria } from '../categorias/entities/categoria.entity';
import { CreateZapatoDto } from './dto/create-zapatos.dto';

@Injectable()
export class ZapatoService {
  constructor(
    @InjectRepository(Zapato) private zapatoRepo: Repository<Zapato>,
    @InjectRepository(Categoria) private categoriaRepo: Repository<Categoria>,
  ) {}

  async create(createZapatoDto: CreateZapatoDto): Promise<Zapato> {
    const categoria = await this.categoriaRepo.findOneBy({ nombre: createZapatoDto.categoriaNombre });
    if (!categoria) {
      throw new NotFoundException(`Categoría ${createZapatoDto.categoriaNombre} no encontrada`);
    }

    const zapato = this.zapatoRepo.create({
      nombre: createZapatoDto.nombre,
      precio: createZapatoDto.precio,
      categoria,
    });

    return this.zapatoRepo.save(zapato);
  }

  // Similar para update...
}
