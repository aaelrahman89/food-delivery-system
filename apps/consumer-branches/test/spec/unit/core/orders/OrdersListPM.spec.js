import BranchOrdersListProcessor, * as BranchOrdersListProcessorModule from '../../../../../src/core/deprecated/orders/BranchOrdersListProcessor';
import OrdersListPM from '../../../../../src/core/deprecated/orders/OrdersListPM';
import { $sb } from '@survv/commons/test/utils/sandbox';
import { BranchesRepoImpl } from '../../../../../src/shell/repositories/branches/BranchesRepoImpl';
import { FormSelectionOption } from '@survv/commons/core/forms/selection';
import { HoursRange } from '@survv/commons/core/models/HoursRange';
import { LocalError } from '@survv/commons/core/errors/errors';
import { OrderStatus } from '../../../../../src/core/models/Order';
import { Time } from '@survv/commons/core/models/Time';
import { assert } from 'chai';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import { branchDetailsResponseStub } from '@survv/api/stubs/branches';
import { createNotification } from '../../../../../src/core/notification';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('OrdersListPM Unit', function () {
  it('should initialize props correctly if no queries were passed on construction', function () {
    const pm = new OrdersListPM({ notificationService });

    assert.equal(pm.query.skip, 0);
    assert.equal(pm.query.limit, 25);
    assert.deepEqual(pm.query.sort, { creationDate: 'desc' });
    assert.deepEqual(pm.orders, []);
    assert.deepEqual(pm.totalCount, 0);
    assert.equal(pm.query.skip, 0);
    assert.deepEqual(
      pm.statusList,
      OrderStatus.lookup().map(
        (status) => new FormSelectionOption(status.value, status.toString())
      )
    );
    assert.deepEqual(pm.scheduledList, [
      new FormSelectionOption(
        'from=24:00:00,to=01:00:00',
        new HoursRange({
          from: new Time('24:00:00'),
          to: new Time('01:00:00'),
        })
      ),
      new FormSelectionOption(
        'from=01:00:00,to=02:00:00',
        new HoursRange({
          from: new Time('01:00:00'),
          to: new Time('02:00:00'),
        })
      ),
      new FormSelectionOption(
        'from=02:00:00,to=03:00:00',
        new HoursRange({
          from: new Time('02:00:00'),
          to: new Time('03:00:00'),
        })
      ),
      new FormSelectionOption(
        'from=03:00:00,to=04:00:00',
        new HoursRange({
          from: new Time('03:00:00'),
          to: new Time('04:00:00'),
        })
      ),
      new FormSelectionOption(
        'from=04:00:00,to=05:00:00',
        new HoursRange({
          from: new Time('04:00:00'),
          to: new Time('05:00:00'),
        })
      ),
      new FormSelectionOption(
        'from=05:00:00,to=06:00:00',
        new HoursRange({
          from: new Time('05:00:00'),
          to: new Time('06:00:00'),
        })
      ),
      new FormSelectionOption(
        'from=06:00:00,to=07:00:00',
        new HoursRange({
          from: new Time('06:00:00'),
          to: new Time('07:00:00'),
        })
      ),
      new FormSelectionOption(
        'from=07:00:00,to=08:00:00',
        new HoursRange({
          from: new Time('07:00:00'),
          to: new Time('08:00:00'),
        })
      ),
      new FormSelectionOption(
        'from=08:00:00,to=09:00:00',
        new HoursRange({
          from: new Time('08:00:00'),
          to: new Time('09:00:00'),
        })
      ),
      new FormSelectionOption(
        'from=09:00:00,to=10:00:00',
        new HoursRange({
          from: new Time('09:00:00'),
          to: new Time('10:00:00'),
        })
      ),
      new FormSelectionOption(
        'from=10:00:00,to=11:00:00',
        new HoursRange({
          from: new Time('10:00:00'),
          to: new Time('11:00:00'),
        })
      ),
      new FormSelectionOption(
        'from=11:00:00,to=12:00:00',
        new HoursRange({
          from: new Time('11:00:00'),
          to: new Time('12:00:00'),
        })
      ),
      new FormSelectionOption(
        'from=12:00:00,to=13:00:00',
        new HoursRange({
          from: new Time('12:00:00'),
          to: new Time('13:00:00'),
        })
      ),
      new FormSelectionOption(
        'from=13:00:00,to=14:00:00',
        new HoursRange({
          from: new Time('13:00:00'),
          to: new Time('14:00:00'),
        })
      ),
      new FormSelectionOption(
        'from=14:00:00,to=15:00:00',
        new HoursRange({
          from: new Time('14:00:00'),
          to: new Time('15:00:00'),
        })
      ),
      new FormSelectionOption(
        'from=15:00:00,to=16:00:00',
        new HoursRange({
          from: new Time('15:00:00'),
          to: new Time('16:00:00'),
        })
      ),
      new FormSelectionOption(
        'from=16:00:00,to=17:00:00',
        new HoursRange({
          from: new Time('16:00:00'),
          to: new Time('17:00:00'),
        })
      ),
      new FormSelectionOption(
        'from=17:00:00,to=18:00:00',
        new HoursRange({
          from: new Time('17:00:00'),
          to: new Time('18:00:00'),
        })
      ),
      new FormSelectionOption(
        'from=18:00:00,to=19:00:00',
        new HoursRange({
          from: new Time('18:00:00'),
          to: new Time('19:00:00'),
        })
      ),
      new FormSelectionOption(
        'from=19:00:00,to=20:00:00',
        new HoursRange({
          from: new Time('19:00:00'),
          to: new Time('20:00:00'),
        })
      ),
      new FormSelectionOption(
        'from=20:00:00,to=21:00:00',
        new HoursRange({
          from: new Time('20:00:00'),
          to: new Time('21:00:00'),
        })
      ),
      new FormSelectionOption(
        'from=21:00:00,to=22:00:00',
        new HoursRange({
          from: new Time('21:00:00'),
          to: new Time('22:00:00'),
        })
      ),
      new FormSelectionOption(
        'from=22:00:00,to=23:00:00',
        new HoursRange({
          from: new Time('22:00:00'),
          to: new Time('23:00:00'),
        })
      ),
      new FormSelectionOption(
        'from=23:00:00,to=24:00:00',
        new HoursRange({
          from: new Time('23:00:00'),
          to: new Time('24:00:00'),
        })
      ),
    ]);
  });

  it('should initialize props correctly if there was passed query on construction', function () {
    const pm = new OrdersListPM({
      query: { sort: { orderId: 'asc' }, skip: 10, limit: 10 },
      notificationService,
    });
    assert.equal(pm.query.skip, 10);
    assert.equal(pm.query.limit, 10);
    assert.deepEqual(pm.query.sort, { orderId: 'asc' });
    assert.deepEqual(pm.orders, []);
    assert.deepEqual(pm.totalCount, 0);
  });

  it('should hydrate orders and totalCount on init', async function () {
    const pm = new OrdersListPM({ notificationService });

    const branchOrdersListProcessorModule = $sb.mock(
      BranchOrdersListProcessorModule
    );

    branchOrdersListProcessorModule
      .expects('default')
      .once()
      .withExactArgs({
        query: {
          filter: {},
          sort: { creationDate: 'desc' },
          skip: 0,
          limit: 25,
        },
      })
      .returns({
        execute() {
          return {
            totalCount: 20,
            orders: [{ orderId: 111 }, { orderId: 222 }],
          };
        },
      });

    $sb.stub(authTokenRepo, 'getUserId').resolves(1234);
    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/branches/:branchId',
        params: {
          branchId: 1234,
        },
      })
      .response(branchDetailsResponseStub());

    await pm.init();

    branchOrdersListProcessorModule.verify();

    assert.deepEqual(pm.orders, [{ orderId: 111 }, { orderId: 222 }]);
    assert.deepEqual(pm.totalCount, 20);
  });

  it('should display error if init failed', async function () {
    const pm = new OrdersListPM({ notificationService });

    const error = new LocalError({
      message: 'any message',
      code: 'error code',
    });

    $sb.stub(BranchOrdersListProcessor.prototype, 'execute').rejects(error);

    $sb.stub(BranchesRepoImpl.prototype, 'getBranchDetails').rejects(error);

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });

  it('should rehydrate on refresh', async function () {
    const pm = new OrdersListPM({ notificationService });

    $sb.stub(BranchOrdersListProcessor.prototype, 'execute').resolves({
      totalCount: 100,
      orders: [{ id: 1 }, { id: 2 }],
    });
    $sb.stub(BranchesRepoImpl.prototype, 'getBranchDetails').resolves();

    await pm.refresh();

    assert.equal(pm.totalCount, 100);
    assert.deepEqual(pm.orders, [{ id: 1 }, { id: 2 }]);
  });
});
