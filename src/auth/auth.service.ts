import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../usuario/entities/usuario.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly userRepo: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async validarCredenciales(nombre: string, contraseña: string) {
    const usuario = await this.userRepo.findOne({ where: { nombre } });

    if (!usuario || !(await bcrypt.compare(contraseña, usuario.contraseña))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: usuario.id, nombre: usuario.nombre, rol: usuario.rol };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }
}
