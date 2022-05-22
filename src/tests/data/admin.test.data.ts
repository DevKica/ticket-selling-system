// Nest
import { HttpStatus } from '@nestjs/common';
// Tools
import { DocumentType } from '@prisma/client';
import { modifyObject, omit } from '../../utils/objects';
// Data
import { testUserId } from './id.test.data';
import { InvalidRequestedBody } from '../../utils/responses/errors';
// Config
import { defaultEmployeePhotoPath } from '../../config/files.config';
// Responses
import {
  NotFoundErrorInstance,
  SuccessTestResponse,
} from '../helpers/responses.dto';
// Validation
import { validateSchema } from '../../validation/validationPipe';
import { createUserByAdminSchema } from '../../validation/schemas/user.schema';
import { createEmployeeSchema } from '../../validation/schemas/employee.schema';

export const adminLoginBody = {
  email: 'admin@example.com',
  password: 'Admin1234!',
};
export const createUserByAdminLoginBody = {
  email: 'kamil@example.com',
  password: 'Passoword1!',
};

export const createUserByAdminBody = {
  name: 'Kamil',
  surname: 'Mysliwiec',
  role: 'default',
  passwordRepetition: 'Passoword1!',
  documentType: DocumentType.identityCard,
  documentNumber: '0909',
  ...createUserByAdminLoginBody,
};

export const invalidCreateUserByAdminBody = modifyObject(
  createUserByAdminLoginBody,
  '!',
);

export const createUserByAdminObj = {
  valid: {
    body: createUserByAdminBody,
    response: {
      data: {
        ...omit(createUserByAdminBody, ['password', 'passwordRepetition']),
        blocked: false,
      },
      status: HttpStatus.CREATED,
      omit: 'id',
    },
  },
  invalid: {
    schema: {
      body: invalidCreateUserByAdminBody,
      response: new InvalidRequestedBody(
        validateSchema(createUserByAdminSchema, invalidCreateUserByAdminBody),
      ),
    },
  },
};

export const blockUserObj = {
  valid: {
    param: testUserId,
    response: SuccessTestResponse,
  },
  invalid: {
    notFound: {
      param: '2115',
      response: NotFoundErrorInstance,
    },
  },
};

export const unblockUserObj = blockUserObj;
export const updateRolesObj = {
  ...blockUserObj,
  valid: {
    ...blockUserObj.valid,
    role: 'admin',
  },
};

export const removeUserObj = blockUserObj;

const createEmployeeBody = {
  name: 'TheBest',
  surname: 'Employee',
  dateOfBirth: new Date('1990-01-01').toISOString(),
  address: 'Poland',
  telephoneNumber: '123456789',
  position: 'driver',
};
const invalidCreateEmployeeBody = modifyObject(createEmployeeBody, '!');

export const createEmployeeObj = {
  valid: {
    body: createEmployeeBody,
    response: {
      data: { ...createEmployeeBody, photoPath: defaultEmployeePhotoPath },
      status: HttpStatus.CREATED,
      omit: 'id',
    },
  },
  invalid: {
    schema: {
      body: invalidCreateEmployeeBody,
      response: new InvalidRequestedBody(
        validateSchema(createEmployeeSchema, invalidCreateEmployeeBody),
      ),
    },
  },
};
