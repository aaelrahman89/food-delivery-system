import NetworkService from '../../../../../src/shell/services-deprecated/network/NetworkService';
import OrderJourney from '../../../../../src/core/deprecated/orders/OrderJourney';
import OrderJourneyProcessor from '../../../../../src/core/deprecated/orders/OrderJourneyProcessor';
import { $sb } from '@survv/commons/test/utils/sandbox';
import { assert } from 'chai';
import { createUrl } from '../../../../utils';
import { survvEndpoints } from '../../../../../src/core/deprecated/survv.nc';

describe('OrderJourneyProcessor Unit', function () {
  it('should call network service correctly', async function () {
    const p = new OrderJourneyProcessor({ orderId: 1234 });

    const networkServiceMock = $sb.mock(NetworkService);
    networkServiceMock
      .expects('get')
      .once()
      .withExactArgs(createUrl(survvEndpoints.ORDER_JOURNEY, { orderId: 1234 }))
      .resolves({});

    await p.execute();

    networkServiceMock.verify();
  });

  it('should return OrderJourney object on execute', async function () {
    const p = new OrderJourneyProcessor({ orderId: 1234 });

    $sb.stub(NetworkService, 'get').resolves({ id: 1234 });

    const response = await p.execute();

    assert.deepEqual(response, new OrderJourney({ journeyInfo: { id: 1234 } }));
  });
});
