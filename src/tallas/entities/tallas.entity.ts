import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Zapato } from '../../zapatos/entities/zapato.entity';

@Entity({ name: 'tallas' })
@Index(['zapato_id', 'talla'], { unique: true }) // redundante con la PK compuesta, pero explícito
export class Talla {
  // Clave primaria compuesta
  @PrimaryColumn('float')
  talla: number;

  @PrimaryColumn('int')
  zapato_id: number;

  @Column({ type: 'int', default: 0 })
  cantidad: number;

  @ManyToOne(() => Zapato, (zapato) => zapato.tallas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'zapato_id', referencedColumnName: 'id' })
  zapato: Zapato;
}
