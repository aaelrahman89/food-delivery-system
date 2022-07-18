import { $sb } from '../../../utils/sandbox';
import { ConfigurationRepoImpl } from '../../../../shell/repositories/ConfigurationRepoImpl';
import { assert } from 'chai';
import { configurationItems } from '../../../../core/configs/configurationItems';
import { networkService } from '../../../../shell/backend/networkService';

describe('ConfigurationRepoImpl', function () {
  it('retrieves configuration values for the given configuration keys', async function () {
    const repo = new ConfigurationRepoImpl();

    $sb
      .mock(networkService)
      .expects('request')
      .once()
      .withExactArgs({
        requestLine: 'get /api/v1/configurations',
        query: {
          configurationKeys: {
            keys: [
              configurationItems.MapboxToken,
              configurationItems.GoogleMapsToken,
              configurationItems.LogoLtr,
              configurationItems.LogoRtl,
              configurationItems.Favicon,
            ],
          },
        },
      })
      .resolves({
        configurations: [
          {
            configurationKey: configurationItems.MapboxToken,
            configurationValue: 'MapboxToken',
          },
          {
            configurationKey: configurationItems.GoogleMapsToken,
            configurationValue: 'GoogleMapsToken',
          },
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
        ],
      });

    const configurations = await repo.getConfigItem([
      configurationItems.MapboxToken,
      configurationItems.GoogleMapsToken,
      configurationItems.LogoLtr,
      configurationItems.LogoRtl,
      configurationItems.Favicon,
    ]);

    assert.equal(configurations[configurationItems.MapboxToken], 'MapboxToken');
    assert.equal(
      configurations[configurationItems.GoogleMapsToken],
      'GoogleMapsToken'
    );
    assert.equal(configurations[configurationItems.LogoLtr], 'LogoLtr');
    assert.equal(configurations[configurationItems.LogoRtl], 'LogoRtl');
    assert.equal(configurations[configurationItems.Favicon], 'Favicon');
  });
});
