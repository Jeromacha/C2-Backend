// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuario/usuarios.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async login(nombre: string, contraseña: string) {
    const user = await this.usuariosService.findOneByNombre(nombre);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const ok = await bcrypt.compare(contraseña, user.contraseña);
    if (!ok) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // ⬇️ Bloquea login si está inactivo
    if (user.activo === false) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    const payload = { sub: user.id, nombre: user.nombre, rol: user.rol };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  }
}
