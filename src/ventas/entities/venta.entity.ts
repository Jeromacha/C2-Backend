// src/ventas/entities/venta.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity({ name: 'ventas' })
export class Venta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @Column()
  producto: string;

  @Column()
  tipo: string; // 'Zapato' o 'Ropa'

  @Column({nullable: true})
  color: string;

  @Column()
  talla: string;

  @Column()
  cantidad: number;

  @Column('decimal')
  precio: number;

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column()
  usuario_id: number;
}
