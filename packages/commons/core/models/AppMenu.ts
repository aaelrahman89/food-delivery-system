import { AssetExport } from '@survv/assets';
import { Location } from 'vue-router';

export interface AppMenuSection {
  header?: string;
  entries: AppMenuRoute[];
}

export interface AppMenuRoute {
  name: string;
  icon: AssetExport;
  route: Location;
}
