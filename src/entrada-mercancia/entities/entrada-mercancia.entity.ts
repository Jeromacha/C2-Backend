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

  @ManyToOne(() => Usuario, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column()
  usuario_id: number;
}
