// Responses
import {
  ConflictException,
  ForbiddenException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import {
  BlockedResourceException,
  InvalidCredentials,
  InvalidRequestedBody,
} from '../../utils/responses/errors';
import { SuccessResponse } from '../../utils/responses/main.dto';

export const ConflictExceptionError = new ConflictException();
export const InvalidCredentialsError = new InvalidCredentials();
export const ForbiddenError = new ForbiddenException();
export const NotFoundErrorInstance = new NotFoundException();
export const BlockedResourceError = new BlockedResourceException();

export const InvalidCarriageIdError = new InvalidRequestedBody(
  'Invalid carriage id',
);
export const InvalidTrainIdError = new InvalidRequestedBody('Invalid train id');

export const InvalidSeatNumberError = new InvalidRequestedBody(
  'Invalid seat number',
);
export const InvalidStationsError = new InvalidRequestedBody(
  'Invalid stations',
);
export const NotFoundPriceError = new InvalidRequestedBody(
  'We are not selling tickets for this route yet, try again later',
);

export const TokenResponse = { data: {}, status: HttpStatus.OK, omit: 'token' };

export const SuccessTestResponse = {
  data: SuccessResponse,
  status: HttpStatus.OK,
  omit: [],
};
