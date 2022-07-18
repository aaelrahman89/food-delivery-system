export class Vendor implements VendorOptions {
  logo = '';
  label = '';
  constructor(options?: VendorOptions) {
    Object.assign(this, options);
  }
}

export interface VendorOptions {
  logo: string;
  label: string;
}
