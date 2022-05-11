import generateIdPrefixes from './generateData';
import { stationPrefix } from './prefixes';

const stationsNames = [
  'New York Penn Station',
  'Grand Central Terminal',
  'Toronto Union Station',
  'Jamaica Station',
  'Chicago Union Station',
  'Ogilvie Transporation Center',
  'South Station',
  'Newark Penn Station',
  'Hoboken Terminal',
  'Washington Union Station',
  '30th Street Station',
  'Los Angeles Union Station',
  'Millennium Station',
  'Montreal Central Station',
];
const stationsData = stationsNames.map((e) => {
  return { name: e };
});

export const stationsNumber = stationsNames.length;

export const stationsSeedData = generateIdPrefixes(stationsData, stationPrefix);
