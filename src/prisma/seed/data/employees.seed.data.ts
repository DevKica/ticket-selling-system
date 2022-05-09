import { faker } from '@faker-js/faker';
import { Position } from '@prisma/client';
import generateIdPrefixes from './generateData';

export const employeePrefix = 'employee';

function generateEmployees(n: number) {
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push({
      name: faker.name.firstName(),
      surname: faker.name.lastName(),
      address: faker.address.cityName(),
      telephoneNumber: faker.phone.phoneNumber(),
      dateOfBirth: faker.date.betweens(
        '1980-01-01T00:00:00.000Z',
        '2000-01-01T00:00:00.000Z',
      )[0],
    });
  }
  return result;
}

const numberOfEmployees = 10;

export const numberOfConductors = numberOfEmployees / 2;
export const numberOfDrivers = numberOfEmployees - numberOfConductors;
export const defaultEmployeePhotoPath = `${employeePrefix}0`;

const employeesData = generateEmployees(numberOfEmployees);

employeesData.forEach((employee, idx) => {
  employeesData[idx] = {
    ...employee,
    position: idx < numberOfConductors ? Position.conductor : Position.driver,
    photoPath: defaultEmployeePhotoPath,
  };
});

export const employeesSeedData = generateIdPrefixes(
  employeesData,
  employeePrefix,
);
