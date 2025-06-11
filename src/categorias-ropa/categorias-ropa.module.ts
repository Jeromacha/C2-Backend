// src/categorias-ropa/categorias-ropa.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaRopa } from './entities/categoria-ropa.entity';
import { CategoriasRopaService } from './categorias-ropa.service';
import { CategoriasRopaController } from './categorias-ropa.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriaRopa])],
  controllers: [CategoriasRopaController],
  providers: [CategoriasRopaService],
  exports: [CategoriasRopaService],
})
export class CategoriasRopaModule {}
