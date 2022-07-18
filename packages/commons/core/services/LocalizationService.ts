import { Primitive, Translatable } from '../types';

export interface LocalizationService {
  localize(
    arg: Translatable,
    templateParams?: Record<string, Primitive>
  ): string;
}
