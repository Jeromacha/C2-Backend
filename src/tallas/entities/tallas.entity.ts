import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Zapato } from '../../zapatos/entities/zapato.entity';

@Entity({ name: 'tallas' })
export class Talla {
  @PrimaryColumn('float')
  talla: number;

  @Column({ type: 'int', default: 0 })
  cantidad: number;

  @ManyToOne(() => Zapato, zapato => zapato.tallas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'zapato_id' })
  zapato: Zapato;

  @Column()
  zapato_id: number;
}
