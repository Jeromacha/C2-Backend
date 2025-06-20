import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { BolsosService } from './bolsos.service';
import { CreateBolsoDto } from './dto/create-bolso.dto';

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
}
