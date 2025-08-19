import { Controller, Post, Get, Param, Body, Delete, Patch, ParseIntPipe } from '@nestjs/common';
import { ZapatosService } from './zapatos.service';
import { CreateZapatoDto } from './dto/create-zapatos.dto';
import { UpdateZapatoDto } from './dto/update-zapatos.dto';

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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.zapatosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateZapatoDto) {
    return this.zapatosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.zapatosService.remove(id);
  }
}
