import { $sb } from '@survv/commons/test/utils/sandbox';
import { MonthlyBillingCycle } from '@survv/commons/core/models/MonthlyBillingCycle';
import { intervals } from '@survv/commons/test/utils/intervals';
import { kvStorage } from '@survv/pwa/shell/kv-storage-impl';
import { kvStorageMock } from '@survv/commons/test/utils/kvStorageMock';
import { nokubeGateway } from '../../../../scripts/projectConfig';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { storageKeys } from '@survv/commons/core/models/Storage';
import { wiremock } from '@survv/commons/test/utils/wiremock';

before('setup mocks', async function () {
  kvStorageMock.replace();
  intervals.replace();

  await wiremock.setup();
});

beforeEach('set clear state', async function () {
  notificationService.reset();
  localStorage.clear();
  $sb.restore();
  localStorage.setItem(storageKeys.baseUrl, `http://${nokubeGateway}`);
  MonthlyBillingCycle.configureBillingDay(1);

  intervals.clear();
  await kvStorage.clear();
  await wiremock.clearAddedStubs();
});

after('teardown wiremock and clear last added stubs', async function () {
  kvStorageMock.restore();
  intervals.restore();

  await wiremock.clearAddedStubs();
  await wiremock.teardown();
});
