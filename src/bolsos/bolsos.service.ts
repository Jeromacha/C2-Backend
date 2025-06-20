import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bolso } from './entities/bolso.entity';
import { CreateBolsoDto } from './dto/create-bolso.dto';

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
}
