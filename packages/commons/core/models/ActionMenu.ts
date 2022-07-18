import { AssetExport } from '@survv/assets';
import { Location } from 'vue-router';
import { TranslateResult } from 'vue-i18n';

export interface ActionMenuItem {
  name: string | TranslateResult;
  icon?: AssetExport;
  disabled?: boolean;
  onClick?(): void;
  route?: Location;
}
