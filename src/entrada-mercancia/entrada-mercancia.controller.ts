// src/entrada-mercancia/entrada-mercancia.controller.ts
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { EntradaMercanciaService } from './entrada-mercancia.service';
import { CreateEntradaMercanciaDto } from './dto/create-entrada-mercancia.dto';

@Controller('entradas')
export class EntradaMercanciaController {
  constructor(private readonly entradaService: EntradaMercanciaService) {}

  @Post()
  create(@Body() dto: CreateEntradaMercanciaDto) {
    return this.entradaService.create(dto);
  }

  @Get()
  findAll() {
    return this.entradaService.findAll();
  }

  @Get('rango-fechas')
  findByDateRange(@Query('start') start: string, @Query('end') end: string) {
    return this.entradaService.findByDateRange(new Date(start), new Date(end));
  }
}
