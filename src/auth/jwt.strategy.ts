import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../usuario/entities/usuario.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'jwt_secreto',
    });
  }

  async validate(payload: any) {
    // payload: { sub, nombre, rol, ... }
    const user = await this.usuarioRepo.findOne({ where: { id: Number(payload.sub) } });
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    if (!user.activo) {
      // 🔒 clave: bloquea el acceso si está inactivo
      throw new UnauthorizedException('Usuario inactivo');
    }
    // Devuelve lo que necesites inyectar en req.user
    return { id: user.id, nombre: user.nombre, rol: user.rol };
  }
}
