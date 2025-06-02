// src/zapatos/zapato.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Zapato } from './entities/zapato.entity';
import { ZapatoService } from './zapatos.service';
import { ZapatoController } from './zapatos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Zapato])],
  providers: [ZapatoService],
  controllers: [ZapatoController],
})
export class ZapatoModule {}
