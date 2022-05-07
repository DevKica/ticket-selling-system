import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateStationDto } from '../../@types/models/stations.types';

@Injectable()
export class StationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateStationDto) {
    return this.prisma.station.create({ data });
  }
}
