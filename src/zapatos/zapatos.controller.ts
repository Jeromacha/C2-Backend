import { Controller, Post, Body } from '@nestjs/common';
import { ZapatoService } from './zapatos.service';
import { CreateZapatoDto } from './dto/create-zapatos.dto';

@Controller('zapatos')
export class ZapatoController {
  constructor(private readonly zapatoService: ZapatoService) {}

  @Post()
  async create(@Body() createZapatoDto: CreateZapatoDto) {
    return this.zapatoService.create(createZapatoDto);
  }
}
