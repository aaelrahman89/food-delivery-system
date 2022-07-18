import { $sb } from '../utils/sandbox';
import { MonthlyBillingCycle } from '../../core/models/MonthlyBillingCycle';
import { intervals } from '../utils/intervals';
import { kvStorage } from '@survv/pwa/shell/kv-storage-impl';
import { kvStorageMock } from '../utils/kvStorageMock';
import { notificationService } from '../../shell/services/notificationService';

before('setup mocks', async function () {
  kvStorageMock.replace();
  intervals.replace();
});

beforeEach('set clear state', async function () {
  notificationService.reset();
  localStorage.clear();
  $sb.restore();
  MonthlyBillingCycle.configureBillingDay(1);

  intervals.clear();
  await kvStorage.clear();
});

after('teardown wiremock and clear last added stubs', async function () {
  kvStorageMock.restore();
  intervals.restore();
});
