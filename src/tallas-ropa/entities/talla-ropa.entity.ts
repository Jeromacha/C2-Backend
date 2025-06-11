// src/tallas-ropa/entities/talla-ropa.entity.ts
import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Ropa } from '../../ropa/entities/ropa.entity';

@Entity({ name: 'tallas_ropa' })
export class TallaRopa {
  @PrimaryColumn()
  talla: string; // Ej: 'S', 'M', 'L', 'Copa A', etc.

  @PrimaryColumn()
  ropa_nombre: string;

  @PrimaryColumn()
  ropa_color: string;

  @Column({ type: 'int', default: 0 })
  cantidad: number;

  @ManyToOne(() => Ropa, ropa => ropa.tallas, { onDelete: 'CASCADE' })
  @JoinColumn([
    { name: 'ropa_nombre', referencedColumnName: 'nombre' },
    { name: 'ropa_color', referencedColumnName: 'color' },
  ])
  ropa: Ropa;
}
