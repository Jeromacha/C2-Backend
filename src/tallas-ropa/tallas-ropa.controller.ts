// src/tallas-ropa/tallas-ropa.controller.ts
import { Controller, Post, Get, Param, Body, Delete, Patch, ParseIntPipe } from '@nestjs/common';
import { TallasRopaService } from './tallas-ropa.service';
import { CreateTallaRopaDto } from './dto/create-talla-ropa.dto';

@Controller('tallas-ropa')
export class TallasRopaController {
  constructor(private readonly tallasRopaService: TallasRopaService) {}

  @Post()
  create(@Body() dto: CreateTallaRopaDto) {
    return this.tallasRopaService.create(dto);
  }

  @Get()
  findAll() {
    return this.tallasRopaService.findAll();
  }

  @Get(':talla/:ropa_nombre/:ropa_color')
  findOne(
    @Param('talla') talla: string,
    @Param('ropa_nombre') ropa_nombre: string,
    @Param('ropa_color') ropa_color: string,
  ) {
    return this.tallasRopaService.findOne(talla, ropa_nombre, ropa_color);
  }

  @Patch(':talla/:ropa_nombre/:ropa_color/:cantidad')
  update(
    @Param('talla') talla: string,
    @Param('ropa_nombre') ropa_nombre: string,
    @Param('ropa_color') ropa_color: string,
    @Param('cantidad', ParseIntPipe) cantidad: number,
  ) {
    return this.tallasRopaService.update(talla, ropa_nombre, ropa_color, cantidad);
  }

  @Delete(':talla/:ropa_nombre/:ropa_color')
  remove(
    @Param('talla') talla: string,
    @Param('ropa_nombre') ropa_nombre: string,
    @Param('ropa_color') ropa_color: string,
  ) {
    return this.tallasRopaService.remove(talla, ropa_nombre, ropa_color);
  }
}
