import CheapRuler from 'cheap-ruler';
import PositionInterpolator from '../../../../core/geo-data/PositionInterpolator';
import { $sb } from '../../../utils/sandbox';
import { assert } from 'chai';

describe('PositionInterpolator unit', function () {
  let lines;
  beforeEach('set traces', function () {
    lines = [
      {
        type: 'LineString',
        coordinates: [
          [31.3237123, 30.0911747],
          [31.3236908, 30.0912102],
          [31.3237244, 30.091166],
          [31.3237442, 30.0911124],
        ],
      },
      {
        type: 'LineString',
        coordinates: [
          [31.3237442, 30.0911124],
          [31.3240598, 30.0910372],
          [31.3239311, 30.090942],
          [31.3239431, 30.0909262],
        ],
      },
    ];
  });
  it('should calculate next point position as: elapsedTimeSinceNewPointReceived / timeWindow * lineDistance with max distance = lineDistance', function () {
    const ruler = new CheapRuler(lines[0].coordinates[0][1], 'meters');

    const timeWindow = 9 * 1000;
    const currentTime = 10 * 1000;
    const elapsedTime = currentTime + 5 * 1000;

    $sb
      .stub(Date, 'now')
      .onCall(0)
      .returns(currentTime)
      .onCall(1)
      .returns(elapsedTime);

    const pm = new PositionInterpolator({
      timeWindowMillis: timeWindow,
      lineString: lines[0],
    });

    const position = pm.nextPosition();

    assert.deepEqual(position, {
      type: 'Point',
      coordinates: ruler.along(
        lines[0].coordinates,
        ((elapsedTime - currentTime) / timeWindow) *
          ruler.lineDistance(lines[0].coordinates)
      ),
    });
  });
  it('should return last point if elapsedTimeSinceNewPointReceived >= timeWindow', function () {
    const timeWindow = 9 * 1000;
    const currentTime = 10 * 1000;
    const elapsedTime = currentTime + 12 * 1000;

    $sb
      .stub(Date, 'now')
      .onCall(0)
      .returns(currentTime)
      .onCall(1)
      .returns(elapsedTime);

    const pm = new PositionInterpolator({
      lineString: lines[0],
      timeWindowMillis: timeWindow,
    });

    const position = pm.nextPosition();

    assert.deepEqual(position, {
      type: 'Point',
      coordinates: lines[0].coordinates.slice().pop(),
    });
  });
  it('should return new position correctly when updated with a new lineString', function () {
    const ruler = new CheapRuler(lines[0].coordinates[0][1], 'meters');

    const timeWindow = 9 * 1000;
    const currentTime = 10 * 1000;
    const elapsedTime = currentTime + 10 * 1000;
    const updatedCurrentTime = 21 * 1000;
    const updatedElapsedTime = updatedCurrentTime + 5 * 1000;

    $sb
      .stub(Date, 'now')
      .onCall(0)
      .returns(currentTime)
      .onCall(1)
      .returns(elapsedTime)
      .onCall(2)
      .returns(updatedCurrentTime)
      .onCall(3)
      .returns(updatedElapsedTime);

    const pm = new PositionInterpolator({
      lineString: lines[0],
      timeWindowMillis: timeWindow,
    });

    pm.nextPosition();

    pm.updateLine(lines[1]);

    const position = pm.nextPosition();

    assert.deepEqual(position, {
      type: 'Point',
      coordinates: ruler.along(
        lines[1].coordinates,
        ((updatedElapsedTime - updatedCurrentTime) / timeWindow) *
          ruler.lineDistance(lines[1].coordinates)
      ),
    });
  });

  it('should continue new positions from last generated point if updated with new lineString and elapsedTime < timeWindow', function () {
    const timeWindow = 9 * 1000;
    const currentTime = 10 * 1000;
    const elapsedTime = currentTime + 5 * 1000;
    const updatedCurrentTime = 21 * 1000;

    $sb
      .stub(Date, 'now')
      .onCall(0)
      .returns(currentTime)
      .onCall(1)
      .returns(elapsedTime)
      .onCall(2)
      .returns(updatedCurrentTime)
      .onCall(3)
      .returns(updatedCurrentTime);

    const pm = new PositionInterpolator({
      lineString: lines[0],
      timeWindowMillis: timeWindow,
    });

    const previousPosition = pm.nextPosition();

    pm.updateLine(lines[1]);

    const currentPosition = pm.nextPosition();

    assert.deepEqual(currentPosition, previousPosition);
  });
});
