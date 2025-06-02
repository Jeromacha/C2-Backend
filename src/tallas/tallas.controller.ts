import { Controller, Post, Get, Body, Delete, Param, ParseFloatPipe, ParseIntPipe } from '@nestjs/common';
import { TallasService } from './tallas.service';
import { CreateTallaDto } from './dto/create-tallas.dto';

@Controller('tallas')
export class TallaController {
  constructor(private readonly tallaService: TallasService) {}

  @Post()
  create(@Body() dto: CreateTallaDto) {
    return this.tallaService.create(dto);
  }

  @Get()
  findAll() {
    return this.tallaService.findAll();
  }

  @Get(':zapato_id')
  findByZapato(@Param('zapato_id', ParseIntPipe) zapato_id: number) {
    return this.tallaService.findByZapato(zapato_id);
  }

  @Delete(':talla/:zapato_id')
  delete(
    @Param('talla', ParseFloatPipe) talla: number,
    @Param('zapato_id', ParseIntPipe) zapato_id: number,
  ) {
    return this.tallaService.delete(talla, zapato_id);
  }
}