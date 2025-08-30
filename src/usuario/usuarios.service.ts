import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  async create(dto: CreateUsuarioDto): Promise<Usuario> {
    const contraseñaEncriptada = await bcrypt.hash(dto.contraseña, 10);
    const usuario = this.usuarioRepo.create({
      ...dto,
      contraseña: contraseñaEncriptada,
    });
    return this.usuarioRepo.save(usuario);
  }

  async findAll(): Promise<Usuario[]> {
    const usuarios = await this.usuarioRepo.find();
    // Ocultar contraseña por si acaso (pero sí devolvemos "activo")
    return usuarios.map(({ contraseña, ...resto }) => resto as Usuario);
  }

  async findOneByNombre(nombre: string): Promise<Usuario | undefined> {
    return this.usuarioRepo.findOne({ where: { nombre } });
  }

  async update(id: number, dto: Partial<CreateUsuarioDto>): Promise<Usuario> {
    const usuario = await this.usuarioRepo.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (dto.contraseña) {
      dto.contraseña = await bcrypt.hash(dto.contraseña, 10);
    }

    Object.assign(usuario, dto);
    return this.usuarioRepo.save(usuario);
  }

  // ✅ Nuevo: activar/desactivar usuario
  async setEstado(id: number, activo: boolean): Promise<Usuario> {
    const usuario = await this.usuarioRepo.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    usuario.activo = !!activo;
    return this.usuarioRepo.save(usuario);
  }

  async delete(id: number): Promise<void> {
    try {
      const result = await this.usuarioRepo.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('Usuario no encontrado');
      }
    } catch (e: any) {
      // Postgres: violación de FK (p.ej. devoluciones/ventas/ingresos referencian al usuario)
      if (e?.code === '23503') {
        throw new BadRequestException('No se puede eliminar: el usuario tiene registros asociados (ventas/devoluciones/ingresos).');
      }
      throw e;
    }
  }
}
