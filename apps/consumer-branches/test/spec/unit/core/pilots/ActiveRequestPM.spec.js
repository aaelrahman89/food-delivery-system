import ActiveRequestsPM from '../../../../../src/core/deprecated/pilots/ActiveRequestsPM';
import ActiveRequestsProcessor from '../../../../../src/core/deprecated/pilots/ActiveRequestsProcessor';
import BasePM from '../../../../../src/core/deprecated/base/BasePM';
import { $sb } from '@survv/commons/test/utils/sandbox';
import { assert } from 'chai';
import { helpers } from '../../../../utils';

describe('Active Requests Presentation Model', function () {
  it('should be an instance of BasePM', function () {
    const pm = new ActiveRequestsPM();
    assert.instanceOf(pm, BasePM);
  });

  it('should have required methods and properties', function () {
    const pm = new ActiveRequestsPM();

    assert.exists(pm.requestsList);
  });

  it('should get active requests on init', async function () {
    const pm = new ActiveRequestsPM();

    const expectedRequestsList = [
      {
        id: helpers.randId(),
        status: helpers.randString(),
      },
    ];

    $sb
      .stub(ActiveRequestsProcessor.prototype, 'execute')
      .returns(expectedRequestsList);

    await pm.init();

    assert.deepEqual(pm.requestsList, expectedRequestsList);
  });
});
