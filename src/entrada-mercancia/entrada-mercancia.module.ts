// src/entrada-mercancia/entrada-mercancia.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntradaMercancia } from './entities/entrada-mercancia.entity';
import { EntradaMercanciaService } from './entrada-mercancia.service';
import { EntradaMercanciaController } from './entrada-mercancia.controller';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Talla } from '../tallas/entities/tallas.entity';
import { TallaRopa } from '../tallas-ropa/entities/talla-ropa.entity';
import { Bolso } from '../bolsos/entities/bolso.entity'; // 👈 importar entidad bolso

@Module({
  imports: [
    TypeOrmModule.forFeature([EntradaMercancia, Usuario, Talla, TallaRopa, Bolso]), // 👈 agregar Bolso aquí
  ],
  controllers: [EntradaMercanciaController],
  providers: [EntradaMercanciaService],
})
export class EntradaMercanciaModule {}
