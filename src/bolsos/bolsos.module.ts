import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bolso } from './entities/bolso.entity';
import { BolsosService } from './bolsos.service';
import { BolsosController } from './bolsos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Bolso])],
  providers: [BolsosService],
  controllers: [BolsosController],
  exports: [BolsosService],
})
export class BolsosModule {}
