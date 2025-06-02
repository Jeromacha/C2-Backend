import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { Talla } from '../../tallas/entities/tallas.entity';

@Entity('Zapatos')
export class Zapato {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column('decimal') // precio decimal
  precio: number;

  // Aquí la relación con Categoría
  @ManyToOne(() => Categoria, (categoria) => categoria.zapatos, { eager: true })
  @JoinColumn({ name: 'categoria_nombre' }) // La columna FK en Zapatos que referencia Categoria.nombre
  categoria: Categoria;

  @OneToMany(() => Talla, (talla) => talla.zapato)
  tallas: Talla[];
}
