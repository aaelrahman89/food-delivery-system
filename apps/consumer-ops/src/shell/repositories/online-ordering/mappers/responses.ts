import { AlbumsResponse } from '@survv/api/definitions/albums';
import { BranchItemResponse } from '@survv/api/definitions/branches';
import { BranchProfileListItem } from '../../../../core/models/Branch';
import {
  ConsumerVendorBranchProfileListResponse,
  ConsumerVendorProfileResponse,
  VendorUserCreationResponse,
  VendorsListResponse,
} from '@survv/api/definitions/vendors';

import {
  Catalogue,
  CatalogueSection,
  CatalogueStatus,
} from '../../../../core/models/Catalogue';
import {
  CatalogueDetailsResponse,
  CataloguesListResponse,
} from '@survv/api/definitions/catalogues';
import {
  CatalogueItem,
  CatalogueItemsListItem,
} from '../../../../core/models/CatalogueItem';
import {
  CatalogueItemOption,
  CatalogueItemOptionSelection,
} from '../../../../core/models/CatalogueItemOption';
import { CataloguesVendorsListResponse } from '@survv/api/definitions/catalogues-vendors';
import {
  ContactPerson,
  ContactPersonForm,
} from '../../../../core/models/ContactPerson';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { DeliveryFleet } from '../../../../core/models/DeliveryFleet';
import { DispatchingModel } from '../../../../core/models/DispatchingModel';
import { EntityId } from '@survv/commons/core/types';
import { HashTag } from '../../../../core/models/HashTag';
import {
  HashTagResponse,
  HashTagsListResponse,
} from '@survv/api/definitions/hash-tags';
import { HashTagStatus } from '../../../../core/models/HashTagStatus';
import { HoursRange } from '@survv/commons/core/models/HoursRange';
import {
  ImageRefType,
  ImageUrlString,
  createImageUrl,
} from '@survv/commons/core/models/Images';
import { ItemResponse, ItemsListResponse } from '@survv/api/definitions/items';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import {
  LanguageSupport,
  VendorOnlineProfile,
  VendorOnlineProfileList,
  VendorOnlineProfileListItem,
  VendorOpsProfileList,
  VendorOpsProfileListItem,
  VendorPosIntegrationType,
  VendorTaxStatusType,
} from '../../../../core/models/VendorOnlineProfile';
import { Money } from '@survv/commons/core/models/money';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { OrderingSystem } from '../../../../core/models/OrderingSystem';
import { Tag } from '../../../../core/models/Tag';
import { TagResponse, TagsListResponse } from '@survv/api/definitions/tags';
import { TagStatus } from '../../../../core/models/TagStatus';
import { TagType } from '../../../../core/models/TagType';
import { TaxTier } from '../../../../core/models/TaxTier';
import { Time } from '@survv/commons/core/models/Time';
import { UnifiedTag } from '../../../../core/models/UnifiedTag';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { createBackendUrl } from '@survv/commons/shell/backend/backend';
import { mapTaxTierResponseToTaxTier } from '../../tax-tiers/mappers/responses';

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

export function mapCataloguesVendorToProfileList(
  response: CataloguesVendorsListResponse
): VendorOnlineProfileList {
  const { metadata, vendors } = response;

  return new VendorOnlineProfileList({
    totalItemsCount: metadata.totalCount,
    items: vendors.map(
      ({
        cataloguesCount,
        branchCount,
        displayName,
        vendorId,
        active,
        posIntegrated,
        posIntegrationType,
      }) =>
        new VendorOnlineProfileListItem({
          cataloguesCount,
          branchesCount: branchCount,
          active,
          name: new MultilingualString(displayName),
          vendorId,
          logo: createImageUrl({
            refType: ImageRefType.VENDOR_ONLINE_PROFILE_LOGO,
            refId: vendorId,
          }),
          posIntegrated,
          posIntegrationType: new VendorPosIntegrationType(posIntegrationType),
        })
    ),
  });
}

