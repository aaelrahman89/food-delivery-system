import {
  ArrangeCatalogueSectionItemsRequest,
  ArrangeCatalogueSectionsRequest,
  CatalogueCreationRequest,
  CatalogueItemCreationRequest,
  CatalogueSectionCreationRequest,
  CatalogueUpdateRequest,
  UpdateCatalogueBranchesRequest,
} from '@survv/api/definitions/catalogues';
import { BranchProfileListItem } from '../../../../core/models/Branch';
import {
  CatalogueForm,
  CatalogueSection,
  CatalogueSectionItem,
} from '../../../../core/models/Catalogue';
import { CatalogueItemForm } from '../../../../core/models/CatalogueItem';
import { CatalogueSectionForm } from '../../../../core/models/CatalogueSection';

import { EntityId } from '@survv/commons/core/types';

import {
  ConsumerVendorCreationRequest,
  ConsumerVendorUpdateRequest,
  DeliveryFleet,
  DispatchingModel,
  OrderingSystem,
  VendorTaxStatus,
  VendorUser,
} from '@survv/api/definitions/vendors';
import { TagType } from '../../../../core/models/TagType';
import { VendorOnlineProfileForm } from '../../../../core/models/VendorOnlineProfile';
import { VendorType } from '@survv/api/definitions/common';

export function mapVendorOnlineProfileFormToCreationRequest(
  profileForm: VendorOnlineProfileForm
): ConsumerVendorCreationRequest {
  return {
    label: profileForm.label,
    legalInfo: {
      companyName: profileForm.legalInfo.companyName,
      companyAddress: profileForm.legalInfo.companyAddress,
    },
    active: profileForm.active,
    fake: profileForm.fakeVendor,
    type: profileForm.vendorType as VendorType,
    vendorUsers: profileForm.contactPeople.map((contactPerson) => {
      return {
        fullName: contactPerson.fullName,
        email: contactPerson.email,
        title: contactPerson.title,
        mobileNo: contactPerson.mobileNo,
      } as VendorUser;
    }),
    orderingSystem: profileForm.orderingSystem as OrderingSystem,
    deliverBy: profileForm.deliverBy.valueOf() as DeliveryFleet,
    dispatchingModel:
      profileForm.dispatchingModel.valueOf() as DispatchingModel,
    estimatedDeliveryTimeInMinutes: profileForm.estimatedDeliveryTimeInMinutes,
    deliveryFees: profileForm.deliveryFees,
    languageSupport: profileForm.languageSupport,
    displayName: {
      en: profileForm.name.en,
      ar: profileForm.name.ar,
    },
    description: {
      en: profileForm.description.en,
      ar: profileForm.description.ar,
    },
    taxStatus: profileForm.taxStatus as VendorTaxStatus,
    minimumOrderValue: {
      amount: profileForm.minimumOrderValue,
      currency: 'EGP',
    },
    averagePrepTime: profileForm.averagePreparationTime,
    orderingHours: {
      from: profileForm.orderingHours.from.valueOf(),
      to: profileForm.orderingHours.to.valueOf(),
    },
    hashTagIds: profileForm.tags
      .filter((tag) => TagType.HASH_TAG.equals(tag.type))
      .map((hashTag) => hashTag.id),
    tagIds: profileForm.tags
      .filter((tag) => TagType.HASH_TAG.notEqual(tag.type))
      .map((tag) => tag.id),
    posIntegrated: profileForm.posIntegrated,
    posIntegrationType: profileForm.posIntegrationType,
  };
}

export function mapCatalogueItemFormToCreationRequest(
  itemForm: CatalogueItemForm
): CatalogueItemCreationRequest {
  return {
    displayName: {
      en: itemForm.displayName.en,
      ar: itemForm.displayName.ar,
    },
    description: {
      en: itemForm.description.en,
      ar: itemForm.description.ar,
    },
    calories: itemForm.calories,
    prepTime: itemForm.prepTime,
    price: itemForm.price,
    catalogueSectionIds: itemForm.catalogueSections.map(
      (catalogue) => catalogue.id
    ),
    tagIds: [
      ...itemForm.tags.filter((tag) => TagType.HASH_TAG.notEqual(tag.type)),
      ...itemForm.allergies,
    ].map((tag) => tag.id),
    hashTagIds: itemForm.tags
      .filter((hashTag) => TagType.HASH_TAG.equals(hashTag.type))
      .map((hashTag) => hashTag.id),
  };
}

