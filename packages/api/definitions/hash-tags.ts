import { ListingMetadata, MultilingualString, VendorType } from './common';

export type HashTagsListRequest = void;
export interface HashTagsListResponse {
  metadata: ListingMetadata;
  hashTags: {
    id: number;
    title: MultilingualString;
    status: HashTagStatus;
    vendorsCount: number;
    itemsCount: number;
    vendorType: VendorType;
    creationDate: string;
  }[];
}

export interface HashTagResponse {
  id: number;
  title: MultilingualString;
  vendorType: VendorType;
  status: HashTagStatus;
  creationDate: string;
}

export type HashTagStatus = string & ('VISIBLE' | 'HIDDEN');
