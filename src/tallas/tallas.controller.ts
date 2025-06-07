// src/tallas/tallas.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseFloatPipe, ParseIntPipe } from '@nestjs/common';
import { TallasService } from './tallas.service';
import { CreateTallaDto } from './dto/create-tallas.dto';
import { UpdateTallaDto } from './dto/update-tallas.dto';

@Controller('tallas')
export class TallasController {
  constructor(private readonly tallasService: TallasService) {}

  @Post()
  create(@Body() createTallaDto: CreateTallaDto) {
    return this.tallasService.create(createTallaDto);
  }

  @Get()
  findAll() {
    return this.tallasService.findAll();
  }

  @Get(':talla/:zapato_id')
  findOne(
    @Param('talla', ParseFloatPipe) talla: number,
    @Param('zapato_id', ParseIntPipe) zapato_id: number,
  ) {
    return this.tallasService.findOne(talla, zapato_id);
  }

  @Patch(':talla/:zapato_id')
  update(
    @Param('talla', ParseFloatPipe) talla: number,
    @Param('zapato_id', ParseIntPipe) zapato_id: number,
    @Body() updateTallaDto: UpdateTallaDto,
  ) {
    return this.tallasService.update(talla, zapato_id, updateTallaDto);
  }

  @Delete(':talla/:zapato_id')
  remove(
    @Param('talla', ParseFloatPipe) talla: number,
    @Param('zapato_id', ParseIntPipe) zapato_id: number,
  ) {
    return this.tallasService.remove(talla, zapato_id);
  }
}
