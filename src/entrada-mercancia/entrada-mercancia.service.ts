// src/entrada-mercancia/entrada-mercancia.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { EntradaMercancia } from './entities/entrada-mercancia.entity';
import { CreateEntradaMercanciaDto } from './dto/create-entrada-mercancia.dto';
import { TipoProducto } from '../ventas/dto/create-venta.dto';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Talla } from '../tallas/entities/tallas.entity';
import { TallaRopa } from '../tallas-ropa/entities/talla-ropa.entity';

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
  ) {}

  async create(dto: CreateEntradaMercanciaDto): Promise<EntradaMercancia> {
    const usuario = await this.usuarioRepo.findOne({ where: { id: dto.usuario_id } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    if (dto.tipo === TipoProducto.ZAPATO) {
      if (!dto.zapato_id) {
        throw new BadRequestException('zapato_id es obligatorio para tipo zapato');
      }

      const tallaZapato = await this.tallaZapatoRepo.findOne({
        where: {
          zapato_id: dto.zapato_id,
          talla: parseFloat(dto.talla),
        },
      });

      if (!tallaZapato) throw new NotFoundException('Talla de zapato no encontrada');

      tallaZapato.cantidad += dto.cantidad;
      await this.tallaZapatoRepo.save(tallaZapato);
    } else if (dto.tipo === TipoProducto.ROPA) {
      if (!dto.ropa_nombre || !dto.ropa_color) {
        throw new BadRequestException('ropa_nombre y ropa_color son obligatorios para tipo ropa');
      }

      const tallaRopa = await this.tallaRopaRepo.findOne({
        where: {
          ropa_nombre: dto.ropa_nombre,
          ropa_color: dto.ropa_color,
          talla: dto.talla,
        },
      });

      if (!tallaRopa) throw new NotFoundException('Talla de ropa no encontrada');

      tallaRopa.cantidad += dto.cantidad;
      await this.tallaRopaRepo.save(tallaRopa);
    } else {
      throw new BadRequestException('Tipo de producto inválido');
    }

    const entrada = this.entradaRepo.create({ ...dto, usuario });
    return this.entradaRepo.save(entrada);
  }

  async findAll(): Promise<EntradaMercancia[]> {
    return this.entradaRepo.find({ order: { fecha: 'DESC' } });
  }

  async findByDateRange(start: Date, end: Date): Promise<EntradaMercancia[]> {
    return this.entradaRepo.find({
      where: { fecha: Between(start, end) },
      order: { fecha: 'DESC' },
    });
  }
}
