import { LocalizationService } from '../../core/services/LocalizationService';
import { Translatable } from '../../core/types';
import { isObject } from '../../core/utils/checks';

export class LocalizationServiceMockImpl implements LocalizationService {
  private readonly _prefix = 'LOCALIZED';
  localize(value: Translatable): string {
    if (isObject(value)) {
      return `${this._prefix}_${value.toString()}`;
    }
    return `${this._prefix}_${value}`;
  }
}
