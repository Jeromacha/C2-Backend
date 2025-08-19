import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  DataSource,
  Repository,
} from 'typeorm';
import { Devolucion } from './entities/devolucion.entity';
import { CreateDevolucionDto, TipoProducto } from './dto/create-devolucion.dto';
import { UpdateDevolucionDto } from './dto/update-devolucion.dto';
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
    private readonly dataSource: DataSource,
  ) {}

  // ===== Helpers de inventario =====
  private async adjustZapato(
    qr: ReturnType<DataSource['createQueryRunner']>,
    zapato_id: number,
    talla: number,
    delta: number, // +1 sumar, -1 restar
  ) {
    const repo = qr.manager.getRepository(Talla);
    const tallaZapato = await repo.findOne({
      where: { zapato_id, talla },
      lock: { mode: 'pessimistic_write' },
    });
    if (!tallaZapato) {
      throw new NotFoundException('Talla de zapato no encontrada');
    }
    const nueva = (tallaZapato.cantidad ?? 0) + delta;
    if (nueva < 0) {
      throw new BadRequestException('Stock de zapato no puede ser negativo');
    }
    tallaZapato.cantidad = nueva;
    await repo.save(tallaZapato);
  }

  private async adjustRopa(
    qr: ReturnType<DataSource['createQueryRunner']>,
    ropa_nombre: string,
    ropa_color: string,
    talla: string,
    delta: number,
  ) {
    const repo = qr.manager.getRepository(TallaRopa);
    const tallaRopa = await repo.findOne({
      where: { ropa_nombre, ropa_color, talla },
      lock: { mode: 'pessimistic_write' },
    });
    if (!tallaRopa) {
      throw new NotFoundException('Talla de ropa no encontrada');
    }
    const nueva = (tallaRopa.cantidad ?? 0) + delta;
    if (nueva < 0) {
      throw new BadRequestException('Stock de ropa no puede ser negativo');
    }
    tallaRopa.cantidad = nueva;
    await repo.save(tallaRopa);
  }

  private async adjustBolso(
    qr: ReturnType<DataSource['createQueryRunner']>,
    bolso_id: string,
    delta: number,
  ) {
    const repo = qr.manager.getRepository(Bolso);
    const bolso = await repo.findOne({
      where: { id: bolso_id },
      lock: { mode: 'pessimistic_write' },
    });
    if (!bolso) {
      throw new NotFoundException('Bolso no encontrado');
    }
    const nueva = (bolso.cantidad ?? 0) + delta;
    if (nueva < 0) {
      throw new BadRequestException('Stock de bolso no puede ser negativo');
    }
    bolso.cantidad = nueva;
    await repo.save(bolso);
  }

  // ===== Create (suma stock del recibido) =====
  async create(dto: CreateDevolucionDto): Promise<Devolucion> {
    const usuario = await this.usuarioRepo.findOne({ where: { id: dto.usuario_id } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      // Aplica efecto de inventario (+1 del recibido)
      if (dto.tipo === TipoProducto.ZAPATO) {
        const zapato_id = parseInt(dto.producto_recibido, 10);
        const tallaNum = parseFloat(dto.talla_recibida);
        await this.adjustZapato(qr, zapato_id, tallaNum, +1);

      } else if (dto.tipo === TipoProducto.ROPA) {
        await this.adjustRopa(qr, dto.producto_recibido, dto.color_recibido!, dto.talla_recibida, +1);

      } else if (dto.tipo === TipoProducto.BOLSO) {
        await this.adjustBolso(qr, dto.producto_recibido, +1);

      } else {
        throw new BadRequestException('Tipo de producto no válido');
      }

      const devolucion = this.devolucionRepo.create({ ...dto, usuario });
      const saved = await qr.manager.getRepository(Devolucion).save(devolucion);

      await qr.commitTransaction();
      return saved;
    } catch (e) {
      await qr.rollbackTransaction();
      throw e;
    } finally {
      await qr.release();
    }
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

  // ===== Update (revierte viejo efecto -1 y aplica nuevo +1 si cambian campos relevantes) =====
  async update(id: number, dto: UpdateDevolucionDto): Promise<Devolucion> {
    const actual = await this.devolucionRepo.findOne({ where: { id } });
    if (!actual) throw new NotFoundException(`Devolución ${id} no encontrada`);

    // Campos que afectan inventario del "recibido"
    const afectaInventario =
      dto.tipo !== undefined ||
      dto.producto_recibido !== undefined ||
      dto.color_recibido !== undefined ||
      dto.talla_recibida !== undefined;

    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      // Si cambia algo relevante, revertimos el efecto anterior (-1 al recibido anterior)
      if (afectaInventario) {
        if (actual.tipo === TipoProducto.ZAPATO) {
          const zapato_id = parseInt(actual.producto_recibido, 10);
          const tallaNum = parseFloat(actual.talla_recibida);
          await this.adjustZapato(qr, zapato_id, tallaNum, -1);

        } else if (actual.tipo === TipoProducto.ROPA) {
          await this.adjustRopa(qr, actual.producto_recibido, actual.color_recibido!, actual.talla_recibida, -1);

        } else if (actual.tipo === TipoProducto.BOLSO) {
          await this.adjustBolso(qr, actual.producto_recibido, -1);
        }
      }

      // Aplicamos cambios al registro
      if (dto.usuario_id) {
        const usuario = await qr.manager.getRepository(Usuario).findOne({ where: { id: dto.usuario_id } });
        if (!usuario) throw new NotFoundException('Usuario no encontrado');
        actual.usuario = usuario;
      }
      Object.assign(actual, dto);

      // Si cambió algo relevante, aplicamos el nuevo efecto (+1 al nuevo recibido)
      if (afectaInventario) {
        if (actual.tipo === TipoProducto.ZAPATO) {
          const zapato_id = parseInt(actual.producto_recibido, 10);
          const tallaNum = parseFloat(actual.talla_recibida);
          await this.adjustZapato(qr, zapato_id, tallaNum, +1);

        } else if (actual.tipo === TipoProducto.ROPA) {
          if (!actual.color_recibido) {
            throw new BadRequestException('color_recibido es requerido para ropa');
          }
          await this.adjustRopa(qr, actual.producto_recibido, actual.color_recibido, actual.talla_recibida, +1);

        } else if (actual.tipo === TipoProducto.BOLSO) {
          await this.adjustBolso(qr, actual.producto_recibido, +1);
        } else {
          throw new BadRequestException('Tipo de producto no válido');
        }
      }

      const saved = await qr.manager.getRepository(Devolucion).save(actual);
      await qr.commitTransaction();
      return saved;
    } catch (e) {
      await qr.rollbackTransaction();
      // Si falló al aplicar el nuevo efecto, ya habíamos restado el viejo:
      // la transacción garantiza que no quede desbalance.
      throw e;
    } finally {
      await qr.release();
    }
  }

  // ===== Delete (revierte efecto: -1 del recibido almacenado) =====
  async remove(id: number): Promise<{ affected: number }> {
    const actual = await this.devolucionRepo.findOne({ where: { id } });
    if (!actual) throw new NotFoundException(`Devolución ${id} no encontrada`);

    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      // Revertimos (+1 aplicado en create) con un -1 al recibido
      if (actual.tipo === TipoProducto.ZAPATO) {
        const zapato_id = parseInt(actual.producto_recibido, 10);
        const tallaNum = parseFloat(actual.talla_recibida);
        await this.adjustZapato(qr, zapato_id, tallaNum, -1);

      } else if (actual.tipo === TipoProducto.ROPA) {
        await this.adjustRopa(qr, actual.producto_recibido, actual.color_recibido!, actual.talla_recibida, -1);

      } else if (actual.tipo === TipoProducto.BOLSO) {
        await this.adjustBolso(qr, actual.producto_recibido, -1);
      }

      const res = await qr.manager.getRepository(Devolucion).delete(id);
      await qr.commitTransaction();

      return { affected: res.affected ?? 0 };
    } catch (e) {
      await qr.rollbackTransaction();
      throw e;
    } finally {
      await qr.release();
    }
  }
}
