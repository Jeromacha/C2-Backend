// src/entradas-mercancia/entities/entrada-mercancia.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { TipoProducto } from '../../ventas/dto/create-venta.dto';

@Entity({ name: 'entradas_mercancia' })
export class EntradaMercancia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: TipoProducto })
  tipo: TipoProducto;

  @Column({ type: 'int', nullable: true })
  zapato_id: number;

  @Column({ nullable: true })
  ropa_nombre: string;

  @Column({ nullable: true })
  ropa_color: string;

  @Column({ nullable: true })
  bolso_id: string;

  @Column({ nullable: true })
  talla: string;

  @Column({ type: 'int' })
  cantidad: number;

  @CreateDateColumn()
  fecha: Date;

  // ✅ Igual que en ventas: traer siempre el usuario (para poder mostrar usuario.nombre en el front)
  //    Nota: como tienes onDelete: 'SET NULL', conviene que la FK sea nullable.
  @ManyToOne(() => Usuario, { onDelete: 'SET NULL', eager: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ nullable: true })
  usuario_id: number;
}
