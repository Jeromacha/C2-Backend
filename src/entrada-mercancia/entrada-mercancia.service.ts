import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, Repository } from 'typeorm';
import { EntradaMercancia } from './entities/entrada-mercancia.entity';
import { CreateEntradaMercanciaDto } from './dto/create-entrada-mercancia.dto';
import { UpdateEntradaMercanciaDto } from './dto/update-entrada-mercancia.dto';
import { TipoProducto } from '../ventas/dto/create-venta.dto';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Talla } from '../tallas/entities/tallas.entity';
import { TallaRopa } from '../tallas-ropa/entities/talla-ropa.entity';
import { Bolso } from '../bolsos/entities/bolso.entity';

@Injectable()
export class EntradaMercanciaService {
  constructor(
    @InjectRepository(EntradaMercancia)
    private readonly entradaRepo: Repository<EntradaMercancia>,
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

  // ===== Helpers de ajuste de inventario (con bloqueo pesimista) =====
  private async addZapato(
    qr: ReturnType<DataSource['createQueryRunner']>,
    zapato_id: number,
    talla: number,
    cantidad: number,
  ) {
    const repo = qr.manager.getRepository(Talla);
    const tallaZapato = await repo.findOne({
      where: { zapato_id, talla },
      lock: { mode: 'pessimistic_write' },
    });
    if (!tallaZapato) throw new NotFoundException('Talla de zapato no encontrada');
    tallaZapato.cantidad = (tallaZapato.cantidad ?? 0) + cantidad;
    if (tallaZapato.cantidad < 0) {
      throw new BadRequestException('Stock de zapato no puede ser negativo');
    }
    await repo.save(tallaZapato);
  }

  private async addRopa(
    qr: ReturnType<DataSource['createQueryRunner']>,
    ropa_nombre: string,
    ropa_color: string,
    talla: string,
    cantidad: number,
  ) {
    const repo = qr.manager.getRepository(TallaRopa);
    const tallaRopa = await repo.findOne({
      where: { ropa_nombre, ropa_color, talla },
      lock: { mode: 'pessimistic_write' },
    });
    if (!tallaRopa) throw new NotFoundException('Talla de ropa no encontrada');
    tallaRopa.cantidad = (tallaRopa.cantidad ?? 0) + cantidad;
    if (tallaRopa.cantidad < 0) {
      throw new BadRequestException('Stock de ropa no puede ser negativo');
    }
    await repo.save(tallaRopa);
  }

  private async addBolso(
    qr: ReturnType<DataSource['createQueryRunner']>,
    bolso_id: string,
    cantidad: number,
  ) {
    const repo = qr.manager.getRepository(Bolso);
    const bolso = await repo.findOne({
      where: { id: bolso_id },
      lock: { mode: 'pessimistic_write' },
    });
    if (!bolso) throw new NotFoundException('Bolso no encontrado');
    bolso.cantidad = (bolso.cantidad ?? 0) + cantidad;
    if (bolso.cantidad < 0) {
      throw new BadRequestException('Stock de bolso no puede ser negativo');
    }
    await repo.save(bolso);
  }

  // ===== CREATE: suma stock según tipo =====
  async create(dto: CreateEntradaMercanciaDto): Promise<EntradaMercancia> {
    const usuario = await this.usuarioRepo.findOne({ where: { id: dto.usuario_id } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    if (dto.cantidad == null || isNaN(+dto.cantidad) || +dto.cantidad <= 0) {
      throw new BadRequestException('cantidad debe ser un número positivo');
    }

    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      if (dto.tipo === TipoProducto.ZAPATO) {
        if (!dto.zapato_id || dto.talla == null) {
          throw new BadRequestException('zapato_id y talla son obligatorios para tipo zapato');
        }
        await this.addZapato(qr, dto.zapato_id, parseFloat(dto.talla), +dto.cantidad);

      } else if (dto.tipo === TipoProducto.ROPA) {
        if (!dto.ropa_nombre || !dto.ropa_color || !dto.talla) {
          throw new BadRequestException('ropa_nombre, ropa_color y talla son obligatorios para tipo ropa');
        }
        await this.addRopa(qr, dto.ropa_nombre, dto.ropa_color, dto.talla, +dto.cantidad);

      } else if (dto.tipo === TipoProducto.BOLSO) {
        if (!dto.bolso_id) {
          throw new BadRequestException('bolso_id es obligatorio para tipo bolso');
        }
        await this.addBolso(qr, dto.bolso_id, +dto.cantidad);

      } else {
        throw new BadRequestException('Tipo de producto inválido');
      }

      const entrada = this.entradaRepo.create({ ...dto, usuario });
      const saved = await qr.manager.getRepository(EntradaMercancia).save(entrada);

      await qr.commitTransaction();
      return saved;
    } catch (e) {
      await qr.rollbackTransaction();
      throw e;
    } finally {
      await qr.release();
    }
  }

  // ===== READ =====
  async findAll(): Promise<EntradaMercancia[]> {
    return this.entradaRepo.find({ order: { fecha: 'DESC' } });
  }

  async findByDateRange(start: Date, end: Date): Promise<EntradaMercancia[]> {
    return this.entradaRepo.find({
      where: { fecha: Between(start, end) },
      order: { fecha: 'DESC' },
    });
  }

  // ===== UPDATE: revierte efecto anterior y aplica el nuevo =====
  async update(id: number, dto: UpdateEntradaMercanciaDto): Promise<EntradaMercancia> {
    const actual = await this.entradaRepo.findOne({ where: { id } });
    if (!actual) throw new NotFoundException(`Entrada ${id} no encontrada`);

    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      // 1) Revertir efecto anterior (restar cantidad anterior según tipo anterior)
      const cantidadAnterior = actual.cantidad ?? 0;
      if (cantidadAnterior > 0) {
        if (actual.tipo === TipoProducto.ZAPATO) {
          if (actual.zapato_id == null || actual.talla == null) {
            throw new BadRequestException('Entrada previa de zapato inválida');
          }
          await this.addZapato(qr, actual.zapato_id, parseFloat(actual.talla), -cantidadAnterior);

        } else if (actual.tipo === TipoProducto.ROPA) {
          if (!actual.ropa_nombre || !actual.ropa_color || !actual.talla) {
            throw new BadRequestException('Entrada previa de ropa inválida');
          }
          await this.addRopa(qr, actual.ropa_nombre, actual.ropa_color, actual.talla, -cantidadAnterior);

        } else if (actual.tipo === TipoProducto.BOLSO) {
          if (!actual.bolso_id) {
            throw new BadRequestException('Entrada previa de bolso inválida');
          }
          await this.addBolso(qr, actual.bolso_id, -cantidadAnterior);
        }
      }

      // 2) Aplicar dto al registro
      if (dto.usuario_id != null) {
        const usuario = await qr.manager.getRepository(Usuario).findOne({ where: { id: dto.usuario_id } });
        if (!usuario) throw new NotFoundException('Usuario no encontrado');
        (actual as any).usuario = usuario;
        (actual as any).usuario_id = dto.usuario_id;
      }
      Object.assign(actual, dto);

      // Validar cantidad nueva
      const cantidadNueva = actual.cantidad ?? 0;
      if (cantidadNueva <= 0) {
        throw new BadRequestException('cantidad debe ser un número positivo');
      }

      // 3) Aplicar nuevo efecto (sumar cantidad nueva según nuevo tipo)
      if (actual.tipo === TipoProducto.ZAPATO) {
        if (!actual.zapato_id || actual.talla == null) {
          throw new BadRequestException('zapato_id y talla son obligatorios para tipo zapato');
        }
        await this.addZapato(qr, actual.zapato_id, parseFloat(actual.talla), +cantidadNueva);

      } else if (actual.tipo === TipoProducto.ROPA) {
        if (!actual.ropa_nombre || !actual.ropa_color || !actual.talla) {
          throw new BadRequestException('ropa_nombre, ropa_color y talla son obligatorios para tipo ropa');
        }
        await this.addRopa(qr, actual.ropa_nombre, actual.ropa_color, actual.talla, +cantidadNueva);

      } else if (actual.tipo === TipoProducto.BOLSO) {
        if (!actual.bolso_id) {
          throw new BadRequestException('bolso_id es obligatorio para tipo bolso');
        }
        await this.addBolso(qr, actual.bolso_id, +cantidadNueva);

      } else {
        throw new BadRequestException('Tipo de producto inválido');
      }

      const saved = await qr.manager.getRepository(EntradaMercancia).save(actual);
      await qr.commitTransaction();
      return saved;
    } catch (e) {
      await qr.rollbackTransaction();
      throw e;
    } finally {
      await qr.release();
    }
  }

  // ===== DELETE: revierte efecto (resta la cantidad de esa entrada) y borra =====
  async remove(id: number): Promise<{ affected: number }> {
    const actual = await this.entradaRepo.findOne({ where: { id } });
    if (!actual) throw new NotFoundException(`Entrada ${id} no encontrada`);

    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      const cant = actual.cantidad ?? 0;
      if (cant > 0) {
        if (actual.tipo === TipoProducto.ZAPATO) {
          if (actual.zapato_id == null || actual.talla == null) {
            throw new BadRequestException('Entrada previa de zapato inválida');
          }
          await this.addZapato(qr, actual.zapato_id, parseFloat(actual.talla), -cant);

        } else if (actual.tipo === TipoProducto.ROPA) {
          if (!actual.ropa_nombre || !actual.ropa_color || !actual.talla) {
            throw new BadRequestException('Entrada previa de ropa inválida');
          }
          await this.addRopa(qr, actual.ropa_nombre, actual.ropa_color, actual.talla, -cant);

        } else if (actual.tipo === TipoProducto.BOLSO) {
          if (!actual.bolso_id) {
            throw new BadRequestException('Entrada previa de bolso inválida');
          }
          await this.addBolso(qr, actual.bolso_id, -cant);
        }
      }

      const res = await qr.manager.getRepository(EntradaMercancia).delete(id);
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
