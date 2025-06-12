import { IsString, MinLength, IsEnum } from 'class-validator';
import { RolUsuario } from '../entities/usuario.entity';

export class CreateUsuarioDto {
  @IsString()
  nombre: string;

  @IsString()
  @MinLength(6)
  contraseña: string;

  @IsEnum(RolUsuario)
  rol: RolUsuario;
}
