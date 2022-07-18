export function appCustomizations(): {
  logoLtr: string;
  logoRtl: string;
  favicon: string;
  BRAND_NAME: string;
} {
  return {
    BRAND_NAME: 'Survv',
    logoLtr: 'https://storage.cloud.google.com/srvstg-images/logo-ltr.svg',
    logoRtl: 'https://storage.cloud.google.com/srvstg-images/logo-rtl.svg',
    favicon: 'https://storage.cloud.google.com/srvstg-images/favicon-32x32.png',
  };
}
