// src/ropa/entities/ropa.entity.ts
import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { CategoriaRopa } from '../../categorias-ropa/entities/categoria-ropa.entity';
import { TallaRopa } from '../../tallas-ropa/entities/talla-ropa.entity';

@Entity({ name: 'ropa' })
export class Ropa {
  @PrimaryColumn()
  nombre: string;

  @PrimaryColumn()
  color: string;

  @Column('decimal')
  precio: number;

  @Column({ name: 'imagen_url' })
  imagen_url: string;

  @Column()
  categoriaNombre: string;

  @ManyToOne(() => CategoriaRopa, categoria => categoria.ropa, { eager: true })
  @JoinColumn({ name: 'categoriaNombre', referencedColumnName: 'nombre' })
  categoria: CategoriaRopa;

  @OneToMany(() => TallaRopa, talla => talla.ropa)
  tallas: TallaRopa[];

  @Column({ nullable: true })
  observaciones?: string; // ✅ nueva columna opcional
}
