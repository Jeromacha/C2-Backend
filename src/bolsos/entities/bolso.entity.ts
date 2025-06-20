// src/bolsos/entities/bolso.entity.ts
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('bolsos')
export class Bolso {
  @PrimaryColumn() // ← NOTA: ya que no es serial
  id: string;

  @Column()
  nombre: string;

  @Column()
  color: string;

  @Column('decimal')
  precio: number;

  @Column({ nullable: true })
  observaciones: string;

  @Column('int')
  cantidad: number;
}
