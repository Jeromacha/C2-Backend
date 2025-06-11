// src/categorias-ropa/categorias-ropa.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { CategoriasRopaService } from './categorias-ropa.service';
import { CreateCategoriaRopaDto } from './dto/create-categoria-ropa.dto';

@Controller('categorias-ropa')
export class CategoriasRopaController {
  constructor(private readonly categoriasService: CategoriasRopaService) {}

  @Post()
  create(@Body() dto: CreateCategoriaRopaDto) {
    return this.categoriasService.create(dto);
  }

  @Get()
  findAll() {
    return this.categoriasService.findAll();
  }
}
