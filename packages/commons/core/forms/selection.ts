import { EnumClass } from '../models/EnumClass';
import { Translatable } from '../types';

export class FormSelectionOption<T> {
  value: T;
  label: Translatable;
  constructor(value: T, label: Translatable) {
    this.value = value;
    this.label = label;
  }
}

export function mapEnumsToSelections<T extends EnumClass>(
  lookup: T[]
): FormSelectionOption<T>[] {
  return lookup.map((item) => new FormSelectionOption(item, item.toString()));
}
