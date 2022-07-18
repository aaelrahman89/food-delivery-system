import GetOrderDetailsProcessor, * as GetOrderDetailsProcessorModule from '../../../../../src/core/deprecated/orders/GetOrderDetailsProcessor';
import OrderDetailsPM from '../../../../../src/core/deprecated/orders/OrderDetailsPM';
import OrderJourneyProcessor, * as OrderJourneyProcessorModule from '../../../../../src/core/deprecated/orders/OrderJourneyProcessor';
import { $sb } from '@survv/commons/test/utils/sandbox';
import { assert } from 'chai';

describe('OrderDetailsUnitPM Unit', function () {
  it('should call GetOrderDetailsProcessor correctly and have the data on order property on init', async function () {
    const pm = new OrderDetailsPM({ orderId: 123 });

    $sb.stub(OrderJourneyProcessor.prototype, 'execute').resolves({});

    const getOrderDetailsProcessorModuleMock = $sb
      .mock(GetOrderDetailsProcessorModule)
      .expects('default')
      .once()
      .withExactArgs({ orderId: 123 })
      .returns({
        execute() {
          return { testing: 'object' };
        },
      });

    await pm.init();

    getOrderDetailsProcessorModuleMock.verify();

    assert.deepEqual(pm.order, { testing: 'object' });

    assert.isUndefined(pm.notification);
  });

  it('should display the error if hydrating order failed', async function () {
    const pm = new OrderDetailsPM({ orderId: 123 });

    $sb.stub(OrderJourneyProcessor.prototype, 'execute').resolves({});

    $sb
      .stub(GetOrderDetailsProcessor.prototype, 'execute')
      .rejects(new Error('testing error'));

    await pm.init();

    assert.deepEqual(pm.notification, {
      type: 'error',
      message: 'testing error',
    });
  });
  it('should call OrderJourneyProcessor and hydrate orderJourney with correct params on init', async function () {
    const pm = new OrderDetailsPM({ orderId: 1234 });

    $sb.stub(GetOrderDetailsProcessor.prototype, 'execute').resolves({});

    const processorMock = $sb.mock(OrderJourneyProcessorModule);
    processorMock
      .expects('default')
      .once()
      .withExactArgs({ orderId: 1234 })
      .returns({
        execute() {
          return {
            build() {
              return [{ status: 'REQUESTED' }, { status: 'ACCEPTED' }];
            },
          };
        },
      });

    await pm.init();

    processorMock.verify();

    assert.deepEqual(pm.orderJourney, [
      { status: 'REQUESTED' },
      { status: 'ACCEPTED' },
    ]);

    assert.isUndefined(pm.notification); // asserting that there were no thrown errors
  });

  it('should return empty array if orderJourney was undefined', function () {
    const pm = new OrderDetailsPM({});

    assert.deepEqual(pm.orderJourney, []);
  });

  it('should display error if OrderJourneyProcessor has failed', async function () {
    const pm = new OrderDetailsPM({ orderId: 1234 });

    $sb.stub(GetOrderDetailsProcessor.prototype, 'execute').resolves({});

    $sb
      .stub(OrderJourneyProcessor.prototype, 'execute')
      .rejects(new Error('an error'));

    await pm.init();

    assert.deepEqual(pm.notification, {
      type: 'error',
      message: 'an error',
    });
  });
});
