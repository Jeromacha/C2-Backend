// src/devoluciones/entities/devolucion.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity({ name: 'devoluciones' })
export class Devolucion {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  fecha: Date;

  @Column()
  tipo: string; // 'zapato' o 'ropa'

  @Column()
  producto_entregado: string;

  @Column({ nullable: true })
  color_entregado: string;

  @Column()
  talla_entregada: string;

  @Column()
  producto_recibido: string;

  @Column({ nullable: true })
  color_recibido: string;

  @Column()
  talla_recibida: string;

  @Column('numeric')
  precio_entregado: number;

  @Column('numeric')
  precio_recibido: number;

  @Column('numeric')
  diferencia_pago: number;

  @ManyToOne(() => Usuario, { eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column()
  usuario_id: number;
}
