// src/auth/auth.controller.ts
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    const nombre = (body?.nombre ?? '').trim();
    const contraseña =
      body?.contraseña ??
      body?.contrasena ?? // sin ñ
      body?.password ??
      body?.pass;

    if (!nombre || !contraseña) {
      throw new BadRequestException('nombre y contraseña son obligatorios');
    }

    // Llama al método real del service
    return this.authService.login(nombre, String(contraseña));
  }
}
