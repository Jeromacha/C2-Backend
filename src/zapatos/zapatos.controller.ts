import { Controller, Post, Get, Param, Body, Delete } from '@nestjs/common';
import { ZapatosService } from './zapatos.service';
import { CreateZapatoDto } from './dto/create-zapatos.dto';

@Controller('zapatos')
export class ZapatosController {
  constructor(private readonly zapatosService: ZapatosService) {}

  @Post()
  create(@Body() dto: CreateZapatoDto) {
    return this.zapatosService.create(dto);
  }

  @Get()
  findAll() {
    return this.zapatosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.zapatosService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.zapatosService.remove(+id);
  }
}