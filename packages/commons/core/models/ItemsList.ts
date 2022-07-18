import { EntityId, Translatable, UrlString } from '../types';

export interface ItemsList<T> {
  totalItemsCount: number;
  items: T[];
}

export interface BottomSheetListItem<T> {
  id: EntityId;
  label: Translatable;
  icon?: UrlString;
  value: T;
}

export interface BottomSheetListGroup<T> {
  name?: Translatable;
  items: BottomSheetListItem<T>[];
}
