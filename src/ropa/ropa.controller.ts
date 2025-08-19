import { Controller, Post, Get, Param, Body, Delete, Patch, BadRequestException } from '@nestjs/common';
import { RopaService } from './ropa.service';
import { CreateRopaDto } from './dto/create-ropa.dto';
import { UpdateRopaDto } from './dto/update-ropa.dto';

@Controller('ropa')
export class RopaController {
  constructor(private readonly ropaService: RopaService) {}

  @Post()
  create(@Body() dto: CreateRopaDto) {
    return this.ropaService.create(dto);
  }

  @Get()
  findAll() {
    return this.ropaService.findAll();
  }

  @Get(':nombre/:color')
  findOne(@Param('nombre') nombre: string, @Param('color') color: string) {
    return this.ropaService.findOne(nombre, color);
  }

  @Patch(':nombre/:color')
  update(
    @Param('nombre') nombre: string,
    @Param('color') color: string,
    @Body() dto: UpdateRopaDto,
  ) {
    // No permitir cambiar PKs en este endpoint
    if ((dto as any).nombre || (dto as any).color) {
      throw new BadRequestException('No se permite cambiar nombre o color en update. Usa un endpoint de renombrado.');
    }
    return this.ropaService.update(nombre, color, dto);
  }

  @Delete(':nombre/:color')
  remove(@Param('nombre') nombre: string, @Param('color') color: string) {
    return this.ropaService.remove(nombre, color);
  }
}
