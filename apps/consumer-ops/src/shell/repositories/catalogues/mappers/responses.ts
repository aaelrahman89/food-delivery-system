import { AlbumsResponse } from '@survv/api/definitions/albums';
import { BranchItemResponse } from '@survv/api/definitions/branches';
import {
  CatalogueItem,
  CatalogueItemsListItem,
} from '../../../../core/models/CatalogueItem';
import {
  CatalogueItemOption,
  CatalogueItemOptionSelection,
} from '../../../../core/models/CatalogueItemOption';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { EntityId } from '@survv/commons/core/types';
import { HashTag } from '../../../../core/models/HashTag';
import { HashTagResponse } from '@survv/api/definitions/hash-tags';
import { HashTagStatus } from '../../../../core/models/HashTagStatus';
import {
  ImageRefType,
  ImageUrlString,
  createImageUrl,
} from '@survv/commons/core/models/Images';
import { ItemResponse, ItemsListResponse } from '@survv/api/definitions/items';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { Money } from '@survv/commons/core/models/money';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { Tag } from '../../../../core/models/Tag';
import { TagResponse } from '@survv/api/definitions/tags';
import { TagStatus } from '../../../../core/models/TagStatus';
import { TagType } from '../../../../core/models/TagType';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { createBackendUrl } from '@survv/commons/shell/backend/backend';

export function mapItemsListResponseToCatalogueItemsList(
  list: ItemsListResponse
): ItemsList<CatalogueItemsListItem> {
  return {
    totalItemsCount: list.metadata.totalCount,
    items: list.items.map(
      (item) =>
        new CatalogueItemsListItem({
          id: item.itemId,
          displayName: new MultilingualString(item.displayName),
          description: new MultilingualString(item.description),
          price: new Money(item.price),
          coverPhoto: item.defaultCoverPhotoId
            ? createImageUrl({
                refId: item.defaultCoverPhotoId,
                refType: ImageRefType.CATALOGUE_ITEM_COVER_IMAGE,
              })
            : '',
        })
    ),
  };
}

export function mapTagResponseToTag(tagResponse: TagResponse): Tag {
  return new Tag({
    id: tagResponse.id,
    creationDate: new Datetime(tagResponse.creationDate),
    vendorType: new VendorType(tagResponse.vendorType),
    name: new MultilingualString(tagResponse.title),
    type: new TagType(tagResponse.type),
    status: new TagStatus(tagResponse.status),
    icon: createBackendUrl({
      url: '/api/v1/images',
      query: {
        referenceType: 'tagIcon',
        referenceId: tagResponse.id,
      },
    }),
  });
}
export function mapHashTagResponseToHashTag(
  hashTagResponse: HashTagResponse
): HashTag {
  return new HashTag({
    id: hashTagResponse.id,
    status: new HashTagStatus(hashTagResponse.status),
    creationDate: new Datetime(hashTagResponse.creationDate),
    vendorType: new VendorType(hashTagResponse.vendorType),
    name: new MultilingualString(hashTagResponse.title),
  });
}

export function mapAlbumImageToUrl(imageId: EntityId): ImageUrlString {
  return createBackendUrl({
    url: '/api/v1/images/:imageId',
    params: { imageId },
  });
}

