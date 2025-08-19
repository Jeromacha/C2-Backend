import { Controller, Post, Get, Body, Param, Put, Delete } from '@nestjs/common';
import { BolsosService } from './bolsos.service';
import { CreateBolsoDto } from './dto/create-bolso.dto';
import { UpdateBolsoDto } from './dto/update-bolso.dto';

@Controller('bolsos')
export class BolsosController {
  constructor(private readonly bolsosService: BolsosService) {}

  @Post()
  create(@Body() dto: CreateBolsoDto) {
    return this.bolsosService.create(dto);
  }

  @Get()
  findAll() {
    return this.bolsosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bolsosService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBolsoDto) {
    return this.bolsosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bolsosService.remove(id);
  }
}
