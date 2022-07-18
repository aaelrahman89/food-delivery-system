import { Branch } from '../../../../../core/models/Branch';
import {
  BranchCreationRequest,
  BranchUpdateRequest,
} from '@survv/api/definitions/branches';
import { BranchForm } from '../../../../../core/models/BranchForm';
import { EntityId } from '@survv/commons/core/types';
import { TagType } from '../../../../../core/models/TagType';

export function mapBranchToBranchCreationRequest(
  branchForm: BranchForm
): BranchCreationRequest {
  return {
    label: branchForm.label,
    address: {
      countryId: branchForm.address.countryId,
      cityId: branchForm.address.cityId,
      areaId: branchForm.address.areaId,
      street: branchForm.address.street,
      building: branchForm.address.building,
      floor: 0,
      apartmentNo: '',
      companyName: '',
      landmark: '',
      geoLocation: {
        latitude: branchForm.address.coordinates[1],
        longitude: branchForm.address.coordinates[0],
      },
    },
    contactPersons: branchForm.contactPersons.map((person) => {
      return {
        fullName: person.fullName,
        mobileNo: person.mobileNo,
        email: person.email,
        title: person.title,
      };
    }),
    orderingHours: {
      from: branchForm.opensAt.valueOf(),
      to: branchForm.closesAt.valueOf(),
    },
    active: branchForm.active,
    displayName: branchForm.displayName,
    minimumOrderValue: {
      amount: branchForm.minimumOrderValue,
      currency: 'EGP',
    },
    avgBasketSize: branchForm.averageBasketSize,
    deliveryFees: branchForm.deliveryFees,
    tagIds: branchForm.tags
      .filter((tag) => {
        return !tag.type.equals(TagType.HASH_TAG);
      })
      .map((tag) => {
        return tag.id;
      }),
    hashTagIds: branchForm.tags
      .filter((tag) => {
        return tag.type.equals(TagType.HASH_TAG);
      })
      .map((tag) => {
        return tag.id;
      }),
    posIntegrated: branchForm.posIntegrated,
    posIntegrationType: branchForm.posIntegrationType,
  };
}

export function mapBranchToBranchUpdateRequest(
  vendorId: EntityId,
  branchForm: BranchForm,
  branchDetails: Branch
): BranchUpdateRequest {
  return {
    vendorId,
    hubId: branchDetails.hubId,
    label: branchForm.label,
    address: {
      countryId: branchForm.address.countryId,
      cityId: branchForm.address.cityId,
      areaId: branchForm.address.areaId,
      street: branchForm.address.street,
      building: branchForm.address.building,
      floor: 0,
      apartmentNo: '',
      companyName: '',
      landmark: '',
      geoLocation: {
        latitude: branchForm.address.coordinates[1],
        longitude: branchForm.address.coordinates[0],
      },
    },
    contactPersons: branchForm.contactPersons.map((person) => {
      return {
        fullName: person.fullName,
        mobileNo: person.mobileNo,
        email: person.email,
        title: person.title,
      };
    }),
    avgTransactionPerMonth: branchDetails.avgTransactionPerMonth,
    avgTransactionPerDay: branchDetails.avgTransactionPerDay,
    avgTransactionPerHour: branchDetails.avgTransactionPerHour,
    rushHours: branchDetails.rushHours.map((rushHour) => {
      return {
        from: rushHour.from.valueOf(),
        to: rushHour.to.valueOf(),
      };
    }),
    orderingHours: {
      from: branchForm.opensAt.valueOf(),
      to: branchForm.closesAt.valueOf(),
    },
    active: branchForm.active,
    displayName: branchForm.displayName,
    minimumOrderValue: {
      amount: branchForm.minimumOrderValue,
      currency: 'EGP',
    },
    avgBasketSize: branchForm.averageBasketSize,
    deliveryFees: branchForm.deliveryFees,
    tagIds: branchForm.tags
      .filter((tag) => {
        return !tag.type.equals(TagType.HASH_TAG);
      })
      .map((tag) => {
        return tag.id;
      }),
    hashTagIds: branchForm.tags
      .filter((tag) => {
        return tag.type.equals(TagType.HASH_TAG);
      })
      .map((tag) => {
        return tag.id;
      }),
    posIntegrated: branchForm.posIntegrated,
    posIntegrationType: branchForm.posIntegrationType,
  };
}
