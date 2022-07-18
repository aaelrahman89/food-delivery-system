import { $sb } from '../../../utils/sandbox';
import { AppPM } from '../../../../core/presentation-models/AppPM';
import { assert } from 'chai';
import { configurationItems } from '../../../../core/configs/configurationItems';
import { networkService } from '../../../../shell/backend/networkService';
import { userPreferenceRepo } from '../../../../shell/repositories/UserPreferenceRepoImpl';

describe('AppPM', function () {
  it('fetches the configuration items of app customizations from backend and saves them', async function () {
    const pm = new AppPM({ userPreferenceRepo, manifestScope: 'test' });

    $sb
      .mock(networkService)
      .expects('request')
      .once()
      .withExactArgs({
        requestLine: 'get /api/v1/configurations',
        query: {
          configurationKeys: {
            keys: [
              configurationItems.LogoLtr,
              configurationItems.LogoRtl,
              configurationItems.Favicon,
              configurationItems.BRAND_NAME,
            ],
          },
        },
      })
      .resolves({
        configurations: [
          {
            configurationKey: configurationItems.LogoLtr,
            configurationValue: 'LogoLtr',
          },
          {
            configurationKey: configurationItems.LogoRtl,
            configurationValue: 'LogoRtl',
          },
          {
            configurationKey: configurationItems.Favicon,
            configurationValue: 'Favicon',
          },
          {
            configurationKey: configurationItems.BRAND_NAME,
            configurationValue: 'BRAND_NAME',
          },
        ],
      });

    await pm.init();

    const customizations = await userPreferenceRepo.getAppCustomizations();

    assert.equal(customizations.logoLtr, 'LogoLtr');
    assert.equal(customizations.logoRtl, 'LogoRtl');
    assert.equal(customizations.favicon, 'Favicon');
    assert.equal(customizations.BRAND_NAME, 'BRAND_NAME');
    assert.deepEqual(
      pm.manifest,
      JSON.stringify({
        name: 'BRAND_NAME',
        short_name: 'BRAND_NAME',
        scope: '/test/',
        icons: [
          {
            src: 'Favicon',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'Favicon',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        start_url: './',
        theme_color: '#e83744',
        background_color: '#e83744',
        display: 'standalone',
      })
    );
  });
});
