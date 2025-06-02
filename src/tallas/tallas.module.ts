import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TallasService } from './tallas.service';
import { TallaController } from './tallas.controller';
import { Talla } from './entities/tallas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Talla])],
  providers: [TallasService],
  controllers: [TallaController],
  exports: [TallasService], // para usar en ZapatosService si es necesario
})
export class TallasModule {}
