import { $sb } from '@survv/commons/test/utils/sandbox';
import { BranchProfileListItem } from '../../../../../src/core/models/Branch';
import { BranchProfilesRepoImpl } from '../../../../../src/shell/repositories/online-ordering/BranchProfilesRepoImpl';
import { CatalogueFormPM } from '../../../../../src/core/presentation-models/online-ordering/CatalogueFormPM';
import { HoursRange } from '@survv/commons/core/models/HoursRange';
import { Money } from '@survv/commons/core/models/money';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { Time } from '@survv/commons/core/models/Time';
import { VendorOnlineProfileRepoImpl } from '../../../../../src/shell/repositories/online-ordering/VendorOnlineProfileRepoImpl';
import { albumsResponseStub } from '@survv/api/stubs/albums';
import { assert } from 'chai';
import { cataloguesListResponseStub } from '@survv/api/stubs/catalogues';
import { consumerVendorProfileResponseStub } from '@survv/api/stubs/vendors';
import { mapVendorProfileToOnlineProfile } from '../../../../../src/shell/repositories/online-ordering/mappers/responses';
import { required } from '@survv/commons/core/validations/form-validators/formValidators';

describe('CatalogueFormPM', function () {
  let pm: CatalogueFormPM;

  beforeEach('resetting pm', function () {
    pm = new CatalogueFormPM({
      vendorId: 123,
      branchProfilesRepo: new BranchProfilesRepoImpl(),
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
    });
  });

  describe('init()', function () {
    it('hydrates a list of branch profiles & vendor online profile', async function () {
      const getProfileStub = $sb.stub(
        VendorOnlineProfileRepoImpl.prototype,
        'getProfile'
      );
      getProfileStub.resolves();

      const listBranchProfilesStub = $sb.stub(
        BranchProfilesRepoImpl.prototype,
        'listCompletedProfiles'
      );
      listBranchProfilesStub.resolves();

      await pm.init();

      assert.isTrue(getProfileStub.calledOnce);
      assert.isTrue(listBranchProfilesStub.calledOnce);
    });
  });

  it('disables displayName en if the vendor online profile does not support En. language', async function () {
    const vendorProfileResponse = consumerVendorProfileResponseStub();
    vendorProfileResponse.languageSupport = {
      en: false,
      ar: true,
    };

    $sb
      .stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile')
      .resolves(
        mapVendorProfileToOnlineProfile(
          vendorProfileResponse,
          cataloguesListResponseStub(),
          albumsResponseStub()
        )
      );

    $sb
      .stub(BranchProfilesRepoImpl.prototype, 'listCompletedProfiles')
      .resolves();

    await pm.init();

    assert.isTrue(pm.disableDisplayNameEn());
  });
  it('disables displayName ar if the vendor online profile does not support Ar. language', async function () {
    const vendorProfileResponse = consumerVendorProfileResponseStub();
    vendorProfileResponse.languageSupport = {
      en: true,
      ar: false,
    };

    $sb
      .stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile')
      .resolves(
        mapVendorProfileToOnlineProfile(
          vendorProfileResponse,
          cataloguesListResponseStub(),
          albumsResponseStub()
        )
      );

    $sb
      .stub(BranchProfilesRepoImpl.prototype, 'listCompletedProfiles')
      .resolves();

    await pm.init();

    assert.isTrue(pm.disableDisplayNameAr());
  });
  it('disables description en if the vendor online profile does not support En. language', async function () {
    const vendorProfileResponse = consumerVendorProfileResponseStub();
    vendorProfileResponse.languageSupport = {
      en: false,
      ar: true,
    };

    $sb
      .stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile')
      .resolves(
        mapVendorProfileToOnlineProfile(
          vendorProfileResponse,
          cataloguesListResponseStub(),
          albumsResponseStub()
        )
      );

    $sb
      .stub(BranchProfilesRepoImpl.prototype, 'listCompletedProfiles')
      .resolves();

    await pm.init();

    assert.isTrue(pm.disableDescriptionEn());
  });
  it('disables description ar if the vendor online profile does not support Ar. language', async function () {
    const vendorProfileResponse = consumerVendorProfileResponseStub();
    vendorProfileResponse.languageSupport = {
      en: true,
      ar: false,
    };

    $sb
      .stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile')
      .resolves(
        mapVendorProfileToOnlineProfile(
          vendorProfileResponse,
          cataloguesListResponseStub(),
          albumsResponseStub()
        )
      );
    $sb
      .stub(BranchProfilesRepoImpl.prototype, 'listCompletedProfiles')
      .resolves();

    await pm.init();

    assert.isTrue(pm.disableDescriptionAr());
  });

  describe('validators()', function () {
    describe('displayName.en', function () {
      it('is not required if displayName en should be disabled', async function () {
        const vendorProfileResponse = consumerVendorProfileResponseStub();
        vendorProfileResponse.languageSupport = {
          en: false,
          ar: true,
        };

        $sb
          .stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile')
          .resolves(
            mapVendorProfileToOnlineProfile(
              vendorProfileResponse,
              cataloguesListResponseStub(),
              albumsResponseStub()
            )
          );

        $sb
          .stub(BranchProfilesRepoImpl.prototype, 'listCompletedProfiles')
          .resolves();

        await pm.init();

        pm.form.displayName = {
          en: '',
          ar: 'ar',
        };

        assert.isTrue(pm.validators()['displayName.en']());
      });

      it('is required if displayName en should not be disabled', async function () {
        const vendorProfileResponse = consumerVendorProfileResponseStub();
        vendorProfileResponse.languageSupport = {
          en: true,
          ar: true,
        };

        $sb
          .stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile')
          .resolves(
            mapVendorProfileToOnlineProfile(
              vendorProfileResponse,
              cataloguesListResponseStub(),
              albumsResponseStub()
            )
          );

        $sb
          .stub(BranchProfilesRepoImpl.prototype, 'listCompletedProfiles')
          .resolves();

        await pm.init();

        pm.form.displayName = {
          en: '',
          ar: 'ar',
        };

        assert.equal(
          pm.validators()['displayName.en'](),
          required(pm.form.displayName.en)
        );

        pm.form.displayName = {
          en: 'en',
          ar: 'ar',
        };

        assert.isTrue(pm.validators()['displayName.en']());
      });
    });
    describe('displayName.ar', function () {
      it('is not required if displayName ar should be disabled', async function () {
        const vendorProfileResponse = consumerVendorProfileResponseStub();
        vendorProfileResponse.languageSupport = {
          en: true,
          ar: false,
        };

        $sb
          .stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile')
          .resolves(
            mapVendorProfileToOnlineProfile(
              vendorProfileResponse,
              cataloguesListResponseStub(),
              albumsResponseStub()
            )
          );

        $sb
          .stub(BranchProfilesRepoImpl.prototype, 'listCompletedProfiles')
          .resolves();

        await pm.init();

        pm.form.displayName = {
          en: 'en',
          ar: '',
        };

        assert.isTrue(pm.validators()['displayName.ar']());
      });

      it('is required if displayName ar should not be disabled', async function () {
        const vendorProfileResponse = consumerVendorProfileResponseStub();
        vendorProfileResponse.languageSupport = {
          en: true,
          ar: true,
        };

        $sb
          .stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile')
          .resolves(
            mapVendorProfileToOnlineProfile(
              vendorProfileResponse,
              cataloguesListResponseStub(),
              albumsResponseStub()
            )
          );

        $sb
          .stub(BranchProfilesRepoImpl.prototype, 'listCompletedProfiles')
          .resolves();

        await pm.init();

        pm.form.displayName = {
          en: 'en',
          ar: '',
        };

        assert.equal(
          pm.validators()['displayName.ar'](),
          required(pm.form.displayName.ar)
        );

        pm.form.displayName = {
          en: 'en',
          ar: 'ar',
        };

        assert.isTrue(pm.validators()['displayName.ar']());
      });
    });
  });

  it('displays branches selections after open', function () {
    assert.isFalse(pm.shouldOpenBranchesSelections);

    pm.openBranchesSelections();

    assert.isTrue(pm.shouldOpenBranchesSelections);
  });
  it('closes branches selection after close', function () {
    pm.openBranchesSelections();

    assert.isTrue(pm.shouldOpenBranchesSelections);

    pm.closeBranchesSelections();

    assert.isFalse(pm.shouldOpenBranchesSelections);
  });
  it('adds given branches selections and closes branches selection', function () {
    pm.openBranchesSelections();

    assert.deepEqual(pm.form.branches, []);
    pm.addBranches([
      new BranchProfileListItem({
        id: 111,
        orderingHours: new HoursRange({
          from: new Time('00:00:00'),
          to: new Time('12:00:00'),
        }),
        vendorId: 123,
        active: true,
        hasCompleteProfile: true,
        label: 'branch1',
        displayName: new MultilingualString({ en: 'en1', ar: 'ar1' }),
        minimumOrderValue: new Money({ amount: 20, currency: 'EGP' }),
        avgBasketSize: new Money({
          amount: 60.15,
          currency: 'EGP',
        }),
      }),
      new BranchProfileListItem({
        id: 222,
        orderingHours: new HoursRange({
          from: new Time('00:00:00'),
          to: new Time('12:00:00'),
        }),
        vendorId: 123,
        active: true,
        hasCompleteProfile: true,
        label: 'branch2',
        displayName: new MultilingualString({ en: 'en2', ar: 'ar2' }),
        minimumOrderValue: new Money({ amount: 20, currency: 'EGP' }),
        avgBasketSize: new Money({
          amount: 60.15,
          currency: 'EGP',
        }),
      }),
    ]);

    assert.deepEqual(pm.form.branches, [
      new BranchProfileListItem({
        id: 111,
        vendorId: 123,
        active: true,
        hasCompleteProfile: true,
        label: 'branch1',
        displayName: new MultilingualString({ en: 'en1', ar: 'ar1' }),
        minimumOrderValue: new Money({ amount: 20, currency: 'EGP' }),
        orderingHours: new HoursRange({
          from: new Time('00:00:00'),
          to: new Time('12:00:00'),
        }),
        avgBasketSize: new Money({
          amount: 60.15,
          currency: 'EGP',
        }),
      }),
      new BranchProfileListItem({
        id: 222,
        vendorId: 123,
        active: true,
        hasCompleteProfile: true,
        label: 'branch2',
        displayName: new MultilingualString({ en: 'en2', ar: 'ar2' }),
        minimumOrderValue: new Money({ amount: 20, currency: 'EGP' }),
        orderingHours: new HoursRange({
          from: new Time('00:00:00'),
          to: new Time('12:00:00'),
        }),
        avgBasketSize: new Money({
          amount: 60.15,
          currency: 'EGP',
        }),
      }),
    ]);
    assert.isFalse(pm.shouldOpenBranchesSelections);
  });
});
