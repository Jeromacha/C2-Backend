// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsuariosService } from '../usuario/usuarios.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usuariosService: UsuariosService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'jwt_secreto', // usa env var en prod
    });
  }

  async validate(payload: any) {
    // Carga desde la BD para validar que sigue activo
    const user = await this.usuariosService.findOneById?.(payload.sub);
    // Si no tienes findOneById, añade este método al service:
    // return this.usuarioRepo.findOne({ where: { id } });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    if (user.activo === false) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    // Lo que se adjunta a req.user
    return { id: user.id, nombre: user.nombre, rol: user.rol };
  }
}
