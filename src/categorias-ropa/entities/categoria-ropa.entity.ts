// src/categorias-ropa/entities/categoria-ropa.entity.ts
import { Entity, PrimaryColumn, OneToMany, Column } from 'typeorm';
import { Ropa } from '../../ropa/entities/ropa.entity';

@Entity({ name: 'categorias_ropa' })
export class CategoriaRopa {
  @PrimaryColumn()
  nombre: string;

  @OneToMany(() => Ropa, ropa => ropa.categoria)
  ropa: Ropa[];
}
