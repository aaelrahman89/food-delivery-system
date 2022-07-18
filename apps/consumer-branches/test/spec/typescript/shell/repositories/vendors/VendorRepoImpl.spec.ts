import { assert } from 'chai';
import { vendorRepoImpl } from '../../../../../../src/shell/repositories/vendors/VendorRepoImpl';

describe('VendorRepoImpl', function () {
  it('should persist the vendor id', async function () {
    await vendorRepoImpl.saveVendorId(1234);
    assert.equal(await vendorRepoImpl.getVendorId(), 1234);
  });
  it('should clear the vendor Id', async function () {
    await vendorRepoImpl.saveVendorId(1234);
    await vendorRepoImpl.clearVendorId();

    assert.isUndefined(await vendorRepoImpl.getVendorId());
  });
});
