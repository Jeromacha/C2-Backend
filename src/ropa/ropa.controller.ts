// src/ropa/ropa.controller.ts
import { Controller, Post, Get, Param, Body, Delete } from '@nestjs/common';
import { RopaService } from './ropa.service';
import { CreateRopaDto } from './dto/create-ropa.dto';

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

  @Delete(':nombre/:color')
  remove(@Param('nombre') nombre: string, @Param('color') color: string) {
    return this.ropaService.remove(nombre, color);
  }
}
