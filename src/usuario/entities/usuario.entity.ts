import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsEnum, IsNotEmpty, MinLength } from 'class-validator';

export enum RolUsuario {
  EMPLEADO = 'Empleado',
  ADMIN = 'Admin',
}

@Entity({ name: 'usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @Column()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contraseña: string;

  @Column({ type: 'enum', enum: RolUsuario })
  @IsEnum(RolUsuario, { message: 'El rol debe ser Admin o Empleado' })
  rol: RolUsuario;
}
