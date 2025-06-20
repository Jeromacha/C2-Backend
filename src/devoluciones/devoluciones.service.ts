// src/devoluciones/devoluciones.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Devolucion } from './entities/devolucion.entity';
import { CreateDevolucionDto, TipoProducto } from './dto/create-devolucion.dto';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Talla } from '../tallas/entities/tallas.entity';
import { TallaRopa } from '../tallas-ropa/entities/talla-ropa.entity';
import { Bolso } from '../bolsos/entities/bolso.entity';

@Injectable()
export class DevolucionesService {
  constructor(
    @InjectRepository(Devolucion)
    private readonly devolucionRepo: Repository<Devolucion>,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(Talla)
    private readonly tallaZapatoRepo: Repository<Talla>,
    @InjectRepository(TallaRopa)
    private readonly tallaRopaRepo: Repository<TallaRopa>,
    @InjectRepository(Bolso)
    private readonly bolsoRepo: Repository<Bolso>,
  ) {}

  async create(dto: CreateDevolucionDto): Promise<Devolucion> {
    const usuario = await this.usuarioRepo.findOne({ where: { id: dto.usuario_id } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    // Aumentar stock según el producto recibido
    if (dto.tipo === TipoProducto.ZAPATO) {
      const tallaZapato = await this.tallaZapatoRepo.findOne({
        where: {
          zapato_id: parseInt(dto.producto_recibido),
          talla: parseFloat(dto.talla_recibida),
        },
      });
      if (!tallaZapato) throw new NotFoundException('Talla de zapato no encontrada');
      tallaZapato.cantidad += 1;
      await this.tallaZapatoRepo.save(tallaZapato);

    } else if (dto.tipo === TipoProducto.ROPA) {
      const tallaRopa = await this.tallaRopaRepo.findOne({
        where: {
          ropa_nombre: dto.producto_recibido,
          ropa_color: dto.color_recibido,
          talla: dto.talla_recibida,
        },
      });
      if (!tallaRopa) throw new NotFoundException('Talla de ropa no encontrada');
      tallaRopa.cantidad += 1;
      await this.tallaRopaRepo.save(tallaRopa);

    } else if (dto.tipo === TipoProducto.BOLSO) {
      const bolso = await this.bolsoRepo.findOne({
        where: { id: dto.producto_recibido },
      });
      if (!bolso) throw new NotFoundException('Bolso no encontrado');
      bolso.cantidad += 1;
      await this.bolsoRepo.save(bolso);

    } else {
      throw new BadRequestException('Tipo de producto no válido');
    }

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
