import { $sb } from '@survv/commons/test/utils/sandbox';
import { Datetime } from '@survv/commons/core/utils/datetime';
import {
  ImageRefType,
  createImageUrl,
} from '@survv/commons/core/models/Images';
import { Pilot, PilotStatus } from '../../../../../../src/core/models/Pilot';
import { PilotsRepoImpl } from '../../../../../../src/shell/repositories/pilots/PilotsRepoImpl';
import { TripsResponse } from '@survv/api/definitions/trips';
import { assert } from 'chai';
import { networkService } from '@survv/commons/shell/backend/networkService';
import { tripsResponseStub } from '@survv/api/stubs/trips';

describe('PilotsRepoImpl', function () {
  function generateStubTrips(count = 1) {
    const tripsStub = tripsResponseStub();
    const stub: TripsResponse = {
      metadata: tripsStub.metadata,
      trips: [],
    };
    for (let i = 0; i < count; i += 1) {
      stub.trips.push({ ...tripsStub.trips[0] });
    }

    return stub;
  }

  describe('getActivePilotRequests', function () {
    context('constructing request pilot data', function () {
      it('if pilot info was provided, then the request should have the pilot data mapped correctly', async function () {
        const pilotsRepoImpl = new PilotsRepoImpl();

        const tripsStub = generateStubTrips();

        $sb.stub(networkService, 'request').resolves(tripsStub);
        const pilotRequests = await pilotsRepoImpl.getActivePilotRequests();

        assert.deepEqual(
          pilotRequests[0].pilot,
          new Pilot({
            id: tripsStub.trips[0].pilot.id,
            name: tripsStub.trips[0].pilot.fullName,
            mobileNo: tripsStub.trips[0].pilot.mobileNo,
            status: new PilotStatus(tripsStub.trips[0].pilot.status),
            profileImage: createImageUrl({
              refType: ImageRefType.PILOT_PROFILE_IMAGE,
              refId: tripsStub.trips[0].pilot.id,
            }),
          })
        );
      });
    });

    context('request last status update date', function () {
      it('if the pilot request has not been assigned to pilot, then the last status update date will be the request creation date', async function () {
        const pilotsRepoImpl = new PilotsRepoImpl();

        const tripsStub = generateStubTrips();
        tripsStub.trips[0].creationDate = new Datetime(
          Datetime.now() - 60 * 60 * 1000
        ).toUTCString(); // one hour ago
        tripsStub.trips[0].assignmentDate = new Datetime(0).toUTCString(); // didn't happen yet
        tripsStub.trips[0].pendingCollectionDate = new Datetime().toUTCString(); // didn't happen yet
        tripsStub.trips[0].pilot.status = 'NONE';

        $sb.stub(networkService, 'request').resolves(tripsStub);
        const pilotRequests = await pilotsRepoImpl.getActivePilotRequests();

        assert.deepEqual(
          pilotRequests[0].lastStatusUpdateDate,
          new Datetime(tripsStub.trips[0].creationDate)
        );
      });
      it('if the pilot request has been assigned a pilot & the pilot status is assigned/WAITING, then the last status update date will be the request assignment date', async function () {
        const pilotsRepoImpl = new PilotsRepoImpl();

        const tripsStub = generateStubTrips(2);

        tripsStub.trips[0].pilot.status = 'ASSIGNED';
        tripsStub.trips[0].creationDate = new Datetime(
          Datetime.now() - 60 * 60 * 1000
        ).toUTCString(); // one hour ago

        tripsStub.trips[0].assignmentDate = new Datetime(
          Datetime.now() - 30 * 60 * 1000
        ).toUTCString(); // 30 min ago
        tripsStub.trips[0].pendingCollectionDate = new Datetime().toUTCString(); // didn't happen yet

        tripsStub.trips[1].pilot.status = 'WAITING';
        tripsStub.trips[1].creationDate = new Datetime(
          Datetime.now() - 45 * 60 * 1000
        ).toUTCString(); // 45 min ago

        tripsStub.trips[1].assignmentDate = new Datetime(
          Datetime.now() - 15 * 60 * 1000
        ).toUTCString(); // 15 min ago
        tripsStub.trips[1].pendingCollectionDate = new Datetime().toUTCString(); // didn't happen yet

        $sb.stub(networkService, 'request').resolves(tripsStub);
        const pilotRequests = await pilotsRepoImpl.getActivePilotRequests();

        assert.deepEqual(
          pilotRequests[0].lastStatusUpdateDate,
          new Datetime(tripsStub.trips[0].assignmentDate)
        );

        assert.deepEqual(
          pilotRequests[1].lastStatusUpdateDate,
          new Datetime(tripsStub.trips[1].assignmentDate)
        );
      });
      it("once the pilot request's pilot starts collecting the orders, then the last status update date will always be the pending collection date", async function () {
        const pilotsRepoImpl = new PilotsRepoImpl();

        const tripsStub = generateStubTrips(2);

        tripsStub.trips[0].pilot.status = 'COLLECTING';
        tripsStub.trips[0].creationDate = new Datetime(
          Datetime.now() - 60 * 60 * 1000
        ).toUTCString(); // one hour ago

        tripsStub.trips[0].assignmentDate = new Datetime(
          Datetime.now() - 30 * 60 * 1000
        ).toUTCString(); // 30 min ago
        tripsStub.trips[0].pendingCollectionDate = new Datetime(
          Datetime.now() - 15 * 60 * 1000
        ).toUTCString(); // 15 min ago

        tripsStub.trips[1].pilot.status = 'LOADED';
        tripsStub.trips[1].creationDate = new Datetime(
          Datetime.now() - 30 * 60 * 1000
        ).toUTCString(); // 30 min ago

        tripsStub.trips[1].assignmentDate = new Datetime(
          Datetime.now() - 15 * 60 * 1000
        ).toUTCString(); // 15 min ago
        tripsStub.trips[1].pendingCollectionDate = new Datetime(
          Datetime.now() - 10 * 60 * 1000
        ).toUTCString(); // 10 min ago

        $sb.stub(networkService, 'request').resolves(tripsStub);
        const pilotRequests = await pilotsRepoImpl.getActivePilotRequests();

        assert.deepEqual(
          pilotRequests[0].lastStatusUpdateDate,
          new Datetime(tripsStub.trips[0].pendingCollectionDate)
        );
        assert.deepEqual(
          pilotRequests[1].lastStatusUpdateDate,
          new Datetime(tripsStub.trips[1].pendingCollectionDate)
        );
      });
    });

    context('showing request elapsed time', function () {
      it('should show elapsed time only if the pilot request status was pending, requested, assigned', async function () {
        const pilotsRepoImpl = new PilotsRepoImpl();

        const tripsStub = generateStubTrips(4);
        tripsStub.trips[0].status = 'PENDING';
        tripsStub.trips[1].status = 'REQUESTED';
        tripsStub.trips[2].status = 'ASSIGNED';
        tripsStub.trips[3].status = 'CANCELLED';

        $sb.stub(networkService, 'request').resolves(tripsStub);
        const pilotRequests = await pilotsRepoImpl.getActivePilotRequests();

        assert.isTrue(pilotRequests[0].shouldShowElapsedTime);
        assert.isTrue(pilotRequests[1].shouldShowElapsedTime);
        assert.isTrue(pilotRequests[2].shouldShowElapsedTime);
        assert.isFalse(pilotRequests[3].shouldShowElapsedTime);
      });
    });
  });
});
