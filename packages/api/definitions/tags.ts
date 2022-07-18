import { ListingMetadata, MultilingualString, VendorType } from './common';

export interface TagResponse {
  id: number;
  title: MultilingualString;
  status: TagStatus;
  vendorType: VendorType;
  type: TagType;
  icon?: string;
  creationDate: string;
}

export interface TagsListItemResponse {
  id: number;
  title: {
    en: string;
    ar: string;
  };
  imageId: number;
  status: TagStatus;
  vendorType: VendorType;
  type: TagType;
  creationDate: string;
}

export interface TagsListResponse {
  metadata: ListingMetadata;
  tags: TagsListItemResponse[];
}

export type TagType = string &
  ('NONE' | 'CUISINE' | 'DIETARY' | 'ALLERGY' | 'VENUE' | 'PICKUP');

export type TagStatus = string & ('VISIBLE' | 'HIDDEN');
