import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bolso } from './entities/bolso.entity';
import { CreateBolsoDto } from './dto/create-bolso.dto';
import { UpdateBolsoDto } from './dto/update-bolso.dto';

@Injectable()
export class BolsosService {
  constructor(
    @InjectRepository(Bolso)
    private readonly bolsoRepo: Repository<Bolso>,
  ) {}

  async create(dto: CreateBolsoDto): Promise<Bolso> {
    const bolso = this.bolsoRepo.create(dto);
    return this.bolsoRepo.save(bolso);
  }

  findAll(): Promise<Bolso[]> {
    return this.bolsoRepo.find();
  }

  async findOne(id: string): Promise<Bolso> {
    const bolso = await this.bolsoRepo.findOne({ where: { id } });
    if (!bolso) throw new NotFoundException('Bolso no encontrado');
    return bolso;
  }

  async update(id: string, dto: UpdateBolsoDto): Promise<Bolso> {
    const bolso = await this.bolsoRepo.findOne({ where: { id } });
    if (!bolso) throw new NotFoundException('Bolso no encontrado');

    // No permitir cambiar el ID
    const { ...rest } = dto;
    const merged = this.bolsoRepo.merge(bolso, rest);
    return this.bolsoRepo.save(merged);
  }

  async remove(id: string): Promise<void> {
    const result = await this.bolsoRepo.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException('Bolso no encontrado');
    }
  }
}