export function mapVendorsToOpsProfileList(
  response: VendorsListResponse
): VendorOpsProfileList {
  const { metadata, vendors } = response;

  return new VendorOpsProfileList({
    totalItemsCount: metadata.totalCount,
    items: vendors.map(
      ({ id, label }) =>
        new VendorOpsProfileListItem({
          vendorId: id,
          name: label,
          logo: createImageUrl({
            refType: ImageRefType.VENDOR_OPS_LOGO,
            refId: id,
          }),
        })
    ),
  });
}

export function mapAlbumImageToUrl(imageId: EntityId): ImageUrlString {
  return createBackendUrl({
    url: '/api/v1/images/:imageId',
    params: { imageId },
  });
}

export function mapVendorProfileToOnlineProfile(
  vendorProfileResponse: ConsumerVendorProfileResponse,
  cataloguesListResponse: CataloguesListResponse,
  albumResponse: AlbumsResponse
): VendorOnlineProfile {
  const {
    id,
    displayName,
    description,
    languageSupport,
    taxStatus,
    minimumOrderValue,
    averagePrepTime,
    orderingHours,
    hashTags,
    tags,
    active,
    vendorUsers,
    activeBranchesCount,
    creationDate,
    branchCount,
    label,
    deliverBy,
    dispatchingModel,
    estimatedDeliveryTimeInMinutes,
    deliveryFees,
    fake,
    ledgerId,
    legalInfo,
    maxStackedOrders,
    stacking,
    orderingSystem,
    stackingWindowInMinutes,
    rating,
    transactionCount,
    type,
    posIntegrated,
    posIntegrationType,
  } = vendorProfileResponse;

  return new VendorOnlineProfile({
    ledgerId,
    label,
    active,
    fake,
    stacking,
    maxStackedOrders,
    transactionCount,
    rating,
    stackingWindowInMinutes,
    estimatedDeliveryTimeInMinutes,
    deliveryFees: new Money(deliveryFees),
    contactPeople: vendorUsers.map((user) => {
      return new ContactPerson({
        id: user.vendorUserId,
        fullName: user.fullName,
        mobileNo: user.mobileNo,
        title: user.title,
        email: user.email,
        creationDate: new Datetime(user.creationDate),
      });
    }),
    creationDate: new Datetime(creationDate),
    activeBranchesCount,
    branchesCount: branchCount,
    legalInfo: {
      companyName: legalInfo.companyName,
      companyAddress: legalInfo.companyAddress,
    },
    deliverBy: new DeliveryFleet(deliverBy),
    orderingSystem: new OrderingSystem(orderingSystem),
    dispatchingModel: new DispatchingModel(dispatchingModel),
    vendorType: new VendorType(type),
    vendorId: id,
    logo: createImageUrl({
      refId: id,
      refType: ImageRefType.VENDOR_ONLINE_PROFILE_LOGO,
    }),
    cover: createImageUrl({
      refId: id,
      refType: ImageRefType.VENDOR_ONLINE_PROFILE_COVER_PHOTO,
    }),
    name: new MultilingualString(displayName),
    description: new MultilingualString(description),
    languageSupport: new LanguageSupport(languageSupport),
    taxStatus: new VendorTaxStatusType(taxStatus || 'NOT_APPLICABLE'),
    minimumOrderValue: new Money(minimumOrderValue),
    averagePreparationTime: averagePrepTime,
    orderingHours: new HoursRange({
      from: new Time(orderingHours.from),
      to: new Time(orderingHours.to),
    }),
    tags: [
      ...hashTags.map(mapHashTagResponseToHashTag),
      ...tags.map(mapTagResponseToTag),
    ],
    catalogues: cataloguesListResponse.catalogues.map((catalogue) => ({
      id: catalogue.catalogueId,
      displayName: new MultilingualString(catalogue.displayName),
      status: new CatalogueStatus(catalogue.status),
    })),
    gallery: albumResponse.map(mapAlbumImageToUrl),
    posIntegrated,
    posIntegrationType: new VendorPosIntegrationType(posIntegrationType),
  });
}

export function mapVendorUserCreationResponseToContactPerson(
  response: VendorUserCreationResponse,
  form: ContactPersonForm
): ContactPerson {
  return new ContactPerson({
    id: response.vendorUserId,
    creationDate: new Datetime(response.creationDate),
    fullName: form.name,
    title: form.title,
    email: form.email,
    mobileNo: form.mobileNumber,
  });
}

