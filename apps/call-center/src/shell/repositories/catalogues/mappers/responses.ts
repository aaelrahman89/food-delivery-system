import { BranchCatalogueDetailsResponse } from '@survv/api/definitions/catalogues';
import { BranchCataloguesListResponse } from '@survv/api/definitions/branches';
import {
  Catalogue,
  CatalogueSection,
  CatalogueStatus,
  CataloguesListItem,
} from '../../../../core/models/Catalogue';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { HashTag } from '../../../../core/models/HashTag';
import { HashTagResponse } from '@survv/api/definitions/hash-tags';
import { HoursRange } from '@survv/commons/core/models/HoursRange';
import {
  ImageRefType,
  createImageUrl,
} from '@survv/commons/core/models/Images';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { Money } from '@survv/commons/core/models/money';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { Tag } from '../../../../core/models/Tag';
import { TagResponse } from '@survv/api/definitions/tags';
import { Time } from '@survv/commons/core/models/Time';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { createBackendUrl } from '@survv/commons/shell/backend/backend';

export function mapHashTagResponseToHashTag(
  hashTagResponse: HashTagResponse
): HashTag {
  return new HashTag({
    id: hashTagResponse.id,
    status: hashTagResponse.status,
    creationDate: new Datetime(hashTagResponse.creationDate),
    vendorType: new VendorType(hashTagResponse.vendorType),
    name: new MultilingualString(hashTagResponse.title),
  });
}

export function mapTagResponseToTag(tagResponse: TagResponse): Tag {
  return new Tag({
    id: tagResponse.id,
    creationDate: new Datetime(tagResponse.creationDate),
    vendorType: new VendorType(tagResponse.vendorType),
    name: new MultilingualString(tagResponse.title),
    type: tagResponse.type,
    status: tagResponse.status,
    icon: createBackendUrl({
      url: '/api/v1/images',
      query: {
        referenceType: 'tagIcon',
        referenceId: tagResponse.id,
      },
    }),
  });
}

export function mapBranchCatalogueDetailsResponseToCatalogueDetails(
  branchCatalogueDetailsResponse: BranchCatalogueDetailsResponse
): Catalogue {
  return new Catalogue({
    id: branchCatalogueDetailsResponse.catalogueId,
    displayName: new MultilingualString(
      branchCatalogueDetailsResponse.displayName
    ),
    description: new MultilingualString(
      branchCatalogueDetailsResponse.description
    ),
    status: new CatalogueStatus(branchCatalogueDetailsResponse.status),
    catalogueSections: branchCatalogueDetailsResponse.catalogueSections.map(
      (catalogueSection) =>
        new CatalogueSection({
          id: catalogueSection.catalogueSectionId,
          displayName: new MultilingualString(catalogueSection.displayName),
          creationDate: new Datetime(catalogueSection.creationDate),
          items: catalogueSection.items.map((item) => ({
            id: item.id,
            displayName: new MultilingualString(item.displayName),
            description: new MultilingualString(item.description),
            calories: item.calories,
            prepTime: item.prepTime,
            popular: item.popular,
            available: item.available,
            price: new Money(item.price),
            tags: [
              ...item.hashTags.map(mapHashTagResponseToHashTag),
              ...item.tags.map(mapTagResponseToTag),
            ],
            coverPhoto: createImageUrl({
              refType: ImageRefType.CATALOGUE_ITEM_COVER_IMAGE,
              refId: item.id,
            }),
          })),
        })
    ),
    orderingHours: new HoursRange({
      from: new Time(branchCatalogueDetailsResponse.orderingHours.from),
      to: new Time(branchCatalogueDetailsResponse.orderingHours.to),
    }),
  });
}

export function mapBranchCataloguesToCataloguesList(
  catalogues: BranchCataloguesListResponse
): ItemsList<CataloguesListItem> {
  return {
    totalItemsCount: catalogues.length,
    items: catalogues.map((catalogue) => {
      return new CataloguesListItem({
        id: catalogue.catalogueId,
        displayName: new MultilingualString(catalogue.title),
      });
    }),
  };
}
