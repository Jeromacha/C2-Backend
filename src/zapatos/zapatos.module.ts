import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZapatosService } from './zapatos.service';
import { ZapatosController } from './zapatos.controller';
import { Zapato } from './entities/zapato.entity';
import { Categoria } from '../categorias/entities/categoria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Zapato, Categoria])],
  controllers: [ZapatosController],
  providers: [ZapatosService],
})
export class ZapatosModule {}