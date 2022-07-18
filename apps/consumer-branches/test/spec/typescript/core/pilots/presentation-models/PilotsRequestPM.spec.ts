import { $sb } from '@survv/commons/test/utils/sandbox';
import { BranchesRepoImpl } from '../../../../../../src/shell/repositories/branches/BranchesRepoImpl';
import { IntercomRepoImpl } from '../../../../../../src/shell/repositories/intercom/IntercomRepoImpl';
import { OrdersRepoImpl } from '../../../../../../src/shell/repositories/orders/OrdersRepoImpl';
import { PilotsRepoImpl } from '../../../../../../src/shell/repositories/pilots/PilotsRepoImpl';
import { PilotsRequestPM } from '../../../../../../src/core/presentation-models/pilots/PilotsRequestPM';
import { PushNotificationRepoImpl } from '../../../../../../src/shell/repositories/push-notification/PushNotificationRepoImpl';
import { RootPM } from '../../../../../../src/core/presentation-models/root/RootPM';
import { ZonesRepoImpl } from '../../../../../../src/shell/repositories/zones/ZonesRepoImpl';
import { assert } from 'chai';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import { branchAppMenu } from '../../../../../../src/menu';
import { branchServedZonesResponseStub } from '@survv/api/stubs/branches';
import { mapBranchServedZonesResponseToBranchServedZones } from '../../../../../../src/shell/repositories/zones/mappers/responses';
import { mapTripsResponseToActivePilotRequests } from '../../../../../../src/shell/repositories/pilots/mappers/responses';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { pushNotificationManager } from '@survv/pwa/shell/push-notification-manager-impl';
import { serviceWorkerManager } from '@survv/pwa/shell/service-worker-manager-impl';
import { tripsResponseStub } from '@survv/api/stubs/trips';
import { userPreferenceRepo } from '@survv/commons/shell/repositories/UserPreferenceRepoImpl';
import { vendorRepoImpl } from '../../../../../../src/shell/repositories/vendors/VendorRepoImpl';

describe('PilotsRequestPM', function () {
  const branchId = 1234;
  const vendorId = 51912;
  function setupRootPM() {
    const pushNotificationRepo = new PushNotificationRepoImpl();
    const ordersRepo = new OrdersRepoImpl();
    const pilotsRepo = new PilotsRepoImpl();
    const zonesRepo = new ZonesRepoImpl();
    const intercomRepo = new IntercomRepoImpl();
    return new RootPM({
      ordersRepo,
      serviceWorkerManager,
      notificationService,
      pushNotificationManager,
      vendorRepo: vendorRepoImpl,
      branchRepo: new BranchesRepoImpl(),
      userPreferenceRepo,
      authTokenRepo,
      pushNotificationRepo,
      pilotsRepo,
      zonesRepo,
      allowNewPilotRequests: false,
      branchAppMenu,
      intercomRepo,
    });
  }
  beforeEach(function () {
    $sb.stub(authTokenRepo, 'getUserId').resolves(branchId);
    $sb.stub(vendorRepoImpl, 'getVendorId').resolves(vendorId);
  });

  it('should expose rootPM activeRequests', async function () {
    const rootPM = setupRootPM();
    const pm = new PilotsRequestPM({
      rootPM,
    });

    const activeTripsStub = mapTripsResponseToActivePilotRequests(
      tripsResponseStub()
    );

    $sb.stub(rootPM, 'activePilotRequests').get(() => activeTripsStub);

    assert.deepEqual(pm.activePilotRequests, activeTripsStub);
  });
  it('should expose rootPM servedZones', async function () {
    const rootPM = setupRootPM();
    const pm = new PilotsRequestPM({
      rootPM,
    });

    const servedZones = mapBranchServedZonesResponseToBranchServedZones(
      branchServedZonesResponseStub()
    );

    $sb.stub(rootPM, 'servedZones').get(() => servedZones);

    assert.deepEqual(pm.servedZones, servedZones);
  });
});
