import Clock from '../../../../../src/core/deprecated/etc/Clock';
import Duration from '../../../../../src/core/deprecated/etc/Duration';
import OrderJourney from '../../../../../src/core/deprecated/orders/OrderJourney';
import OrderStatus from '../../../../../src/core/deprecated/orders/OrderStatus';
import { assert } from 'chai';

describe('OrderJourney Unit', function () {
  it('should return order journey correctly in case [REQUESTED] order', function () {
    const orderJourney = new OrderJourney({
      journeyInfo: {
        orderId: 2165529378315486700,
        status: 'REQUESTED',
        creationDate: '2018-09-05T19:04:53.178Z',
        acceptanceDate: '1970-01-01T00:00:00.0Z',
        tillAcceptanceDuration: 0,
        rejectionDate: '1970-01-01T00:00:00.0Z',
        tillRejectionDuration: 0,
        pilotRequestDate: '1970-01-01T00:00:00.0Z',
        tillRequestingPilotDuration: 0,
        collectionDate: '1970-01-01T00:00:00.0Z',
        tillCollectionDuration: 0,
        deliveryDate: '1970-01-01T00:00:00.0Z',
        tillDeliveryDuration: 0,
        cancellationDate: '1970-01-01T00:00:00.0Z',
      },
    });

    assert.deepEqual(orderJourney.build(), [
      {
        formattedDate: Clock.format('2018-09-05T19:04:53.178Z'),
        date: '2018-09-05T19:04:53.178Z',
        duration: undefined,
        status: new OrderStatus({ value: 'REQUESTED' }),
        occurred: true,
      },
      {
        formattedDate: Clock.format('1970-01-01T00:00:00.0Z'),
        date: '1970-01-01T00:00:00.0Z',
        duration: undefined,
        status: new OrderStatus({ value: 'CONFIRMED' }),
        occurred: false,
      },
      {
        formattedDate: Clock.format('1970-01-01T00:00:00.0Z'),
        date: '1970-01-01T00:00:00.0Z',
        duration: undefined,
        status: new OrderStatus({ value: 'PILOT_REQUESTED' }),
        occurred: false,
      },
      {
        formattedDate: Clock.format('1970-01-01T00:00:00.0Z'),
        date: '1970-01-01T00:00:00.0Z',
        duration: undefined,
        status: new OrderStatus({ value: 'COLLECTED' }),
        occurred: false,
      },
      {
        formattedDate: Clock.format('1970-01-01T00:00:00.0Z'),
        date: '1970-01-01T00:00:00.0Z',
        status: new OrderStatus({ value: 'DELIVERED' }),
        duration: undefined,
        occurred: false,
      },
    ]);
  });

  it('should return order journey correctly in case [CONFIRMED] order', function () {
    const orderJourney = new OrderJourney({
      journeyInfo: {
        orderId: 2165529378315486700,
        status: 'CONFIRMED',
        creationDate: '2018-09-05T19:04:53.178Z',
        acceptanceDate: '2018-09-05T19:04:53.178Z',
        tillAcceptanceDuration: 300,
        rejectionDate: '1970-01-01T00:00:00.0Z',
        tillRejectionDuration: 0,
        pilotRequestDate: '1970-01-01T00:00:00.0Z',
        tillRequestingPilotDuration: 0,
        collectionDate: '1970-01-01T00:00:00.0Z',
        tillCollectionDuration: 0,
        deliveryDate: '1970-01-01T00:00:00.0Z',
        tillDeliveryDuration: 0,
        cancellationDate: '1970-01-01T00:00:00.0Z',
      },
    });

    assert.deepEqual(orderJourney.build(), [
      {
        formattedDate: Clock.format('2018-09-05T19:04:53.178Z'),
        date: '2018-09-05T19:04:53.178Z',
        status: new OrderStatus({ value: 'REQUESTED' }),
        duration: new Duration({
          value: 300,
        }),
        occurred: true,
      },
      {
        formattedDate: Clock.format('2018-09-05T19:04:53.178Z'),
        date: '2018-09-05T19:04:53.178Z',
        duration: undefined,
        status: new OrderStatus({ value: 'CONFIRMED' }),
        occurred: true,
      },
      {
        formattedDate: Clock.format('1970-01-01T00:00:00.0Z'),
        date: '1970-01-01T00:00:00.0Z',
        duration: undefined,
        status: new OrderStatus({ value: 'PILOT_REQUESTED' }),
        occurred: false,
      },
      {
        formattedDate: Clock.format('1970-01-01T00:00:00.0Z'),
        date: '1970-01-01T00:00:00.0Z',
        duration: undefined,
        status: new OrderStatus({ value: 'COLLECTED' }),
        occurred: false,
      },
      {
        formattedDate: Clock.format('1970-01-01T00:00:00.0Z'),
        date: '1970-01-01T00:00:00.0Z',
        status: new OrderStatus({ value: 'DELIVERED' }),
        duration: undefined,
        occurred: false,
      },
    ]);
  });

  it('should return order journey correctly in case [REJECTED] order', function () {
    const orderJourney = new OrderJourney({
      journeyInfo: {
        orderId: 2165529378315486700,
        status: 'REJECTED',
        creationDate: '2018-09-05T19:04:53.178Z',
        acceptanceDate: '1970-01-01T00:00:00.0Z',
        tillAcceptanceDuration: 0,
        rejectionDate: '2018-09-05T19:04:55.178Z',
        tillRejectionDuration: 2000,
        pilotRequestDate: '1970-01-01T00:00:00.0Z',
        tillRequestingPilotDuration: 0,
        collectionDate: '1970-01-01T00:00:00.0Z',
        tillCollectionDuration: 0,
        deliveryDate: '1970-01-01T00:00:00.0Z',
        tillDeliveryDuration: 0,
        cancellationDate: '1970-01-01T00:00:00.0Z',
      },
    });

    assert.deepEqual(orderJourney.build(), [
      {
        formattedDate: Clock.format('2018-09-05T19:04:53.178Z'),
        date: '2018-09-05T19:04:53.178Z',
        duration: new Duration({
          value: 2000,
          timeUnit: Duration.timeUnits.MILLISECONDS,
        }),
        status: new OrderStatus({ value: 'REQUESTED' }),
        occurred: true,
      },
      {
        formattedDate: Clock.format('2018-09-05T19:04:55.178Z'),
        date: '2018-09-05T19:04:55.178Z',
        status: new OrderStatus({ value: 'REJECTED' }),
        duration: undefined,
        occurred: true,
      },
      {
        formattedDate: Clock.format('1970-01-01T00:00:00.0Z'),
        date: '1970-01-01T00:00:00.0Z',
        duration: undefined,
        status: new OrderStatus({ value: 'CONFIRMED' }),
        occurred: false,
      },
      {
        formattedDate: Clock.format('1970-01-01T00:00:00.0Z'),
        date: '1970-01-01T00:00:00.0Z',
        duration: undefined,
        status: new OrderStatus({ value: 'PILOT_REQUESTED' }),
        occurred: false,
      },
      {
        formattedDate: Clock.format('1970-01-01T00:00:00.0Z'),
        date: '1970-01-01T00:00:00.0Z',
        duration: undefined,
        status: new OrderStatus({ value: 'COLLECTED' }),
        occurred: false,
      },
      {
        formattedDate: Clock.format('1970-01-01T00:00:00.0Z'),
        date: '1970-01-01T00:00:00.0Z',
        status: new OrderStatus({ value: 'DELIVERED' }),
        duration: undefined,
        occurred: false,
      },
    ]);
  });

  it('should return order journey correctly in case [PILOT_REQUESTED] order', function () {
    const orderJourney = new OrderJourney({
      journeyInfo: {
        orderId: 2165529378315486700,
        status: 'PILOT_REQUESTED',
        creationDate: '2018-09-05T19:04:53.178Z',
        acceptanceDate: '2018-09-05T19:04:53.178Z',
        tillAcceptanceDuration: 100,
        rejectionDate: '1970-01-01T00:00:00.0Z',
        tillRejectionDuration: 0,
        pilotRequestDate: '2018-09-05T19:04:53.178Z',
        tillRequestingPilotDuration: 300,
        collectionDate: '1970-01-01T00:00:00.0Z',
        tillCollectionDuration: 0,
        deliveryDate: '1970-01-01T00:00:00.0Z',
        tillDeliveryDuration: 0,
        cancellationDate: '1970-01-01T00:00:00.0Z',
      },
    });

    assert.deepEqual(orderJourney.build(), [
      {
        formattedDate: Clock.format('2018-09-05T19:04:53.178Z'),
        date: '2018-09-05T19:04:53.178Z',
        duration: new Duration({
          value: 100,
        }),
        status: new OrderStatus({ value: 'REQUESTED' }),
        occurred: true,
      },
      {
        formattedDate: Clock.format('2018-09-05T19:04:53.178Z'),
        date: '2018-09-05T19:04:53.178Z',
        duration: new Duration({
          value: 300,
        }),
        status: new OrderStatus({ value: 'CONFIRMED' }),
        occurred: true,
      },
      {
        formattedDate: Clock.format('2018-09-05T19:04:53.178Z'),
        date: '2018-09-05T19:04:53.178Z',
        duration: undefined,
        status: new OrderStatus({ value: 'PILOT_REQUESTED' }),
        occurred: true,
      },
      {
        formattedDate: Clock.format('1970-01-01T00:00:00.0Z'),
        date: '1970-01-01T00:00:00.0Z',
        duration: undefined,
        status: new OrderStatus({ value: 'COLLECTED' }),
        occurred: false,
      },
      {
        formattedDate: Clock.format('1970-01-01T00:00:00.0Z'),
        date: '1970-01-01T00:00:00.0Z',
        status: new OrderStatus({ value: 'DELIVERED' }),
        duration: undefined,
        occurred: false,
      },
    ]);
  });

  it('should return order journey correctly in case [COLLECTED] order', function () {
    const orderJourney = new OrderJourney({
      journeyInfo: {
        orderId: 2165529378315486700,
        status: 'COLLECTED',
        creationDate: '2018-09-05T19:04:53.178Z',
        acceptanceDate: '2018-09-05T19:04:53.178Z',
        tillAcceptanceDuration: 100,
        rejectionDate: '1970-01-01T00:00:00.0Z',
        tillRejectionDuration: 0,
        pilotRequestDate: '2018-09-05T19:04:53.178Z',
        tillRequestingPilotDuration: 300,
        collectionDate: '2018-09-05T19:04:53.178Z',
        tillCollectionDuration: 600,
        deliveryDate: '1970-01-01T00:00:00.0Z',
        tillDeliveryDuration: 0,
        cancellationDate: '1970-01-01T00:00:00.0Z',
      },
    });

    assert.deepEqual(orderJourney.build(), [
      {
        formattedDate: Clock.format('2018-09-05T19:04:53.178Z'),
        date: '2018-09-05T19:04:53.178Z',
        status: new OrderStatus({ value: 'REQUESTED' }),
        duration: new Duration({
          value: 100,
        }),
        occurred: true,
      },
      {
        formattedDate: Clock.format('2018-09-05T19:04:53.178Z'),
        date: '2018-09-05T19:04:53.178Z',
        duration: new Duration({
          value: 300,
        }),
        status: new OrderStatus({ value: 'CONFIRMED' }),
        occurred: true,
      },
      {
        formattedDate: Clock.format('2018-09-05T19:04:53.178Z'),
        date: '2018-09-05T19:04:53.178Z',
        duration: new Duration({
          value: 600,
        }),
        status: new OrderStatus({ value: 'PILOT_REQUESTED' }),
        occurred: true,
      },
      {
        formattedDate: Clock.format('2018-09-05T19:04:53.178Z'),
        date: '2018-09-05T19:04:53.178Z',
        duration: undefined,
        status: new OrderStatus({ value: 'COLLECTED' }),
        occurred: true,
      },
      {
        formattedDate: Clock.format('1970-01-01T00:00:00.0Z'),
        date: '1970-01-01T00:00:00.0Z',
        status: new OrderStatus({ value: 'DELIVERED' }),
        duration: undefined,
        occurred: false,
      },
    ]);
  });

  it('should return order journey correctly in case [DELIVERED] order', function () {
    const orderJourney = new OrderJourney({
      journeyInfo: {
        orderId: 2165529378315486700,
        status: 'DELIVERED',
        creationDate: '2018-09-05T19:04:53.178Z',
        acceptanceDate: '2018-09-05T19:04:53.178Z',
        tillAcceptanceDuration: 100,
        rejectionDate: '1970-01-01T00:00:00.0Z',
        tillRejectionDuration: 0,
        pilotRequestDate: '2018-09-05T19:04:53.178Z',
        tillRequestingPilotDuration: 200,
        collectionDate: '2018-09-05T19:04:53.178Z',
        tillCollectionDuration: 300,
        deliveryDate: '2018-09-05T19:04:53.178Z',
        tillDeliveryDuration: 400,
        cancellationDate: '1970-01-01T00:00:00.0Z',
      },
    });

    assert.deepEqual(orderJourney.build(), [
      {
        formattedDate: Clock.format('2018-09-05T19:04:53.178Z'),
        date: '2018-09-05T19:04:53.178Z',
        status: new OrderStatus({ value: 'REQUESTED' }),
        duration: new Duration({
          value: 100,
        }),
        occurred: true,
      },
      {
        formattedDate: Clock.format('2018-09-05T19:04:53.178Z'),
        date: '2018-09-05T19:04:53.178Z',
        duration: new Duration({
          value: 200,
        }),
        status: new OrderStatus({ value: 'CONFIRMED' }),
        occurred: true,
      },
      {
        formattedDate: Clock.format('2018-09-05T19:04:53.178Z'),
        date: '2018-09-05T19:04:53.178Z',
        duration: new Duration({
          value: 300,
        }),
        status: new OrderStatus({ value: 'PILOT_REQUESTED' }),
        occurred: true,
      },
      {
        formattedDate: Clock.format('2018-09-05T19:04:53.178Z'),
        date: '2018-09-05T19:04:53.178Z',
        duration: new Duration({
          value: 400,
        }),
        status: new OrderStatus({ value: 'COLLECTED' }),
        occurred: true,
      },
      {
        formattedDate: Clock.format('2018-09-05T19:04:53.178Z'),
        date: '2018-09-05T19:04:53.178Z',
        status: new OrderStatus({ value: 'DELIVERED' }),
        duration: undefined,
        occurred: true,
      },
    ]);
  });

  it('should return order journey correctly in case [CONFIRMED -> CANCELLED] order ', function () {
    const orderJourney = new OrderJourney({
      journeyInfo: {
        orderId: 2165529378315486700,
        status: 'CANCELLED',
        creationDate: '2018-09-05T19:04:53.178Z',
        acceptanceDate: '2018-09-05T19:04:53.178Z',
        tillAcceptanceDuration: 100,
        rejectionDate: '1970-01-01T00:00:00.0Z',
        tillRejectionDuration: 0,
        pilotRequestDate: '1970-01-01T00:00:00.0Z',
        tillRequestingPilotDuration: 0,
        collectionDate: '1970-01-01T00:00:00.0Z',
        tillCollectionDuration: 0,
        deliveryDate: '1970-01-01T00:00:00.0Z',
        tillDeliveryDuration: 0,
        cancellationDate: '2018-09-05T19:04:55.178Z',
      },
    });

    assert.deepEqual(orderJourney.build(), [
      {
        formattedDate: Clock.format('2018-09-05T19:04:53.178Z'),
        date: '2018-09-05T19:04:53.178Z',
        status: new OrderStatus({ value: 'REQUESTED' }),
        duration: new Duration({
          value: 100,
        }),
        occurred: true,
      },
      {
        formattedDate: Clock.format('2018-09-05T19:04:53.178Z'),
        date: '2018-09-05T19:04:53.178Z',
        duration: new Duration({
          value: Clock.subtract(
            '2018-09-05T19:04:55.178Z',
            '2018-09-05T19:04:53.178Z'
          ),
          timeUnit: Duration.timeUnits.MILLISECONDS,
        }),
        status: new OrderStatus({ value: 'CONFIRMED' }),
        occurred: true,
      },
      {
        formattedDate: Clock.format('2018-09-05T19:04:55.178Z'),
        date: '2018-09-05T19:04:55.178Z',
        status: new OrderStatus({ value: 'CANCELLED' }),
        duration: undefined,
        occurred: true,
      },
      {
        formattedDate: Clock.format('1970-01-01T00:00:00.0Z'),
        date: '1970-01-01T00:00:00.0Z',
        duration: undefined,
        status: new OrderStatus({ value: 'PILOT_REQUESTED' }),
        occurred: false,
      },
      {
        formattedDate: Clock.format('1970-01-01T00:00:00.0Z'),
        date: '1970-01-01T00:00:00.0Z',
        duration: undefined,
        status: new OrderStatus({ value: 'COLLECTED' }),
        occurred: false,
      },
      {
        formattedDate: Clock.format('1970-01-01T00:00:00.0Z'),
        date: '1970-01-01T00:00:00.0Z',
        status: new OrderStatus({ value: 'DELIVERED' }),
        duration: undefined,
        occurred: false,
      },
    ]);
  });

  it('should return order journey correctly in case [PILOT_REQUESTED -> CANCELLED] order', function () {
    const orderJourney = new OrderJourney({
      journeyInfo: {
        orderId: 2165529378315486700,
        status: 'CANCELLED',
        creationDate: '2018-09-05T19:04:53.178Z',
        acceptanceDate: '2018-09-05T19:04:53.178Z',
        tillAcceptanceDuration: 100,
        rejectionDate: '1970-01-01T00:00:00.0Z',
        tillRejectionDuration: 0,
        pilotRequestDate: '2018-09-05T19:04:53.178Z',
        tillRequestingPilotDuration: 200,
        collectionDate: '1970-01-01T00:00:00.0Z',
        tillCollectionDuration: 0,
        deliveryDate: '1970-01-01T00:00:00.0Z',
        tillDeliveryDuration: 0,
        cancellationDate: '2018-09-05T19:04:55.178Z',
      },
    });

    assert.deepEqual(orderJourney.build(), [
      {
        formattedDate: Clock.format('2018-09-05T19:04:53.178Z'),
        date: '2018-09-05T19:04:53.178Z',
        status: new OrderStatus({ value: 'REQUESTED' }),
        duration: new Duration({
          value: 100,
        }),
        occurred: true,
      },
      {
        formattedDate: Clock.format('2018-09-05T19:04:53.178Z'),
        date: '2018-09-05T19:04:53.178Z',
        duration: new Duration({
          value: 200,
        }),
        status: new OrderStatus({ value: 'CONFIRMED' }),
        occurred: true,
      },
      {
        formattedDate: Clock.format('2018-09-05T19:04:53.178Z'),
        date: '2018-09-05T19:04:53.178Z',
        duration: new Duration({
          value: Clock.subtract(
            '2018-09-05T19:04:55.178Z',
            '2018-09-05T19:04:53.178Z'
          ),
          timeUnit: Duration.timeUnits.MILLISECONDS,
        }),
        status: new OrderStatus({ value: 'PILOT_REQUESTED' }),
        occurred: true,
      },
      {
        formattedDate: Clock.format('2018-09-05T19:04:55.178Z'),
        date: '2018-09-05T19:04:55.178Z',
        status: new OrderStatus({ value: 'CANCELLED' }),
        duration: undefined,
        occurred: true,
      },
      {
        formattedDate: Clock.format('1970-01-01T00:00:00.0Z'),
        date: '1970-01-01T00:00:00.0Z',
        duration: undefined,
        status: new OrderStatus({ value: 'COLLECTED' }),
        occurred: false,
      },
      {
        formattedDate: Clock.format('1970-01-01T00:00:00.0Z'),
        date: '1970-01-01T00:00:00.0Z',
        status: new OrderStatus({ value: 'DELIVERED' }),
        duration: undefined,
        occurred: false,
      },
    ]);
  });

  it('should return order journey correctly in case [COLLECTED -> CANCELLED] order', function () {
    const orderJourney = new OrderJourney({
      journeyInfo: {
        orderId: 2165529378315486700,
        status: 'CANCELLED',
        creationDate: '2018-09-05T19:04:53.178Z',
        acceptanceDate: '2018-09-05T19:04:53.178Z',
        tillAcceptanceDuration: 100,
        rejectionDate: '1970-01-01T00:00:00.0Z',
        tillRejectionDuration: 0,
        pilotRequestDate: '2018-09-05T19:04:53.178Z',
        tillRequestingPilotDuration: 300,
        collectionDate: '2018-09-05T19:04:53.178Z',
        tillCollectionDuration: 400,
        deliveryDate: '1970-01-01T00:00:00.0Z',
        tillDeliveryDuration: 0,
        cancellationDate: '2018-09-05T19:04:55.178Z',
      },
    });

    assert.deepEqual(orderJourney.build(), [
      {
        formattedDate: Clock.format('2018-09-05T19:04:53.178Z'),
        date: '2018-09-05T19:04:53.178Z',
        duration: new Duration({
          value: 100,
        }),
        status: new OrderStatus({ value: 'REQUESTED' }),
        occurred: true,
      },
      {
        formattedDate: Clock.format('2018-09-05T19:04:53.178Z'),
        date: '2018-09-05T19:04:53.178Z',
        duration: new Duration({
          value: 300,
        }),
        status: new OrderStatus({ value: 'CONFIRMED' }),
        occurred: true,
      },
      {
        formattedDate: Clock.format('2018-09-05T19:04:53.178Z'),
        date: '2018-09-05T19:04:53.178Z',
        duration: new Duration({
          value: 400,
        }),
        status: new OrderStatus({ value: 'PILOT_REQUESTED' }),
        occurred: true,
      },
      {
        formattedDate: Clock.format('2018-09-05T19:04:53.178Z'),
        date: '2018-09-05T19:04:53.178Z',
        duration: new Duration({
          value: Clock.subtract(
            '2018-09-05T19:04:55.178Z',
            '2018-09-05T19:04:53.178Z'
          ),
          timeUnit: Duration.timeUnits.MILLISECONDS,
        }),
        status: new OrderStatus({ value: 'COLLECTED' }),
        occurred: true,
      },
      {
        formattedDate: Clock.format('2018-09-05T19:04:55.178Z'),
        date: '2018-09-05T19:04:55.178Z',
        status: new OrderStatus({ value: 'CANCELLED' }),
        duration: undefined,
        occurred: true,
      },
      {
        formattedDate: Clock.format('1970-01-01T00:00:00.0Z'),
        date: '1970-01-01T00:00:00.0Z',
        status: new OrderStatus({ value: 'DELIVERED' }),
        duration: undefined,
        occurred: false,
      },
    ]);
  });
});
