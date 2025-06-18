// src/ventas/ventas.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from './entities/venta.entity';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Talla } from '../tallas/entities/tallas.entity';
import { TallaRopa } from '../tallas-ropa/entities/talla-ropa.entity';
import { Zapato } from '../zapatos/entities/zapato.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venta, Usuario, Talla, TallaRopa, Zapato])],
  controllers: [VentasController],
  providers: [VentasService],
})
export class VentasModule {}
