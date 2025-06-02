import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';

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
}
