import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import { Venta } from './entities/venta.entity';
import { CreateVentaDto, TipoProducto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Talla } from '../tallas/entities/tallas.entity';
import { TallaRopa } from '../tallas-ropa/entities/talla-ropa.entity';
import { Zapato } from '../zapatos/entities/zapato.entity';
import { Bolso } from '../bolsos/entities/bolso.entity';

function normTipo(t: string | TipoProducto): TipoProducto {
  const s = String(t).toLowerCase();
  if (s === 'zapato') return TipoProducto.ZAPATO;
  if (s === 'ropa') return TipoProducto.ROPA;
  if (s === 'bolso') return TipoProducto.BOLSO;
  throw new BadRequestException('Tipo de producto inválido');
}

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)   private readonly ventaRepo: Repository<Venta>,
    @InjectRepository(Usuario) private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(Talla)   private readonly tallaZapatoRepo: Repository<Talla>,
    @InjectRepository(TallaRopa) private readonly tallaRopaRepo: Repository<TallaRopa>,
    @InjectRepository(Zapato)  private readonly zapatoRepo: Repository<Zapato>,
    @InjectRepository(Bolso)   private readonly bolsoRepo: Repository<Bolso>,
  ) {}

  // ---------- CREATE ----------
  async create(dto: CreateVentaDto): Promise<Venta> {
    const usuario = await this.usuarioRepo.findOne({ where: { id: dto.usuario_id } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const tipo = normTipo(dto.tipo);

    if (tipo === TipoProducto.ZAPATO) {
      if (!dto.zapato_id || !dto.talla) {
        throw new BadRequestException('zapato_id y talla son obligatorios para tipo zapato');
      }
      const tz = await this.tallaZapatoRepo.findOne({
        where: { zapato_id: dto.zapato_id, talla: parseFloat(dto.talla) },
      });
      if (!tz) throw new NotFoundException('Talla de zapato no encontrada');
      if (tz.cantidad <= 0) throw new BadRequestException('Sin stock disponible');

      tz.cantidad -= 1;
      await this.tallaZapatoRepo.save(tz);

      const zapato = await this.zapatoRepo.findOne({ where: { id: dto.zapato_id } });
      if (!zapato) throw new NotFoundException('Zapato no encontrado');

      dto.nombre_producto = zapato.nombre;
      // dto.color opcional para zapato (si aplica)

    } else if (tipo === TipoProducto.ROPA) {
      if (!dto.nombre_producto || !dto.color || !dto.talla) {
        throw new BadRequestException('nombre_producto, color y talla son obligatorios para tipo ropa');
      }
      const tr = await this.tallaRopaRepo.findOne({
        where: {
          ropa_nombre: dto.nombre_producto,
          ropa_color: dto.color,
          talla: dto.talla,
        },
      });
      if (!tr) throw new NotFoundException('Talla de ropa no encontrada');
      if (tr.cantidad <= 0) throw new BadRequestException('Sin stock disponible');

      tr.cantidad -= 1;
      await this.tallaRopaRepo.save(tr);

    } else if (tipo === TipoProducto.BOLSO) {
      if (!dto.bolso_id) {
        throw new BadRequestException('bolso_id es obligatorio para tipo bolso');
      }
      const b = await this.bolsoRepo.findOne({ where: { id: dto.bolso_id } });
      if (!b) throw new NotFoundException('Bolso no encontrado');
      if ((b.cantidad ?? 0) <= 0) throw new BadRequestException('Sin stock disponible');

      b.cantidad -= 1;
      await this.bolsoRepo.save(b);

      dto.nombre_producto = b.nombre;
      dto.color = b.color;

    } else {
      throw new BadRequestException('Tipo de producto inválido');
    }

    const venta = this.ventaRepo.create({
      fecha: undefined, // usa default CURRENT_TIMESTAMP
      producto: dto.nombre_producto!,
      tipo,
      color: dto.color ?? null as any,
      talla: dto.talla ?? '', // entity no-null; para bolso guardamos ''
      cantidad: 1,
      precio: dto.precio,
      usuario,
      usuario_id: dto.usuario_id,
    });

    return this.ventaRepo.save(venta);
  }

  // ---------- UPDATE ----------
  async update(id: number, dto: UpdateVentaDto): Promise<Venta> {
    const venta = await this.ventaRepo.findOne({ where: { id } });
    if (!venta) throw new NotFoundException('Venta no encontrada');

    return await this.ventaRepo.manager.transaction(async (em) => {
      const ventaRepo = em.getRepository(Venta);
      const tzRepo   = em.getRepository(Talla);
      const trRepo   = em.getRepository(TallaRopa);
      const zapRepo  = em.getRepository(Zapato);
      const bolRepo  = em.getRepository(Bolso);
      const usrRepo  = em.getRepository(Usuario);

      // 1) Revertir stock del registro viejo
      await this.revertirStockDeVenta(venta, { tzRepo, trRepo, zapRepo, bolRepo });

      // 2) Construir "nueva venta" (aplicar DTO) y descontar stock de la nueva definición
      const tipoNuevo = dto.tipo ? normTipo(dto.tipo) : normTipo(venta.tipo);
      const ventaActualizada: Venta = { ...venta };

      // Usuario
      if (dto.usuario_id != null) {
        const user = await usrRepo.findOne({ where: { id: dto.usuario_id } });
        if (!user) throw new NotFoundException('Usuario no encontrado');
        ventaActualizada.usuario = user;
        ventaActualizada.usuario_id = dto.usuario_id;
      }

      // Precio (si cambia)
      if (dto.precio != null) ventaActualizada.precio = dto.precio;

      // Definición del artículo (tipo/producto/color/talla) se toma del dto si viene, sino se usa la actual
      // y se descuenta inventario igual que en create.
      if (tipoNuevo === TipoProducto.ZAPATO) {
        const zapatoId = dto.zapato_id;
        const talla = dto.talla ?? venta.talla;
        if (!zapatoId || !talla) {
          throw new BadRequestException('zapato_id y talla son obligatorios para tipo zapato');
        }
        const tz = await tzRepo.findOne({
          where: { zapato_id: zapatoId, talla: parseFloat(talla) },
        });
        if (!tz) throw new NotFoundException('Talla de zapato no encontrada');
        if (tz.cantidad <= 0) throw new BadRequestException('Sin stock disponible');
        tz.cantidad -= 1;
        await tzRepo.save(tz);

        const z = await zapRepo.findOne({ where: { id: zapatoId } });
        if (!z) throw new NotFoundException('Zapato no encontrado');

        ventaActualizada.tipo = tipoNuevo;
        ventaActualizada.producto = z.nombre;
        ventaActualizada.color = dto.color ?? null as any; // opcional
        ventaActualizada.talla = talla;

      } else if (tipoNuevo === TipoProducto.ROPA) {
        const nombre = dto.nombre_producto ?? venta.producto;
        const color  = dto.color ?? venta.color;
        const talla  = dto.talla ?? venta.talla;
        if (!nombre || !color || !talla) {
          throw new BadRequestException('nombre_producto, color y talla son obligatorios para tipo ropa');
        }
        const tr = await trRepo.findOne({
          where: { ropa_nombre: nombre, ropa_color: color, talla },
        });
        if (!tr) throw new NotFoundException('Talla de ropa no encontrada');
        if (tr.cantidad <= 0) throw new BadRequestException('Sin stock disponible');
        tr.cantidad -= 1;
        await trRepo.save(tr);

        ventaActualizada.tipo = tipoNuevo;
        ventaActualizada.producto = nombre;
        ventaActualizada.color = color as any;
        ventaActualizada.talla = talla;

      } else if (tipoNuevo === TipoProducto.BOLSO) {
        const bolsoId = dto.bolso_id;
        if (!bolsoId) throw new BadRequestException('bolso_id es obligatorio para tipo bolso');
        const b = await bolRepo.findOne({ where: { id: bolsoId } });
        if (!b) throw new NotFoundException('Bolso no encontrado');
        if ((b.cantidad ?? 0) <= 0) throw new BadRequestException('Sin stock disponible');
        b.cantidad -= 1;
        await bolRepo.save(b);

        ventaActualizada.tipo = tipoNuevo;
        ventaActualizada.producto = b.nombre;
        ventaActualizada.color = b.color as any;
        ventaActualizada.talla = ''; // para bolso

      } else {
        throw new BadRequestException('Tipo de producto inválido');
      }

      return await ventaRepo.save(ventaActualizada);
    });
  }

  // ---------- DELETE ----------
  async remove(id: number): Promise<void> {
    const venta = await this.ventaRepo.findOne({ where: { id } });
    if (!venta) throw new NotFoundException('Venta no encontrada');

    await this.ventaRepo.manager.transaction(async (em) => {
      const ventaRepo = em.getRepository(Venta);
      const tzRepo   = em.getRepository(Talla);
      const trRepo   = em.getRepository(TallaRopa);
      const zapRepo  = em.getRepository(Zapato);
      const bolRepo  = em.getRepository(Bolso);

      await this.revertirStockDeVenta(venta, { tzRepo, trRepo, zapRepo, bolRepo });
      await ventaRepo.delete(id);
    });
  }

  // ---------- QUERIES ----------
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
    if (start && end) where.fecha = Between(start, end);
    else if (start) where.fecha = MoreThanOrEqual(start);
    else if (end) where.fecha = LessThanOrEqual(end);

    const ventas = await this.ventaRepo.find({ where });
    return ventas.reduce((acc, v) => acc + Number(v.precio || 0), 0);
  }

  // ---------- Helpers ----------
  private async revertirStockDeVenta(
    venta: Venta,
    repos: {
      tzRepo: Repository<Talla>;
      trRepo: Repository<TallaRopa>;
      zapRepo: Repository<Zapato>;
      bolRepo: Repository<Bolso>;
    },
  ) {
    const tipo = normTipo(venta.tipo);
    if (tipo === TipoProducto.ZAPATO) {
      // encontrar zapato por nombre (producto), luego su talla
      const z = await repos.zapRepo.findOne({ where: { nombre: venta.producto } });
      if (!z) throw new NotFoundException(`Zapato '${venta.producto}' no encontrado`);
      if (!venta.talla) throw new BadRequestException('La venta no tiene talla registrada');
      const tz = await repos.tzRepo.findOne({
        where: { zapato_id: z.id, talla: parseFloat(venta.talla) },
      });
      if (!tz) throw new NotFoundException('Talla de zapato no encontrada');
      tz.cantidad += 1;
      await repos.tzRepo.save(tz);

    } else if (tipo === TipoProducto.ROPA) {
      const tr = await repos.trRepo.findOne({
        where: { ropa_nombre: venta.producto, ropa_color: venta.color, talla: venta.talla },
      });
      if (!tr) throw new NotFoundException('Talla de ropa no encontrada');
      tr.cantidad += 1;
      await repos.trRepo.save(tr);

    } else if (tipo === TipoProducto.BOLSO) {
      const b = await repos.bolRepo.findOne({ where: { nombre: venta.producto } });
      if (!b) throw new NotFoundException(`Bolso '${venta.producto}' no encontrado`);
      b.cantidad += 1;
      await repos.bolRepo.save(b);
    }
  }
}
