import { Controller, Post, Get, Param, Body, Delete, Patch } from '@nestjs/common';
import { TallasRopaService } from './tallas-ropa.service';
import { CreateTallaRopaDto } from './dto/create-talla-ropa.dto';
import { UpdateTallaRopaDto } from './dto/update-talla-ropa.dto';

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

  @Patch(':talla/:ropa_nombre/:ropa_color')
  update(
    @Param('talla') talla: string,
    @Param('ropa_nombre') ropa_nombre: string,
    @Param('ropa_color') ropa_color: string,
    @Body() dto: UpdateTallaRopaDto,
  ) {
    return this.tallasRopaService.update(talla, ropa_nombre, ropa_color, dto);
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
