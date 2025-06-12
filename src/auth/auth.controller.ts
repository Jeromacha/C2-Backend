import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: { nombre: string; contraseña: string }) {
    return this.authService.validarCredenciales(body.nombre, body.contraseña);
  }
}
