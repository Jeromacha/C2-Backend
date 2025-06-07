import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Zapato } from '../../zapatos/entities/zapato.entity';

@Entity('categorias')
export class Categoria {
  @PrimaryColumn()
  nombre: string;

  @OneToMany(() => Zapato, (zapato) => zapato.categoria)
  zapatos: Zapato[];
}
