import { isObject, isString } from '../utils/checks';

interface MultilingualStringOptions {
  readonly en?: string;
  readonly ar?: string;
}

export class MultilingualString {
  readonly en: string = '';
  readonly ar: string = '';

  constructor(options?: MultilingualStringOptions) {
    Object.assign(this, options);
  }

  static isMultilingualString(value: unknown): value is MultilingualString {
    return isObject(value) && (isString(value.en) || isString(value.ar));
  }
}
