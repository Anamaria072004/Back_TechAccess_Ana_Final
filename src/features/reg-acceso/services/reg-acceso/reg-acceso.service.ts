import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Acceso } from '../../entities/acceso.entity';
import { CreateAccesoDto, UpdateAccesoDto } from '../../dtos/acceso.dto';

@Injectable()
export class RegAccesoService {
  constructor(
    @InjectRepository(Acceso)
    private accesoRepository: Repository<Acceso>,
  ) {}

  async create(createAccesoDto: CreateAccesoDto): Promise<Acceso> {
    const acceso = this.accesoRepository.create({
      ...createAccesoDto,
      horaIngreso: new Date(),
    });
    return this.accesoRepository.save(acceso);
  }

  async findAll(): Promise<Acceso[]> {
    return this.accesoRepository.find();
  }

  async findOne(id: number): Promise<Acceso> {
    return this.accesoRepository.findOneOrFail({ where: { id } });
}

  async update(id: number, updateAccesoDto: UpdateAccesoDto): Promise<Acceso> {
    await this.accesoRepository.update(id, updateAccesoDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.accesoRepository.delete(id);
  }
}