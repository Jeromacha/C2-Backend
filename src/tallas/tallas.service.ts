import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Talla } from './entities/tallas.entity';

@Injectable()
export class TallasService {
  constructor(
    @InjectRepository(Talla)
    private readonly tallaRepository: Repository<Talla>,
  ) {}

  async create(tallaData: Partial<Talla>): Promise<Talla> {
    const talla = this.tallaRepository.create(tallaData);
    return await this.tallaRepository.save(talla);
  }

  async findAll(): Promise<Talla[]> {
    return await this.tallaRepository.find({ relations: ['zapato'] });
  }

  async findOne(talla: number, zapato_id: number): Promise<Talla> {
    const tallaEntity = await this.tallaRepository.findOne({
      where: { talla, zapato_id },
      relations: ['zapato'],
    });

    if (!tallaEntity) {
      throw new NotFoundException(`Talla ${talla} para zapato ${zapato_id} no encontrada`);
    }
    return tallaEntity;
  }

  async update(talla: number, zapato_id: number, updateData: Partial<Talla>): Promise<Talla> {
    const tallaEntity = await this.findOne(talla, zapato_id);
    Object.assign(tallaEntity, updateData);
    return await this.tallaRepository.save(tallaEntity);
  }

  async remove(talla: number, zapato_id: number): Promise<void> {
    const tallaEntity = await this.findOne(talla, zapato_id);
    await this.tallaRepository.remove(tallaEntity);
  }
}
