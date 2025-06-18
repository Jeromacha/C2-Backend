// src/devoluciones/devoluciones.controller.ts
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { DevolucionesService } from './devoluciones.service';
import { CreateDevolucionDto } from './dto/create-devolucion.dto';

@Controller('devoluciones')
export class DevolucionesController {
  constructor(private readonly devolucionesService: DevolucionesService) {}

  @Post()
  create(@Body() dto: CreateDevolucionDto) {
    return this.devolucionesService.create(dto);
  }

  @Get()
  findAll() {
    return this.devolucionesService.findAll();
  }

  @Get('rango-fechas')
  findByDateRange(@Query('start') start: string, @Query('end') end: string) {
    return this.devolucionesService.findByDateRange(new Date(start), new Date(end));
  }
}
