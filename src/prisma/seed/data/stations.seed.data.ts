import generateIdPrefixes from './generateData';
import { stationPrefix } from './prefixes';

const stationsNames = [
  'New York Penn Station',
  'Grand Central Terminal',
  'Toronto Union Station',
  'Jamaica Station',
  'Chicago Union Station',
  'Ogilvie Transporation Center',
];
const stationsData = stationsNames.map((e) => {
  return { name: e };
});

export const stationsNumber = stationsNames.length;

export const stationsSeedData = generateIdPrefixes(stationsData, stationPrefix);
