import PilotStatus from '../../../../../src/core/deprecated/pilots/PilotStatus';
import { assert } from 'chai';

describe('PilotStatus Unit', function () {
  it('should default to NONE if no value is given', function () {
    const pilotStatus = new PilotStatus();

    assert.equal(pilotStatus.value, 'NONE');
  });

  it('should return value if no lookupValue is found', function () {
    const pilotStatus = new PilotStatus({ value: 'invalid status' });

    assert.equal(pilotStatus.string, 'invalid status');
  });

  it('should map value correctly if a lookup is found', function () {
    const pilotStatus = new PilotStatus({ value: 'LOADED' });

    assert.equal(pilotStatus.string, `lookups.pilot_status.LOADED`);
  });

  it('should have a lookup with correct props', function () {
    assert.deepEqual(PilotStatus.lookup, {
      UNAVAILABLE: {
        value: 'UNAVAILABLE',
        busyState: false,
      },
      AVAILABLE: {
        value: 'AVAILABLE',
        busyState: false,
      },
      LOADED: {
        value: 'LOADED',
        busyState: true,
        color: '#AD1457',
        dark: true,
      },
      IN_HUB: {
        value: 'IN_HUB',
        busyState: false,
      },
      ASSIGNED: {
        value: 'ASSIGNED',
        busyState: true,
        color: '#F9A825',
        dark: true,
      },
      CANDIDATE: {
        value: 'CANDIDATE',
        busyState: true,
      },
      WAITING: {
        value: 'WAITING',
        busyState: true,
        color: '#EF6C00',
        dark: true,
      },
      COLLECTING: {
        value: 'COLLECTING',
        busyState: true,
        color: '#ad6b8a',
        dark: true,
      },
      NONE: {
        value: 'NONE',
        busyState: false,
      },
    });
  });
});
