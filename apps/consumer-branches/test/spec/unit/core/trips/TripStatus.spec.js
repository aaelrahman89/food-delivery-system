import TripStatus from '../../../../../src/core/models/TripStatus';
import { assert } from 'chai';
import { helpers } from '../../../../utils';

const statuses = [
  {
    value: 'REQUESTED',
    isCancellable: true,
    canEditTasksPerTrip: true,
  },
  {
    value: 'PENDING',
    isCancellable: true,
    canEditTasksPerTrip: true,
  },
  {
    value: 'REJECTED',
    isCancellable: true,
    canEditTasksPerTrip: true,
  },
  {
    value: 'ASSIGNED',
    isCancellable: true,
    canEditTasksPerTrip: true,
  },
  {
    value: 'OPENED',
    isCancellable: false,
    canEditTasksPerTrip: false,
  },
  {
    value: 'NOT_FULFILLED',
    isCancellable: false,
    canEditTasksPerTrip: false,
  },
  {
    value: 'CANCELLED',
    isCancellable: false,
    canEditTasksPerTrip: false,
  },
  {
    value: 'CLOSED',
    isCancellable: false,
    canEditTasksPerTrip: false,
  },
];

describe('TripStatus Unit', function () {
  it('should default to NONE if no value is given', function () {
    const tripStatus = new TripStatus();

    assert.equal(tripStatus.value, 'NONE');
  });

  it('should return value if no lookupValue is found', function () {
    const randomString = helpers.randString();
    const tripStatus = new TripStatus({ value: randomString });

    assert.equal(tripStatus.string, randomString);
  });

  it('should map value correctly if a lookup is found', function () {
    const randomLookup = helpers.randArrayItem(statuses);
    const tripStatus = new TripStatus(randomLookup);

    assert.equal(
      tripStatus.string,
      `lookups.trip_status.${randomLookup.value}`
    );
  });

  it('should have a static lookup array', function () {
    assert.isTrue(
      TripStatus.lookupArray.every((value) => value instanceof TripStatus)
    );
  });

  context('status properties', function () {
    statuses.forEach((status) => {
      it(`${status.value} should have canEditTasksPerTrip = ${status.canEditTasksPerTrip}`, function () {
        assert.equal(
          new TripStatus(status).canEditTasksPerTrip,
          status.canEditTasksPerTrip
        );
      });
      it(`${status.value} should have isCancellable = ${status.isCancellable}`, function () {
        assert.equal(
          new TripStatus(status).isCancellable,
          status.isCancellable
        );
      });
    });
  });
});
