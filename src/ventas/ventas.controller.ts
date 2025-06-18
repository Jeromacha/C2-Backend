// src/ventas/ventas.controller.ts
import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';

@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  create(@Body() dto: CreateVentaDto) {
    return this.ventasService.create(dto);
  }

  @Get()
  findAll() {
    return this.ventasService.findAll();
  }

  @Get('rango-fechas')
  findByDateRange(@Query('start') start: string, @Query('end') end: string) {
    return this.ventasService.findByDateRange(new Date(start), new Date(end));
  }

  @Get('ganancias')
  async getGanancias(
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    const startDate = start ? new Date(start) : undefined;
    const endDate = end ? new Date(end) : undefined;
    const total = await this.ventasService.calcularGanancias(startDate, endDate);
    return { total };
  }
}
