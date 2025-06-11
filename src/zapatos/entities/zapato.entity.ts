import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { Talla } from '../../tallas/entities/tallas.entity';

@Entity({ name: 'zapatos' })
export class Zapato {
  @PrimaryColumn()
  id: number; // ahora lo defines manualmente

  @Column()
  nombre: string;

  @Column()
  ubicacion: string;

  @Column({ name: 'imagen_url' })
  imagen_url: string;

  @Column('decimal')
  precio: number;

  @Column()
  categoriaNombre: string;

  @Column({ nullable: true })
  observaciones: string;

  @ManyToOne(() => Categoria, categoria => categoria.zapatos, { eager: true })
  @JoinColumn({ name: 'categoriaNombre', referencedColumnName: 'nombre' })
  categoria: Categoria;

  @OneToMany(() => Talla, talla => talla.zapato)
  tallas: Talla[];
}
