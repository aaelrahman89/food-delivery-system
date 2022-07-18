import ActiveRequestsProcessor from '../../../../../src/core/deprecated/pilots/ActiveRequestsProcessor';
import Clock from '../../../../../src/core/deprecated/etc/Clock';
import Duration from '../../../../../src/core/deprecated/etc/Duration';
import PilotStatus from '../../../../../src/core/deprecated/pilots/PilotStatus';
import TripStatus from '../../../../../src/core/models/TripStatus';
import network from '../../../../../src/shell/services-deprecated/network/NetworkService';
import { $sb } from '@survv/commons/test/utils/sandbox';
import { AuthToken } from '@survv/commons/core/models/AuthToken';
import { assert } from 'chai';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import { createUrl, helpers } from '../../../../utils';
import { survvEndpoints as urls } from '../../../../../src/core/deprecated/survv.nc';

describe('Active Requests Processor', function () {
  it('should request with correct url and query params on execute', async function () {
    const p = new ActiveRequestsProcessor();

    const networkStub = $sb.stub(network, 'get');
    networkStub.resolves([
      { id: helpers.randId(), status: helpers.randString() },
    ]);

    $sb
      .stub(authTokenRepo, 'getParsedToken')
      .resolves(new AuthToken({ sub: '3456', roles: [], exp: 0, iss: '0' }));
    const expectedUrl = createUrl(
      urls.TRIPS_FETCH,
      {},
      {
        sortBy: 'creationDate',
        sortType: 'desc',
        criteria: JSON.stringify({
          vendorBranchId: 3456,
          status: ['OPENED', 'ASSIGNED', 'REQUESTED', 'PENDING'],
        }),
      }
    );

    await p.execute();

    assert.isTrue(networkStub.calledWithExactly(expectedUrl));
  });

  it('should set pilots images url and map trip status on successful processing', async function () {
    const p = new ActiveRequestsProcessor();
    $sb
      .stub(network, 'get')
      .resolves([
        { pilot: { id: 1 }, status: 'ASSIGNED' },
        { pilot: { id: 2 } },
        { status: 'REQUESTED' },
      ]);

    $sb
      .stub(authTokenRepo, 'getParsedToken')
      .resolves(new AuthToken({ sub: '1234', roles: [], exp: 0, iss: '0' }));
    const [pilotAndStatus, pilotOnly, statusOnly] = await p.process();

    assert.equal(
      pilotAndStatus.pilot.imageUrl,
      createUrl(
        urls.IMAGES_FETCH,
        {},
        {
          referenceType: 'pilotProfileImage',
          referenceId: 1,
        }
      )
    );
    assert.deepEqual(
      pilotAndStatus.status,
      new TripStatus(TripStatus.lookup.ASSIGNED)
    );

    assert.equal(
      pilotOnly.pilot.imageUrl,
      createUrl(
        urls.IMAGES_FETCH,
        {},
        {
          referenceType: 'pilotProfileImage',
          referenceId: 2,
        }
      )
    );

    assert.deepEqual(
      statusOnly.status,
      new TripStatus(TripStatus.lookup.REQUESTED)
    );
  });

  it('should map eta prop correctly on successful processing', async function () {
    const p = new ActiveRequestsProcessor();
    $sb.stub(network, 'get').resolves([{ eta: 300 }]);

    $sb
      .stub(authTokenRepo, 'getParsedToken')
      .resolves(new AuthToken({ sub: '1234', roles: [], exp: 0, iss: '0' }));
    const [response] = await p.process();

    assert.deepEqual(response.eta, new Duration({ value: 300 }));
  });

  it('should map pilot status prop correctly on successful processing', async function () {
    const p = new ActiveRequestsProcessor();
    $sb.stub(network, 'get').resolves([{ pilot: { status: 'ASSIGNED' } }]);

    $sb
      .stub(authTokenRepo, 'getParsedToken')
      .resolves(new AuthToken({ sub: '1234', roles: [], exp: 0, iss: '0' }));
    const [response] = await p.process();

    assert.deepEqual(
      response.pilot.status,
      new PilotStatus({ value: 'ASSIGNED' })
    );
  });

  context('lastStatusElapsedTime', function () {
    let now;
    let elapsedTimeMock;
    beforeEach('mock Clock.elapsedTime', function () {
      now = Clock.now();
      elapsedTimeMock = $sb
        .mock(Clock)
        .expects('elapsedTime')
        .once()
        .withExactArgs({
          date: '2019-08-04T00:00:00.000Z',
        })
        .returns(
          new Duration({
            value: Clock.subtract(now, '2019-08-04T00:00:00.000Z'),
            timeUnit: Duration.timeUnits.MILLISECONDS,
            compact: true,
          })
        );
    });

    afterEach('clear Clock.elapsedTime mock', function () {
      elapsedTimeMock.reset();
    });

    it('should have lastStatusElapsedTime counting from trip creation date if creation date > assignment date', async function () {
      const p = new ActiveRequestsProcessor();

      $sb
        .stub(authTokenRepo, 'getParsedToken')
        .resolves(new AuthToken({ sub: '1234', roles: [], exp: 0, iss: '0' }));
      $sb.stub(network, 'get').resolves([
        {
          creationDate: '2019-08-04T00:00:00.000Z',
          assignmentDate: '1970-01-01T00:00:00.000Z',
        },
      ]);

      const [result] = await p.process();

      elapsedTimeMock.verify();

      assert.deepEqual(
        result.lastStatusElapsedTime,
        new Duration({
          value: now - Clock.parse('2019-08-04T00:00:00.000Z').getTime(),
          timeUnit: Duration.timeUnits.MILLISECONDS,
          compact: true,
        })
      );
    });
    it('should have lastStatusElapsedTime counting from trip assignment date if assignment date > pending collection date', async function () {
      const p = new ActiveRequestsProcessor();

      $sb
        .stub(authTokenRepo, 'getParsedToken')
        .resolves(new AuthToken({ sub: '1234', roles: [], exp: 0, iss: '0' }));
      $sb.stub(network, 'get').resolves([
        {
          assignmentDate: '2019-08-04T00:00:00.000Z',
          pendingCollectionDate: '1970-01-01T00:00:00.000Z',
        },
      ]);

      const [result] = await p.process();

      elapsedTimeMock.verify();

      assert.deepEqual(
        result.lastStatusElapsedTime,
        new Duration({
          value: Clock.subtract(now, '2019-08-04T00:00:00.000Z'),
          timeUnit: Duration.timeUnits.MILLISECONDS,
          compact: true,
        })
      );
    });

    it('should have lastStatusElapsedTime counting from trip pending collection date otherwise', async function () {
      const p = new ActiveRequestsProcessor();

      $sb
        .stub(authTokenRepo, 'getParsedToken')
        .resolves(new AuthToken({ sub: '1234', roles: [], exp: 0, iss: '0' }));
      $sb.stub(network, 'get').resolves([
        {
          pendingCollectionDate: '2019-08-04T00:00:00.000Z',
        },
      ]);

      const [result] = await p.process();

      elapsedTimeMock.verify();

      assert.deepEqual(
        result.lastStatusElapsedTime,
        new Duration({
          value: Clock.subtract(now, '2019-08-04T00:00:00.000Z'),
          timeUnit: Duration.timeUnits.MILLISECONDS,
          compact: true,
        })
      );
    });
  });
});
