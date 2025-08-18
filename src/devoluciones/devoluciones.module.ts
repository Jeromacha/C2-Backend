// src/devoluciones/devoluciones.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Devolucion } from './entities/devolucion.entity';
import { DevolucionesService } from './devoluciones.service';
import { DevolucionesController } from './devoluciones.controller';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Talla } from '../tallas/entities/tallas.entity';
import { TallaRopa } from '../tallas-ropa/entities/talla-ropa.entity';
import { Bolso } from '../bolsos/entities/bolso.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Devolucion,
      Usuario,
      Talla,       // 👈 para zapatos
      TallaRopa,   // 👈 para ropa
      Bolso,       // 👈 para bolsos
    ]),
  ],
  controllers: [DevolucionesController],
  providers: [DevolucionesService],
})
export class DevolucionesModule {}
