import { HashTagResponse } from './hash-tags';
import { MultilingualString, VendorType } from './common';
import { TagResponse } from './tags';

export interface TagGroupsListResponse {
  metadata: {
    skipped: number;
    limit: number;
    totalCount: number;
    totalReturned: number;
  };
  tagGroups: Array<{
    id: number;
    title: {
      en: string;
      ar: string;
    };
    status: string;
    vendorType: VendorType;
    tagsCount: number;
    hashTagsCount: number;
    creationDate: string;
  }>;
}

export interface TagGroupResponse {
  id: number;
  title: {
    en: string;
    ar: string;
  };
  status: string;
  vendorType: VendorType;
  tags: TagResponse[];
  hashTags: HashTagResponse[];
  creationDate: string;
}

export interface TagGroupCreationRequest {
  title: MultilingualString;
  vendorType: VendorType;
  status: string;
  tagIds: number[];
  hashTagIds: number[];
}
export interface TagGroupsCreationResponse {
  id: number;
}
