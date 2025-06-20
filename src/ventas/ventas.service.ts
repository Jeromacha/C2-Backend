import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Venta } from './entities/venta.entity';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { CreateVentaDto, TipoProducto } from './dto/create-venta.dto';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Talla } from '../tallas/entities/tallas.entity';
import { TallaRopa } from '../tallas-ropa/entities/talla-ropa.entity';
import { Zapato } from '../zapatos/entities/zapato.entity';
import { Bolso } from '../bolsos/entities/bolso.entity';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepo: Repository<Venta>,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(Talla)
    private readonly tallaZapatoRepo: Repository<Talla>,
    @InjectRepository(TallaRopa)
    private readonly tallaRopaRepo: Repository<TallaRopa>,
    @InjectRepository(Zapato)
    private readonly zapatoRepo: Repository<Zapato>,
    @InjectRepository(Bolso)
    private readonly bolsoRepo: Repository<Bolso>,
  ) {}

  async create(dto: CreateVentaDto): Promise<Venta> {
    const usuario = await this.usuarioRepo.findOne({
      where: { id: dto.usuario_id },
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    if (dto.tipo === TipoProducto.ZAPATO) {
      if (!dto.zapato_id)
        throw new BadRequestException('zapato_id es obligatorio para tipo zapato');

      const tallaZapato = await this.tallaZapatoRepo.findOne({
        where: {
          zapato_id: dto.zapato_id,
          talla: parseFloat(dto.talla),
        },
      });

      if (!tallaZapato)
        throw new NotFoundException('Talla de zapato no encontrada');
      if (tallaZapato.cantidad <= 0)
        throw new BadRequestException('Sin stock disponible');

      tallaZapato.cantidad -= 1;
      await this.tallaZapatoRepo.save(tallaZapato);

      const zapato = await this.zapatoRepo.findOne({
        where: { id: dto.zapato_id },
      });
      if (!zapato) throw new NotFoundException('Zapato no encontrado');

      dto.nombre_producto = zapato.nombre;

    } else if (dto.tipo === TipoProducto.ROPA) {
      if (!dto.nombre_producto || !dto.color)
        throw new BadRequestException(
          'nombre_producto y color son obligatorios para tipo ropa',
        );

      const tallaRopa = await this.tallaRopaRepo.findOne({
        where: {
          ropa_nombre: dto.nombre_producto,
          ropa_color: dto.color,
          talla: dto.talla,
        },
      });

      if (!tallaRopa)
        throw new NotFoundException('Talla de ropa no encontrada');
      if (tallaRopa.cantidad <= 0)
        throw new BadRequestException('Sin stock disponible');

      tallaRopa.cantidad -= 1;
      await this.tallaRopaRepo.save(tallaRopa);

    } else if (dto.tipo === TipoProducto.BOLSO) {
      if (!dto.bolso_id)
        throw new BadRequestException('bolso_id es obligatorio para tipo bolso');

      const bolso = await this.bolsoRepo.findOne({
        where: { id: dto.bolso_id },
      });

      if (!bolso) throw new NotFoundException('Bolso no encontrado');

      dto.nombre_producto = bolso.nombre;
      dto.color = bolso.color;

    } else {
      throw new BadRequestException('Tipo de producto inválido');
    }

    const venta = this.ventaRepo.create({
      ...dto,
      producto: dto.nombre_producto,
      cantidad: 1,
      usuario,
    });

    return this.ventaRepo.save(venta);
  }

  async findAll(): Promise<Venta[]> {
    return this.ventaRepo.find({ order: { fecha: 'DESC' } });
  }

  async findByDateRange(start: Date, end: Date): Promise<Venta[]> {
    return this.ventaRepo.find({
      where: { fecha: Between(start, end) },
      order: { fecha: 'DESC' },
    });
  }

  async calcularGanancias(start?: Date, end?: Date): Promise<number> {
    const where: any = {};
    if (start && end) {
      where.fecha = Between(start, end);
    } else if (start) {
      where.fecha = MoreThanOrEqual(start);
    } else if (end) {
      where.fecha = LessThanOrEqual(end);
    }

    const ventas = await this.ventaRepo.find({ where });
    return ventas.reduce((total, venta) => total + venta.precio, 0);
  }
}
