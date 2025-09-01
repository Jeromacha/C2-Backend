// src/auth/auth.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { Usuario } from '../usuario/entities/usuario.entity';
import { UsuariosModule } from '../usuario/usuarios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    PassportModule,
    JwtModule.register({
      secret: 'jwt_secreto',
      signOptions: { expiresIn: '1d' },
    }),
    forwardRef(() => UsuariosModule), // ⬅️ ahora JwtStrategy/AuthService podrán inyectar UsuariosService
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService], // opcional
})
export class AuthModule {}
