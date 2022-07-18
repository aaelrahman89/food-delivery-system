import { HashTagResponse } from './hash-tags';
import {
  ListingMetadata,
  MoneyWithCurrency,
  MultilingualString,
} from './common';
import { TagResponse } from './tags';

export type ItemRequest = void;

export interface MarkItemAvailableRequest {
  branchId: number;
}

export interface MarkItemUnVAvailableRequest {
  branchId: number;
}

export type MarkItemAvailableResponse = void;
export type MarkItemUnAvailableResponse = void;

export interface ItemResponse {
  itemId: number;
  displayName: MultilingualString;
  description: MultilingualString;
  archived: boolean;
  calories: number;
  prepTime: number;
  price: MoneyWithCurrency;
  tags: TagResponse[];
  hashTags: HashTagResponse[];
  options: ItemOption[];
  catalogueId: number;
  catalogueSections: ItemCatalogueSection[];
  coverPhotosIds: number[];
  creationDate: string;
  popular: boolean;
  defaultCoverPhotoId: number;
  unavailableBranches: number[];
}

export interface ItemsListResponseItem {
  itemId: number;
  vendorId: number;
  catalogueSectionIds: number[];
  displayName: MultilingualString;
  description: MultilingualString;
  archived: boolean;
  calories: number;
  prepTime: number;
  price: MoneyWithCurrency;
  tags: TagResponse[];
  hashTags: HashTagResponse[];
  options: {
    optionId: number;
    title: MultilingualString;
    description: MultilingualString;
    mandatory: boolean;
    multiSelection: boolean;
    minAllowed: number;
    maxAllowed: number;
    selections: ItemOptionSelection[];
    template: boolean;
    creationDate: string;
  }[];
  catalogueId: number;
  coverPhotosIds: number[];
  creationDate: string;
  popular: boolean;
  defaultCoverPhotoId: number;
  unavailableBranches: number[];
}

export interface ItemCatalogueSection {
  catalogueSectionId: number;
  displayName: MultilingualString;
  creationDate: string;
}

export interface ItemOption {
  optionId: number;
  title: MultilingualString;
  description: MultilingualString;
  mandatory: boolean;
  multiSelection: boolean;
  minAllowed: number;
  maxAllowed: number;
  selections: ItemOptionSelection[];
  template: boolean;
  creationDate: string;
  related: boolean;
}

export interface ItemOptionSelection {
  id: number;
  title: MultilingualString;
  calories: number;
  price: MoneyWithCurrency;
  relatedOptions: number[];
}

export interface ItemsListResponse {
  metadata: ListingMetadata;
  items: ItemsListResponseItem[];
}

export type ItemsListRequest = void;

export type DeleteItemOptionRequest = void;

export type DeleteItemOptionResponse = void;
