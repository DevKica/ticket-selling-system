import { HttpStatus } from '@nestjs/common';
import { State } from '@prisma/client';
import {
  employeesTestData,
  testEmployeeId,
} from '../../prisma/seed/data/employees.seed.data';
import {
  trainPrefix,
  carriagePrefix,
  stationPrefix,
} from '../../prisma/seed/data/prefixes';
import { createTicketByManagerSchema } from '../../validation/schemas/ticket.schema';
import {
  NotFoundErrorInstance,
  requestedBodySchemaError,
} from '../helpers/responses';
import { testUserID } from './id.test.data';
import { ticketOmitProperties } from './tickets.test.data';

export function formatArrayResponse(arr: any[]) {
  const result = {};
  arr.forEach((e, idx) => {
    result[idx] = e;
  });
  return result;
}

export const getAllEmployeesObj = {
  data: formatArrayResponse(employeesTestData),
  status: 200,
  omit: [],
};

export const getSingleEmployeeObj = {
  valid: {
    param: testEmployeeId,
    response: {
      data: employeesTestData.filter((e) => e.id == testEmployeeId)[0],
      status: 200,
      omit: [],
    },
  },
  invalid: {
    param: '12',
    response: NotFoundErrorInstance,
  },
};

const buyTicketByManagerBody = {
  state: State.bought,
  userId: testUserID,
  seat: 40,
  trainId: `${trainPrefix}1`,
  carriageId: `${carriagePrefix}1`,
  startStationId: `${stationPrefix}1`,
  endStationId: `${stationPrefix}4`,
};
const bookTicketByManagerBody = {
  ...buyTicketByManagerBody,
  state: State.booked,
  seat: 39,
};
const invalidCreateTicketByManagerBody = {
  ...buyTicketByManagerBody,
  state: 'boughtt',
};

export const createTicketByManagerObj = {
  valid: {
    buy: {
      body: buyTicketByManagerBody,
      response: {
        data: buyTicketByManagerBody,
        status: HttpStatus.CREATED,
        omit: ticketOmitProperties,
      },
    },
    book: {
      body: bookTicketByManagerBody,
      response: {
        data: bookTicketByManagerBody,
        status: HttpStatus.CREATED,
        omit: ticketOmitProperties,
      },
    },
  },
  invalid: {
    notFoundUser: {
      body: {
        ...buyTicketByManagerBody,
        userId: 'notFound123',
      },
      response: NotFoundErrorInstance,
    },
    schema: {
      body: invalidCreateTicketByManagerBody,
      response: requestedBodySchemaError(
        createTicketByManagerSchema,
        invalidCreateTicketByManagerBody,
      ),
    },
  },
};
