// src/ropa/ropa.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RopaService } from './ropa.service';
import { RopaController } from './ropa.controller';
import { Ropa } from './entities/ropa.entity';
import { CategoriaRopa } from '../categorias-ropa/entities/categoria-ropa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ropa, CategoriaRopa])],
  controllers: [RopaController],
  providers: [RopaService],
})
export class RopaModule {}
