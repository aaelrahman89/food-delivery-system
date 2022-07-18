import OrderStatus from '../../../../src/core/models/OrderStatus';
import { assert } from 'chai';

describe('OrderStatus Unit', function () {
  it('OrderStatus lookup should be valid', function () {
    assert.deepEqual(OrderStatus.lookup, {
      UNKNOWN: {
        color: '#000000',
        dark: true,
        value: 'UNKNOWN',
      },
      REQUESTED: {
        color: '#455A64',
        dark: true,
        value: 'REQUESTED',
      },
      CONFIRMED: {
        color: '#039BE5',
        dark: true,
        value: 'CONFIRMED',
      },
      SCHEDULED: {
        color: '#2f6d7b',
        dark: true,
        value: 'SCHEDULED',
      },
      REJECTED: {
        color: '#AD1457',
        dark: true,
        value: 'REJECTED',
      },
      CANCELLED: {
        color: '#C62828',
        dark: true,
        value: 'CANCELLED',
      },
      ASSIGNED: {
        color: '#ad6c00',
        dark: true,
        value: 'ASSIGNED',
      },
      PILOT_REQUESTED: {
        color: '#F9A825',
        dark: true,
        value: 'PILOT_REQUESTED',
      },
      COLLECTED: {
        color: '#283593',
        dark: true,
        value: 'COLLECTED',
      },
      DELIVERED: {
        color: '#7CB342',
        dark: true,
        value: 'DELIVERED',
      },
    });
  });

  it('should have an array lookup', function () {
    assert.deepEqual(OrderStatus.lookupArray, [
      new OrderStatus({ value: 'UNKNOWN' }),
      new OrderStatus({ value: 'REQUESTED' }),
      new OrderStatus({ value: 'CONFIRMED' }),
      new OrderStatus({ value: 'SCHEDULED' }),
      new OrderStatus({ value: 'REJECTED' }),
      new OrderStatus({ value: 'CANCELLED' }),
      new OrderStatus({ value: 'PILOT_REQUESTED' }),
      new OrderStatus({ value: 'ASSIGNED' }),
      new OrderStatus({ value: 'COLLECTED' }),
      new OrderStatus({ value: 'DELIVERED' }),
    ]);
  });

  it('should return status localization if the given status was valid', function () {
    const os = new OrderStatus({ value: 'REQUESTED' });

    assert.equal(os.string, 'ORDER_STATUS_REQUESTED');
  });

  it('should return the given status as is, if was not found in the lookup', function () {
    const os = new OrderStatus({ value: 'INVALID_STATUS' });

    assert.equal(os.string, 'INVALID_STATUS');
  });

  it('should have value of NONE by default if value was given', function () {
    const os = new OrderStatus({});

    assert.deepEqual(os, new OrderStatus({ value: 'NONE' }));
  });
});