export function mapTagsListToUnifiedTagsList(
  tagsList: TagsListResponse
): ItemsList<UnifiedTag> {
  return {
    totalItemsCount: tagsList.metadata.totalCount,
    items: tagsList.tags.map(mapTagResponseToTag),
  };
}

export function mapHashTagsListToUnifiedTagsList(
  hashTagsList: HashTagsListResponse
): ItemsList<UnifiedTag> {
  return {
    totalItemsCount: hashTagsList.metadata.totalCount,
    items: hashTagsList.hashTags.map(mapHashTagResponseToHashTag),
  };
}

export function mapTagsAndHashTagsToUnifiedTagsList(
  tagsList?: TagsListResponse,
  hashTagsList?: HashTagsListResponse
): ItemsList<UnifiedTag> {
  let totalHashTagsCount = 0;
  let totalTagsCount = 0;
  let items: UnifiedTag[] = [];
  if (tagsList) {
    const list = mapTagsListToUnifiedTagsList(tagsList);
    totalTagsCount = list.totalItemsCount;
    items = [...items, ...list.items];
  }
  if (hashTagsList) {
    const list = mapHashTagsListToUnifiedTagsList(hashTagsList);
    totalHashTagsCount = list.totalItemsCount;
    items = [...items, ...list.items];
  }
  return {
    totalItemsCount: totalTagsCount + totalHashTagsCount,
    items,
  };
}

export function mapBranchProfilesListResponseToBranchProfilesListItems(
  response: ConsumerVendorBranchProfileListResponse
): BranchProfileListItem[] {
  return response.branches.map(
    (branch) =>
      new BranchProfileListItem({
        id: branch.id,
        vendorId: branch.vendorId,
        displayName: new MultilingualString(branch.displayName),
        active: branch.active,
        hasCompleteProfile: true,
        label: branch.label,
        minimumOrderValue: new Money(branch.minimumOrderValue),
        orderingHours: {
          from: new Time(branch.orderingHours.from),
          to: new Time(branch.orderingHours.to),
        },
        avgBasketSize: new Money(branch.avgBasketSize),
      })
  );
}

export function mapCatalogueDetailsResponseToCatalogueDetails(
  catalogueDetailsResponse: CatalogueDetailsResponse
): Catalogue {
  return new Catalogue({
    id: catalogueDetailsResponse.catalogueId,
    displayName: new MultilingualString(catalogueDetailsResponse.displayName),
    description: new MultilingualString(catalogueDetailsResponse.description),
    status: new CatalogueStatus(catalogueDetailsResponse.status),
    catalogueSections: catalogueDetailsResponse.catalogueSections.map(
      (catalogueSection) =>
        new CatalogueSection({
          id: catalogueSection.catalogueSectionId,
          displayName: new MultilingualString(catalogueSection.displayName),
          taxTier: catalogueSection.vatTier
            ? mapTaxTierResponseToTaxTier(catalogueSection.vatTier)
            : new TaxTier(),
          creationDate: new Datetime(catalogueSection.creationDate),
          items: catalogueSection.items.map((item) => ({
            id: item.id,
            displayName: new MultilingualString(item.displayName),
            description: new MultilingualString(item.description),
            calories: item.calories,
            prepTime: item.prepTime,
            popular: item.popular,
            archived: item.archived,
            price: new Money(item.price),
            tags: [
              ...item.hashTags.map(mapHashTagResponseToHashTag),
              ...item.tags.map(mapTagResponseToTag),
            ],
            icon: createImageUrl({
              refType: ImageRefType.CATALOGUE_ITEM_COVER_IMAGE,
              refId: item.id,
            }),
          })),
        })
    ),
    publishedBranches: catalogueDetailsResponse.publishedBranches.map(
      (branch) => ({
        id: branch.id,
        displayName: new MultilingualString(branch.displayName),
      })
    ),
    orderingHours: new HoursRange({
      from: new Time(catalogueDetailsResponse.orderingHours.from),
      to: new Time(catalogueDetailsResponse.orderingHours.to),
    }),
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
