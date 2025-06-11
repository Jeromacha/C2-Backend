// src/tallas-ropa/tallas-ropa.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TallasRopaService } from './tallas-ropa.service';
import { TallasRopaController } from './tallas-ropa.controller';
import { TallaRopa } from './entities/talla-ropa.entity';
import { Ropa } from '../ropa/entities/ropa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TallaRopa, Ropa])],
  controllers: [TallasRopaController],
  providers: [TallasRopaService],
})
export class TallasRopaModule {}
