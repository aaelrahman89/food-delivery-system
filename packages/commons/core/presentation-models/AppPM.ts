import { BasePM } from '../base/BasePM';
import { ConfigurationRepoImpl } from '../../shell/repositories/ConfigurationRepoImpl';
import { UserPreferenceRepo } from '../repositories/UserPreferenceRepo';
import { configurationItems } from '../configs/configurationItems';

export class AppPM extends BasePM {
  private readonly _userPreferenceRepo: UserPreferenceRepo;
  logoLtr: string;
  logoRtl: string;
  favicon: string;
  manifest: string;
  manifestScope: string;
  BRAND_NAME: string;

  constructor({
    userPreferenceRepo,
    manifestScope,
  }: {
    userPreferenceRepo: UserPreferenceRepo;
    manifestScope: string;
  }) {
    super();
    this._userPreferenceRepo = userPreferenceRepo;
    this.logoLtr = '';
    this.logoRtl = '';
    this.favicon = '';
    this.manifest = '';
    this.manifestScope = manifestScope;
    this.BRAND_NAME = '';
  }

  async _hydrate(): Promise<void> {
    ({
      [configurationItems.LogoLtr]: this.logoLtr,
      [configurationItems.LogoRtl]: this.logoRtl,
      [configurationItems.Favicon]: this.favicon,
      [configurationItems.BRAND_NAME]: this.BRAND_NAME,
    } = await new ConfigurationRepoImpl().getConfigItem([
      configurationItems.LogoLtr,
      configurationItems.LogoRtl,
      configurationItems.Favicon,
      configurationItems.BRAND_NAME,
    ]));
    this.manifest = JSON.stringify({
      name: this.BRAND_NAME,
      short_name: this.BRAND_NAME,
      scope: `/${this.manifestScope}/`,
      icons: [
        {
          src: this.favicon,
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: this.favicon,
          sizes: '512x512',
          type: 'image/png',
        },
      ],
      start_url: './',
      theme_color: '#e83744',
      background_color: '#e83744',
      display: 'standalone',
    });

    await this._userPreferenceRepo.saveAppCustomizations({
      logoRtl: this.logoRtl,
      logoLtr: this.logoLtr,
      favicon: this.favicon,
      BRAND_NAME: this.BRAND_NAME,
    });
  }
}
