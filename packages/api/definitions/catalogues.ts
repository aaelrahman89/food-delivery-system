import { EntityId } from '../../commons/core/types';
import { HashTagResponse } from './hash-tags';
import {
  ListingMetadata,
  MoneyWithCurrency,
  MultilingualString,
  OrderingHours,
  VendorType,
} from './common';
import { TagResponse } from './tags';
import { TaxTierResponse } from './tax-tiers';

export interface CatalogueCreationRequest {
  vendorId: number;
  displayName: MultilingualString;
  description: MultilingualString;
  orderingHours: OrderingHours;
  branchIds: number[];
}

export interface CatalogueCreationResponse {
  id: number;
  creationDate: string;
}

export interface CatalogueUpdateRequest {
  displayName: MultilingualString;
  description: MultilingualString;
  orderingHours: OrderingHours;
  branchIds: number[];
}
export interface BranchCatalogueDetailsResponse {
  catalogueId: number;
  displayName: MultilingualString;
  description: MultilingualString;
  vendor: { id: number; type: VendorType };
  availableForOrdering: boolean;
  languageSupport: { en: boolean; ar: boolean };
  catalogueSections: Array<BranchCatalogueDetailsCatalogueSection>;
  status: string;
  orderingHours: OrderingHours;
}
export interface CatalogueDetailsResponse {
  catalogueId: number;
  displayName: MultilingualString;
  description: MultilingualString;
  vendor: { id: number; type: VendorType };
  availableForOrdering: boolean;
  languageSupport: { en: boolean; ar: boolean };
  catalogueSections: Array<CatalogueSection>;
  publishedBranches: Array<{
    id: EntityId;
    displayName: MultilingualString;
  }>;
  status: string;
  orderingHours: OrderingHours;
}

export interface CataloguesListResponse {
  metadata: ListingMetadata;
  catalogues: CataloguesListItemResponse[];
}
export interface CataloguesListItemResponse {
  catalogueId: number;
  displayName: MultilingualString;
  description: MultilingualString;
  vendor: {
    id: number;
    type: VendorType;
  };
  status: CatalogueStatus;
  publishedBranches: number[];
  orderingHours: {
    from: string;
    to: string;
  };
}

export type CatalogueStatus = string & ('DRAFT' | 'READY' | 'PUBLISHED');

export interface CatalogueSectionCreationRequest {
  displayName: MultilingualString;
  vatTierId: number;
}

export interface CatalogueSectionCreationResponse {
  id: number;
  creationDate: string;
}

export interface CatalogueItemCreationRequest {
  displayName: MultilingualString;
  description: MultilingualString;
  calories: number;
  prepTime: number;
  price: number;
  catalogueSectionIds: number[];
  tagIds: number[];
  hashTagIds: number[];
}

export type CatalogueItemCreationResponse = {
  itemId: number;
  creationDate: string;
};

export interface CatalogueItemUpdateRequest {
  displayName: MultilingualString;
  description: MultilingualString;
  calories: number;
  prepTime: number;
  price: number;
  catalogueSectionIds: number[];
  tagIds: number[];
  hashTagIds: number[];
}

export interface ArrangeCatalogueSectionsRequest {
  sections: number[];
}

export interface ArrangeCatalogueSectionItemsRequest {
  sectionItems: number[];
}

export type CatalogueItemUpdateResponse = {
  itemId: number;
};

export interface CatalogueSetAsReadyResponse {
  catalogueId: number;
  status: string;
}

export interface CataloguePublishResponse {
  catalogueId: number;
  status: string;
}

export interface CatalogueUnpublishResponse {
  catalogueId: number;
  status: string;
}

export type ArchiveItemRequest = void;

export type ArchiveItemResponse = {
  itemId: number;
  catalogueId: number;
  archived: boolean;
};

export interface CatalogueSection {
  catalogueSectionId: number;
  displayName: MultilingualString;
  vatTier: TaxTierResponse;
  items: {
    id: number;
    displayName: MultilingualString;
    description: MultilingualString;
    calories: number;
    prepTime: number;
    price: MoneyWithCurrency;
    tags: TagResponse[];
    hashTags: HashTagResponse[];
    sectionReferences: { sectionId: number; order: number }[];
    popular: boolean;
    archived: boolean;
    unavailableBranches: number[];
  }[];
  creationDate: string;
}

export interface BranchCatalogueDetailsCatalogueSection {
  catalogueSectionId: number;
  displayName: MultilingualString;
  items: {
    id: number;
    displayName: MultilingualString;
    description: MultilingualString;
    calories: number;
    prepTime: number;
    price: MoneyWithCurrency;
    tags: TagResponse[];
    hashTags: HashTagResponse[];
    sectionReferences: { sectionId: number; order: number }[];
    popular: boolean;
    archived: boolean;
    available: boolean;
  }[];
  creationDate: string;
}

export interface UpdateCatalogueBranchesRequest {
  branchIds: number[];
}

export type UpdateCatalogueBranchesResponse = void;
