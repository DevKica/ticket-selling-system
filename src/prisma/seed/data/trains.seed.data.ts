// Types
import { TrainType } from '@prisma/client';
import { bossUserID } from '../../../tests/data/id.test.data';
// Tools
import { generateIdPrefixes } from './helpers';
// Data
import {
  employeePrefix,
  routePrefix,
  trainPrefix,
  userPrefix,
} from './prefixes';

function generateParams(
  driverId: string,
  driverHelperId: string,
  bossId: string,
  routeId: string,
  type: TrainType,
) {
  return {
    driverId,
    driverHelperId,
    bossId,
    routeId,
    type,
  };
}

function generateTrains(
  data: {
    driverId: string;
    driverHelperId: string;
    bossId: string;
    routeId: string;
    type: TrainType;
  }[],
) {
  const result = data.map((e) => {
    return {
      type: e.type,
      driver: {
        connect: { id: `${employeePrefix}${e.driverId}` },
      },
      driverHelper: {
        connect: { id: `${employeePrefix}${e.driverHelperId}` },
      },
      boss: {
        connect: { id: `${userPrefix}${e.bossId}` },
      },
      route: {
        connect: { id: `${routePrefix}${e.routeId}` },
      },
    };
  });
  return result;
}

const trains = generateTrains([
  generateParams('16', '17', bossUserID.slice(4), '1', TrainType.highSpeed),
  generateParams('18', '19', bossUserID.slice(4), '2', TrainType.passenger),
  generateParams('20', '21', '13', '3', TrainType.regional),
]);

export const trainsSeedData = generateIdPrefixes(trains, trainPrefix);
