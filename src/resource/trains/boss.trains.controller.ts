// Nest
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  NotFoundException,
  Query,
  UseGuards,
} from '@nestjs/common';
// Guards
import { RequireHigherRole } from '../../guards/requireRole.guard';
// Services
import { TrainsService } from './trains.service';
// Decorators
import { UserID } from '../../decorators/userID.decorator';
// Tools
import * as moment from 'moment';
// Types
import {
  BossTrainsLookupQuery,
  TrainsReportQuery,
} from '../../utils/query/index.types';
import { TrainEntity } from '../../@types/models/trains.types.dto';
import { trainPrefix } from '../../prisma/seed/data/prefixes';
import { ApiSubjectNotFoundResponse } from '../../utils/swagger';
import { requestDateFormat } from '../../config/dates.config';

@ApiBearerAuth()
@UseGuards(RequireHigherRole)
@ApiTags('Boss - Trains')
@Controller('boss/trains')
export class BossTrainsController {
  constructor(private readonly trainsService: TrainsService) {}

  @ApiOperation({
    description: 'Returns trains filtered by boss id',
  })
  @Get()
  async getTrains(
    @Query() { bossId }: BossTrainsLookupQuery,
    @UserID() id: string,
  ): Promise<TrainEntity[]> {
    return this.trainsService.findMany({ bossId: bossId ? bossId : id });
  }

  @ApiOperation({
    description: 'Generate detailed report about trains',
  })
  @ApiQuery({
    name: 'id',
    description: 'Specify the id of train to generate report',
    examples: {
      seed: {
        value: `${trainPrefix}1`,
      },
      empty: {
        value: '',
      },
    },
    required: false,
  })
  @ApiQuery({
    name: 'departureTime',
    description: 'Filter by departureTime property',
    examples: {
      empty: {
        value: '',
      },
      seed: {
        value: moment().add(3, 'd').format(requestDateFormat),
      },
    },
    required: false,
  })
  @ApiSubjectNotFoundResponse('Train')
  @Get('report')
  async getReport(@Query() { id, departureTime }: TrainsReportQuery) {
    const train = await this.trainsService.generateReport({
      id,
      route: {
        departureTime: {
          gt: departureTime,
        },
      },
    });
    if (!train) throw new NotFoundException();
    return train;
  }
}
