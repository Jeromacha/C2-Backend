// src/devoluciones/devoluciones.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Devolucion } from './entities/devolucion.entity';
import { CreateDevolucionDto } from './dto/create-devolucion.dto';
import { Usuario } from '../usuario/entities/usuario.entity';

@Injectable()
export class DevolucionesService {
  constructor(
    @InjectRepository(Devolucion)
    private readonly devolucionRepo: Repository<Devolucion>,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  async create(dto: CreateDevolucionDto): Promise<Devolucion> {
    const usuario = await this.usuarioRepo.findOne({ where: { id: dto.usuario_id } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const devolucion = this.devolucionRepo.create({
      ...dto,
      usuario,
    });

    return this.devolucionRepo.save(devolucion);
  }

  async findAll(): Promise<Devolucion[]> {
    return this.devolucionRepo.find({ order: { fecha: 'DESC' } });
  }

  async findByDateRange(start: Date, end: Date): Promise<Devolucion[]> {
    return this.devolucionRepo.find({
      where: { fecha: Between(start, end) },
      order: { fecha: 'DESC' },
    });
  }
}
