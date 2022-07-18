import CheapRuler from 'cheap-ruler';

const distanceUnits = Object.freeze({
  METERS: 'meters',
  KILOMETERS: 'kilometers',
});

function extractPointPosition(point) {
  return point.coordinates;
}
function extractLinePositions(line) {
  return line.coordinates;
}

function extractLatitude(position) {
  return position[1];
}

export function geoRuler({ point, unit = distanceUnits.METERS }) {
  const ruler = new CheapRuler(
    extractLatitude(extractPointPosition(point)),
    unit
  );

  return {
    lineDistance(lineString) {
      return ruler.lineDistance(extractLinePositions(lineString));
    },
    along(lineString, distance) {
      return ruler.along(extractLinePositions(lineString), distance);
    },
  };
}
