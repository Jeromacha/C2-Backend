import { Controller, Post, Body, Get, Query, Patch, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { DevolucionesService } from './devoluciones.service';
import { CreateDevolucionDto } from './dto/create-devolucion.dto';
import { UpdateDevolucionDto } from './dto/update-devolucion.dto';

@Controller('devoluciones')
export class DevolucionesController {
  constructor(private readonly devolucionesService: DevolucionesService) {}

  @Post()
  create(@Body() dto: CreateDevolucionDto) {
    return this.devolucionesService.create(dto);
  }

  @Get()
  findAll() {
    return this.devolucionesService.findAll();
  }

  @Get('rango-fechas')
  findByDateRange(@Query('start') start: string, @Query('end') end: string) {
    return this.devolucionesService.findByDateRange(new Date(start), new Date(end));
  }

  /**
   * Actualiza un registro de devolución (no ajusta inventario).
   * PATCH /devoluciones/:id
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDevolucionDto,
  ) {
    return this.devolucionesService.update(id, dto);
  }

  /**
   * Elimina un registro de devolución (no ajusta inventario).
   * DELETE /devoluciones/:id
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.devolucionesService.remove(id);
  }
}
