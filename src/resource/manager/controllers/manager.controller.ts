// Nest
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
// Guards
import { RequireManager } from '../../../guards/requireRole.guard';
// Responses
import {
  SuccessResponse,
  SuccessResponseDto,
} from '../../../@types/utils/responses.types';
import { ApiAuthEndpointResponse } from '../../../utils/swagger';

@ApiBearerAuth()
@UseGuards(RequireManager)
@ApiTags('Manager - main')
@Controller('manager')
export class ManagerController {
  @ApiAuthEndpointResponse()
  @HttpCode(HttpStatus.OK)
  @Post('auth')
  auth(): SuccessResponseDto {
    return SuccessResponse;
  }
}
