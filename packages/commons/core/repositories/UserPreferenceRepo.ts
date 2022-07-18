export interface UserPreferenceRepo {
  getLanguage(): Promise<'en' | 'ar'>;
  switchLanguage(): Promise<void>;
  saveAppCustomizations(customizations: {
    [key: string]: string;
    logoLtr: string;
    logoRtl: string;
    favicon: string;
    BRAND_NAME: string;
  }): Promise<void>;
  getAppCustomizations(): Promise<{
    logoLtr: string;
    logoRtl: string;
    favicon: string;
    BRAND_NAME: string;
  }>;
}