export function mapItemResponseToCatalogueItem(
  item: ItemResponse,
  albumResponse: AlbumsResponse,
  noCoverPhoto = false
): CatalogueItem {
  const {
    itemId,
    archived,
    calories,
    catalogueId,
    catalogueSections,
    description,
    displayName,
    hashTags,
    options,
    prepTime,
    tags,
    price,
    popular,
  } = item;
  return new CatalogueItem({
    id: itemId,
    description: new MultilingualString(description),
    displayName: new MultilingualString(displayName),
    options: options
      .filter((option) => !option.related)
      .map(
        (catalogueItemOption) =>
          new CatalogueItemOption({
            id: catalogueItemOption.optionId,
            description: new MultilingualString(
              catalogueItemOption.description
            ),
            displayName: new MultilingualString(catalogueItemOption.title),
            mandatory: catalogueItemOption.mandatory,
            maxAllowed: catalogueItemOption.maxAllowed,
            minAllowed: catalogueItemOption.minAllowed,
            multiSelection: catalogueItemOption.multiSelection,
            template: catalogueItemOption.template,
            selections: catalogueItemOption.selections.map(
              (itemOptionSelection) =>
                new CatalogueItemOptionSelection({
                  id: itemOptionSelection.id,
                  calories: itemOptionSelection.calories,
                  price: new Money(itemOptionSelection.price),
                  relatedOptions: itemOptionSelection.relatedOptions.map(
                    (relatedOptionId) => {
                      const [relatedOption] = options.filter(
                        (option) => option.optionId === relatedOptionId
                      );
                      return {
                        optionId: relatedOptionId,
                        displayName: new MultilingualString(
                          relatedOption.title
                        ),
                        mandatory: relatedOption.mandatory,
                        maxAllowed: relatedOption.maxAllowed,
                        minAllowed: relatedOption.minAllowed,
                        multiSelection: relatedOption.multiSelection,
                        selectionId: itemOptionSelection.id,
                        selectionName: new MultilingualString(
                          itemOptionSelection.title
                        ),
                        selectionOptionId: catalogueItemOption.optionId,
                        selectionOptionName: new MultilingualString(
                          catalogueItemOption.title
                        ),
                        selections: relatedOption.selections.map(
                          (relatedOptionSelection) => ({
                            displayName: new MultilingualString(
                              relatedOptionSelection.title
                            ),
                            calories: relatedOptionSelection.calories,
                            price: new Money(relatedOptionSelection.price),
                            id: relatedOptionSelection.id,
                          })
                        ),
                      };
                    }
                  ),
                  displayName: new MultilingualString(
                    itemOptionSelection.title
                  ),
                })
            ),
          })
      ),
    archived,
    calories,
    catalogueId,
    popular,
    catalogueSections: catalogueSections.map((section) => ({
      id: section.catalogueSectionId,
      creationDate: new Datetime(section.creationDate),
      displayName: new MultilingualString(section.displayName),
    })),
    allergies: tags
      .filter((tag) => TagType.ALLERGY.equals(tag.type))
      .map(mapTagResponseToTag),
    tags: [
      ...tags
        .filter((tag) => TagType.ALLERGY.notEqual(tag.type))
        .map(mapTagResponseToTag),
      ...hashTags.map(mapHashTagResponseToHashTag),
    ],
    coverPhoto: noCoverPhoto
      ? ''
      : createImageUrl({
          refId: itemId,
          refType: ImageRefType.CATALOGUE_ITEM_COVER_IMAGE,
        }),
    gallery: albumResponse.map(mapAlbumImageToUrl),
    price: new Money(price),
    prepTime,
  });
}

export function mapBranchItemResponseToCatalogueItem(
  item: BranchItemResponse
): CatalogueItem {
  return new CatalogueItem({
    catalogueId: item.catalogueId,
    coverPhoto:
      item.defaultCoverPhoto > 0
        ? createImageUrl({
            refId: item.defaultCoverPhoto,
            refType: ImageRefType.CATALOGUE_ITEM_COVER_IMAGE,
          })
        : '',
    description: item.description,
    id: item.itemId,
    displayName: new MultilingualString(item.displayName),
    options: item.options.map(
      (catalogueItemOption) =>
        new CatalogueItemOption({
          id: catalogueItemOption.optionId,
          description: new MultilingualString(catalogueItemOption.description),
          displayName: new MultilingualString(catalogueItemOption.title),
          mandatory: catalogueItemOption.mandatory,
          maxAllowed: catalogueItemOption.maxAllowed,
          minAllowed: catalogueItemOption.minAllowed,
          multiSelection: catalogueItemOption.multiSelection,
          template: catalogueItemOption.template,
          selections: catalogueItemOption.selections.map(
            (itemOptionSelection) =>
              new CatalogueItemOptionSelection({
                id: itemOptionSelection.id,
                calories: itemOptionSelection.calories,
                price: new Money(itemOptionSelection.price),
                relatedOptions: itemOptionSelection.relatedOptions.map(
                  (relatedOptionId) => {
                    const [relatedOption] = item.options.filter(
                      (option) => option.optionId === relatedOptionId
                    );
                    return {
                      optionId: relatedOptionId,
                      displayName: new MultilingualString(relatedOption.title),
                      mandatory: relatedOption.mandatory,
                      maxAllowed: relatedOption.maxAllowed,
                      minAllowed: relatedOption.minAllowed,
                      multiSelection: relatedOption.multiSelection,
                      selectionId: itemOptionSelection.id,
                      selectionName: new MultilingualString(
                        itemOptionSelection.title
                      ),
                      selectionOptionId: catalogueItemOption.optionId,
                      selectionOptionName: new MultilingualString(
                        catalogueItemOption.title
                      ),
                      selections: relatedOption.selections.map(
                        (relatedOptionSelection) => ({
                          displayName: new MultilingualString(
                            relatedOptionSelection.title
                          ),
                          calories: relatedOptionSelection.calories,
                          price: new Money(relatedOptionSelection.price),
                          id: relatedOptionSelection.id,
                        })
                      ),
                    };
                  }
                ),
                displayName: new MultilingualString(itemOptionSelection.title),
              })
          ),
        })
    ),
    price: new Money(item.price),
    archived: false,
    calories: 0,
    prepTime: 0,
    tags: [],
    allergies: [],
    catalogueSections: [],
    gallery: [],
    popular: false,
  });
}
