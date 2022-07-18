import { $sb } from '../../../utils/sandbox';
import { assert } from 'chai';
import { kvStorage } from '@survv/pwa/shell/kv-storage-impl';
import { userPreferenceRepo } from '../../../../shell/repositories/UserPreferenceRepoImpl';

describe('UserPreferenceRepoImpl', function () {
  describe('language scope', function () {
    it('should default to "en"', async function () {
      assert.equal(await userPreferenceRepo.getLanguage(), 'en');
    });
    it('should switch the language between "en" and "ar"', async function () {
      await userPreferenceRepo.switchLanguage();

      assert.equal(await userPreferenceRepo.getLanguage(), 'ar');

      await userPreferenceRepo.switchLanguage();

      assert.equal(await userPreferenceRepo.getLanguage(), 'en');
    });
    it('should set the language as desired', async function () {
      await userPreferenceRepo.setLanguage('ar');

      assert.equal(await userPreferenceRepo.getLanguage(), 'ar');
    });
  });

  describe('app customization', function () {
    it('saves app customizations', async function () {
      const storageSpy = $sb.spy(kvStorage, 'setItem');

      await userPreferenceRepo.saveAppCustomizations({
        logoLtr: 'logo ltr url',
        logoRtl: 'logo rtl url',
        favicon: 'favicon',
      });

      assert.isTrue(storageSpy.calledWithExactly('logoLtr', 'logo ltr url'));
      assert.isTrue(storageSpy.calledWithExactly('logoRtl', 'logo rtl url'));
      assert.isTrue(storageSpy.calledWithExactly('favicon', 'favicon'));
    });

    it('gets app customizations', async function () {
      await userPreferenceRepo.saveAppCustomizations({
        logoLtr: 'logo ltr url',
        logoRtl: 'logo rtl url',
        favicon: 'favicon',
      });

      const customizations = await userPreferenceRepo.getAppCustomizations();

      assert.equal(customizations.logoLtr, 'logo ltr url');
      assert.equal(customizations.logoRtl, 'logo rtl url');
      assert.equal(customizations.favicon, 'favicon');
    });
  });
});
