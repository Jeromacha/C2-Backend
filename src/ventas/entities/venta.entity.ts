import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity({ name: 'ventas' })
export class Venta {
  @PrimaryGeneratedColumn()
  id: number;

  // Igual que devoluciones: DB pone timestamp con zona y hora real
  @CreateDateColumn({ type: 'timestamptz' })
  fecha: Date;

  @Column()
  producto: string;

  @Column()
  tipo: string; // 'zapato' | 'ropa' | 'bolso'

  @Column({ nullable: true })
  color: string;

  @Column()
  talla: string;

  @Column()
  cantidad: number;

  @Column('numeric')
  precio: number;

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column()
  usuario_id: number;
}
