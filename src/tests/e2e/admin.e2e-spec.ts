// Nest
import { TestingModule } from '@nestjs/testing';
// Tools
import {
  testAuthEndpoint,
  testDELETERequest,
  testPUTRequest,
  testPOSTRequest,
} from '../helpers/testEndpoint';
import testServer from '../testServer';
import {
  generateTestToken,
  generateAdminToken,
  removeTestToken,
} from '../helpers/globals';
// Services
import { SeedService } from '../../prisma/seed/seed.service';
// Responses
import { TokenResponse } from '../helpers/responses';
import { BlockedResourceError } from '../helpers/responses';
// Data
import {
  adminLoginBody,
  blockUserObj,
  createEmployeeObj,
  userCreatedByAdminLoginBody,
  createUserByAdminObj,
  removeUserObj,
  unblockUserObj,
  updateRolesObj,
} from '../data/admin.test.data';

describe('ADMIN', () => {
  let seedService: SeedService;
  let app: TestingModule;

  beforeAll(async () => {
    app = await testServer();
    seedService = app.get(SeedService);
    await seedService.seedModel('user');
  });
  afterAll(async () => {
    seedService.removeSpecificTable('user');
    seedService.removeSpecificTable('employee');
    removeTestToken();
    app.close();
  });

  describe('AUTHORIZATION', () => {
    it('ANONYMOUS should not be able to access admin auth route', async () => {
      await testAuthEndpoint(false, 'admin');
    });
    it('ADMIN should be able to login', async () => {
      await testPOSTRequest('/users/login', adminLoginBody, TokenResponse);
    });
    it('ADMIN should be able to access ADMIN AUTH route after logging in', async () => {
      await testAuthEndpoint(true, 'admin');
    });
  });
  describe('USERS', () => {
    describe('CREATE USER', () => {
      const { valid, invalid } = createUserByAdminObj;
      it('ADMIN should NOT be able to create a user with invalid body', async () => {
        await testPOSTRequest(
          '/admin/users',
          invalid.schema.body,
          invalid.schema.response,
        );
      });
      it('ADMIN should be able to create a user', async () => {
        await testPOSTRequest('/admin/users', valid.body, valid.response);
      });
      it('USER should be able to login', async () => {
        await testPOSTRequest(
          '/users/login',
          userCreatedByAdminLoginBody,
          TokenResponse,
        );
      });
    });
    describe('BLOCK USER', () => {
      const { valid, invalid } = blockUserObj;
      beforeAll(() => {
        generateAdminToken();
      });

      it('ADMIN should NOT be able to block a user that does not exist', async () => {
        await testPUTRequest(
          `/admin/users/block/${invalid.notFound.param}`,
          {},
          invalid.notFound.response,
        );
      });
      it('ADMIN should be able to block users', async () => {
        await testPUTRequest(
          `/admin/users/block/${valid.param}`,
          {},
          valid.response,
        );
      });
      it('BLOCKED USER should NOT be able to access USER AUTH endpoint', async () => {
        generateTestToken(valid.param);
        await testAuthEndpoint(false, 'users', BlockedResourceError);
      });
    });
    describe('UNBLOCK USER', () => {
      const { valid, invalid } = unblockUserObj;
      beforeAll(() => {
        generateAdminToken();
      });

      it('ADMIN should NOT be able to unblock a user that does not exist', async () => {
        await testPUTRequest(
          `/admin/users/unblock/${invalid.notFound.param}`,
          {},
          invalid.notFound.response,
        );
      });
      it('ADMIN should be able to unblock users', async () => {
        await testPUTRequest(
          `/admin/users/unblock/${valid.param}`,
          {},
          valid.response,
        );
      });
      it('UNBLOCKED USER should be able to access USER AUTH endpoint', async () => {
        generateTestToken(valid.param);
        await testAuthEndpoint(true, 'users', BlockedResourceError);
      });
    });
    describe('SET ROLES', () => {
      const { valid, invalid } = updateRolesObj;
      beforeAll(() => {
        generateAdminToken();
      });

      it('ADMIN should NOT be able to update non existings users roles', async () => {
        await testPUTRequest(
          `/admin/users/role?id=${invalid.notFound.param}&role=inv`,
          {},
          invalid.notFound.response,
        );
      });
      it('ADMIN should be able to update users roles', async () => {
        await testPUTRequest(
          `/admin/users/role?id=${valid.param}&role=${valid.role}`,
          {},
          valid.response,
        );
      });
      it(`UPDATED USER should be able to access ${valid.role} AUTH endpoint`, async () => {
        generateTestToken(valid.param);
        await testAuthEndpoint(true, valid.role);
      });
    });
    describe('REMOVE USER', () => {
      const { valid, invalid } = removeUserObj;
      beforeAll(() => {
        generateAdminToken();
      });

      it('ADMIN should NOT be able to remove non existings users', async () => {
        await testDELETERequest(
          `/admin/users/${invalid.notFound.param}`,
          {},
          invalid.notFound.response,
        );
      });
      it('ADMIN should be able to remove users', async () => {
        await testDELETERequest(
          `/admin/users/${valid.param}`,
          {},
          valid.response,
        );
      });
      it(`REMOVED USER should NOT be able to access USER AUTH endpoint`, async () => {
        generateTestToken(valid.param);
        await testAuthEndpoint(false, 'users');
      });
    });
  });
  describe('EMPLOYEES', () => {
    describe('CREATE EMPLOYEE', () => {
      const { valid, invalid } = createEmployeeObj;
      beforeAll(() => {
        generateAdminToken();
      });

      it('ADMIN should NOT be able to create employee with invalid body', async () => {
        await testPOSTRequest(
          '/admin/employees',
          invalid.schema.body,
          invalid.schema.response,
        );
      });
      it('ADMIN should be able to create employee', async () => {
        await testPOSTRequest('/admin/employees', valid.body, valid.response);
      });
    });
  });
});