export function mapCatalogueFormToCatalogueCreationRequest(
  vendorId: EntityId,
  catalogueCreation: CatalogueForm
): CatalogueCreationRequest {
  return {
    vendorId,
    displayName: {
      en: catalogueCreation.displayName.en ?? '',
      ar: catalogueCreation.displayName.ar ?? '',
    },
    description: {
      en: catalogueCreation.description.en ?? '',
      ar: catalogueCreation.description.ar ?? '',
    },
    orderingHours: {
      from: catalogueCreation.orderingHours.from.valueOf(),
      to: catalogueCreation.orderingHours.to.valueOf(),
    },
    branchIds: catalogueCreation.branches.map(
      (branch: BranchProfileListItem) => branch.id
    ),
  };
}

export function mapCatalogueFormToCatalogueUpdateRequest(
  catalogueCreation: CatalogueForm
): CatalogueUpdateRequest {
  return {
    displayName: catalogueCreation.displayName,
    description: catalogueCreation.description,
    orderingHours: {
      from: catalogueCreation.orderingHours.from.valueOf(),
      to: catalogueCreation.orderingHours.to.valueOf(),
    },
    branchIds: catalogueCreation.branches.map(
      (branch: BranchProfileListItem) => branch.id
    ),
  };
}

export function mapVendorOnlineProfileFormToUpdateRequest(
  profileForm: VendorOnlineProfileForm
): ConsumerVendorUpdateRequest {
  return {
    languageSupport: profileForm.languageSupport,
    label: profileForm.label,
    legalInfo: {
      companyName: profileForm.legalInfo.companyName,
      companyAddress: profileForm.legalInfo.companyAddress,
    },
    active: profileForm.active,
    fake: profileForm.fakeVendor,
    type: profileForm.vendorType as VendorType,
    orderingSystem: profileForm.orderingSystem as OrderingSystem,
    deliverBy: profileForm.deliverBy.valueOf() as DeliveryFleet,
    dispatchingModel:
      profileForm.dispatchingModel.valueOf() as DispatchingModel,
    estimatedDeliveryTimeInMinutes: profileForm.estimatedDeliveryTimeInMinutes,
    deliveryFees: profileForm.deliveryFees,
    displayName: {
      en: profileForm.name.en,
      ar: profileForm.name.ar,
    },
    description: {
      en: profileForm.description.en,
      ar: profileForm.description.ar,
    },
    taxStatus: profileForm.taxStatus as VendorTaxStatus,
    minimumOrderValue: {
      amount: profileForm.minimumOrderValue,
      currency: 'EGP',
    },
    averagePrepTime: profileForm.averagePreparationTime,
    orderingHours: {
      from: profileForm.orderingHours.from.valueOf(),
      to: profileForm.orderingHours.to.valueOf(),
    },
    hashTagIds: profileForm.tags
      .filter((tag) => TagType.HASH_TAG.equals(tag.type))
      .map((hashTag) => hashTag.id),
    tagIds: profileForm.tags
      .filter((tag) => TagType.HASH_TAG.notEqual(tag.type))
      .map((tag) => tag.id),
    posIntegrated: profileForm.posIntegrated,
    posIntegrationType: profileForm.posIntegrationType,
  };
}

export function mapCatalogueSectionFormToCatalogueSectionCreationRequest(
  catalogueSectionForm: CatalogueSectionForm
): CatalogueSectionCreationRequest {
  return {
    displayName: catalogueSectionForm.displayName,
    vatTierId: catalogueSectionForm.taxTierId,
  };
}

export function mapCatalogueSectionFormToCatalogueSectionUpdateRequest(
  catalogueSectionForm: CatalogueSectionForm
): CatalogueSectionCreationRequest {
  return {
    displayName: catalogueSectionForm.displayName,
    vatTierId: catalogueSectionForm.taxTierId,
  };
}

export function mapCatalogueSectionsToArrangeCatalogueSectionsRequest(
  catalogueSections: CatalogueSection[]
): ArrangeCatalogueSectionsRequest {
  return { sections: catalogueSections.map((section) => section.id) };
}

export function mapCatalogueSectionItemsToArrangeCatalogueSectionsRequest(
  catalogueSectionItems: CatalogueSectionItem[]
): ArrangeCatalogueSectionItemsRequest {
  return {
    sectionItems: catalogueSectionItems.map((item) => item.id),
  };
}

export function mapBranchProfileListItemsToBranchIds(
  branches: BranchProfileListItem[]
): UpdateCatalogueBranchesRequest {
  return {
    branchIds: branches.map((branch) => branch.id),
  };
}
