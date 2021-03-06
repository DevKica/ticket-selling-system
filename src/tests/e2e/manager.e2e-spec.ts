// Nest
import { TestingModule } from '@nestjs/testing';
// Tools
import testServer from '../testServer';
import {
  testAuthEndpoint,
  testGETRequest,
  testPOSTRequest,
} from '../helpers/testEndpoint';
import {
  generateManagerToken,
  generateUserToken,
  removeTestToken,
} from '../helpers/globals';
// Services
import { SeedService } from '../../prisma/seed/seed.service';
// Data
import {
  createTicketByManagerObj,
  getAllEmployeesObj,
  getSingleEmployeeObj,
} from './../data/manager.test.data';
// Responses
import { ForbiddenError } from '../helpers/responses';

describe('MANAGER', () => {
  let app: TestingModule;
  let seedService: SeedService;
  beforeAll(async () => {
    app = await testServer();
    seedService = app.get(SeedService);

    await seedService.main();
  });
  afterAll(async () => {
    await seedService.removeAllTables();
    removeTestToken();
    app.close();
  });

  describe('AUTHORIZATION', () => {
    it('ANONYMOUS should not be able to access MANAGER AUTH route', async () => {
      await testAuthEndpoint(false, 'manager');
    });
    it('USER should not be able to access MANAGER AUTH route', async () => {
      generateUserToken();
      await testAuthEndpoint(false, 'manager');
    });
    it('MANAGER should be able to access USER AUTH route', async () => {
      generateManagerToken();
      await testAuthEndpoint(true, 'users');
    });
    it('MANAGER should be able to access MANAGER AUTH route', async () => {
      await testAuthEndpoint(true, 'manager');
    });
  });
  describe('EMPLOYEES', () => {
    const { valid, invalid } = getSingleEmployeeObj;

    it('ANONYMOUS should NOT be able to access employees data', async () => {
      generateUserToken();
      await testGETRequest('/manager/employees', ForbiddenError);
    });

    it('MANAGER should be able to access employees data', async () => {
      generateManagerToken();
      await testGETRequest('/manager/employees', getAllEmployeesObj);
    });

    it('MANAGER should NOT be able to access single employee data that does not exist', async () => {
      await testGETRequest(
        `/manager/employees/${invalid.param}`,
        invalid.response,
      );
    });
    it('MANAGER should be able to access single employee data', async () => {
      await testGETRequest(`/manager/employees/${valid.param}`, valid.response);
    });
  });
  describe('TICKETS', () => {
    const { valid, invalid } = createTicketByManagerObj;
    it('MANAGER should NOT be able to buy/book ticket with INVALID body', async () => {
      await testPOSTRequest(
        '/manager/tickets',
        invalid.schema.body,
        invalid.schema.response,
      );
    });
    it('MANAGER should NOT be able to buy/book ticket for user that does not exist', async () => {
      await testPOSTRequest(
        '/manager/tickets',
        invalid.notFoundUser.body,
        invalid.notFoundUser.response,
      );
    });
    it('MANAGER should NOT be able to BOOK ticket for user >3days ahead', async () => {
      await testPOSTRequest(
        '/manager/tickets',
        invalid.tooLateToBook.body,
        invalid.tooLateToBook.response,
      );
    });
    it('MANAGER should be able to buy ticket for user', async () => {
      await testPOSTRequest(
        '/manager/tickets',
        valid.buy.body,
        valid.buy.response,
      );
    });
    it('MANAGER should be able to BOOK ticket for user', async () => {
      await testPOSTRequest(
        '/manager/tickets',
        valid.book.body,
        valid.book.response,
      );
    });
  });
});
