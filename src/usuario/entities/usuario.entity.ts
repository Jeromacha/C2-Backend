import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsEnum } from 'class-validator';

export enum RolUsuario {
  EMPLEADO = 'Empleado',
  ADMIN = 'Admin',
}

@Entity({ name: 'usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string;

  @Column()
  contraseña: string;

  @Column({ type: 'enum', enum: RolUsuario })
  rol: RolUsuario;
}
