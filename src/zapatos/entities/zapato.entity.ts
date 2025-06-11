import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { Talla } from '../../tallas/entities/tallas.entity';

@Entity({ name: 'zapatos' })
export class Zapato {
  @PrimaryGeneratedColumn()
  id: number;

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

  @ManyToOne(() => Categoria, categoria => categoria.zapatos, { eager: true })
  @JoinColumn({ name: 'categoriaNombre', referencedColumnName: 'nombre' })
  categoria: Categoria;

  @OneToMany(() => Talla, talla => talla.zapato)
  tallas: Talla[];
}
