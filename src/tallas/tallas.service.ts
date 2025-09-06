import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Talla } from './entities/tallas.entity';
import { CreateTallaDto } from './dto/create-tallas.dto';
import { UpdateTallaDto } from './dto/update-tallas.dto';

@Injectable()
export class TallasService {
  constructor(
    @InjectRepository(Talla)
    private readonly tallaRepository: Repository<Talla>,
  ) {}

  async create(createTallaDto: CreateTallaDto): Promise<Talla> {
    const existente = await this.tallaRepository.findOne({
      where: {
        talla: createTallaDto.talla,
        zapato_id: createTallaDto.zapato_id,
      },
    });

    if (existente) {
      throw new ConflictException(
        `Ya existe talla ${createTallaDto.talla} para el zapato ${createTallaDto.zapato_id}`,
      );
    }

    const talla = this.tallaRepository.create(createTallaDto);
    return await this.tallaRepository.save(talla);
  }

  async findAll(): Promise<Talla[]> {
    return this.tallaRepository.find({ relations: ['zapato'] });
  }

  async findOne(talla: number, zapato_id: number): Promise<Talla> {
    const result = await this.tallaRepository.findOne({
      where: { talla, zapato_id },
      relations: ['zapato'],
    });

    if (!result) {
      throw new NotFoundException(
        `Talla ${talla} para zapato ${zapato_id} no encontrada`,
      );
    }

    return result;
  }

  async update(talla: number, zapato_id: number, updateDto: UpdateTallaDto): Promise<Talla> {
    const existente = await this.findOne(talla, zapato_id);
    Object.assign(existente, updateDto);
    return this.tallaRepository.save(existente);
  }

  async remove(talla: number, zapato_id: number): Promise<void> {
    const existente = await this.findOne(talla, zapato_id);
    await this.tallaRepository.remove(existente);
  }
}
