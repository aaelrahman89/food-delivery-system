import { Address } from '@survv/commons/core/models/Address';
import {
  Branch,
  BranchProfileListItem,
} from '../../../../../core/models/Branch';
import { BranchB2CStatus } from '@survv/commons/core/models/BranchB2CStatus';
import { ContactPerson } from '../../../../../core/models/ContactPerson';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { HashTag } from '../../../../../core/models/HashTag';
import { HashTagStatus } from '../../../../../core/models/HashTagStatus';
import { HoursRange } from '@survv/commons/core/models/HoursRange';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { Money } from '@survv/commons/core/models/money';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import {
  RetrieveBranchCodeResponse,
  VendorBranchProfileResponse,
  VendorBranchesListingResponse,
} from '@survv/api/definitions/branches';
import { Tag } from '../../../../../core/models/Tag';
import { TagStatus } from '../../../../../core/models/TagStatus';
import { TagType } from '../../../../../core/models/TagType';
import { Time } from '@survv/commons/core/models/Time';
import { VendorType } from '@survv/commons/core/models/VendorType';

export function mapBranchesResponseToBranchesItemList(
  response: VendorBranchesListingResponse
): ItemsList<BranchProfileListItem> {
  return {
    totalItemsCount: response.metadata.totalCount,
    items: response.branches.map((branchProfileListItem) => {
      return new BranchProfileListItem({
        id: branchProfileListItem.id,
        vendorId: branchProfileListItem.vendorId,
        active: branchProfileListItem.active,
        label: branchProfileListItem.label,
        minimumOrderValue: new Money(),
        orderingHours: new HoursRange({
          from: new Time(branchProfileListItem.orderingHours.from),
          to: new Time(branchProfileListItem.orderingHours.to),
        }),
        avgBasketSize: new Money(),
        displayName: new MultilingualString(branchProfileListItem.displayName),
        hasCompleteProfile: false,
        posIntegrated: branchProfileListItem.posIntegrated,
        posIntegrationType: branchProfileListItem.posIntegrationType,
      });
    }),
  };
}

export function mapBranchResponseToBranchDetails(
  response: VendorBranchProfileResponse
): Branch {
  return new Branch({
    id: response.id,
    vendorId: response.vendorId,
    hubId: response.hubId,
    label: response.label,
    minimumOrderValue: response.minimumOrderValue,
    active: response.active,
    vendorName: response.vendorName,
    vendorType: new VendorType(response.vendorType),
    displayName: new MultilingualString(response.displayName),
    avgTransactionPerMonth: response.avgTransactionPerMonth,
    avgTransactionPerDay: response.avgTransactionPerDay,
    avgTransactionPerHour: response.avgTransactionPerHour,
    creationDate: new Datetime(response.creationDate),
    contactPersons: response.contactPersons.map((contactPerson) => {
      return new ContactPerson({
        fullName: contactPerson.fullName,
        mobileNo: contactPerson.mobileNo,
        email: contactPerson.email,
        title: contactPerson.title,
        creationDate: new Datetime(contactPerson.creationDate),
      });
    }),
    rushHours: response.rushHour.map((rushHour) => {
      return new HoursRange({
        from: new Time(rushHour.from),
        to: new Time(rushHour.to),
      });
    }),
    orderingHours: new HoursRange({
      from: new Time(response.orderingHours.from),
      to: new Time(response.orderingHours.to),
    }),
    notificationToken: response.notificationToken,
    notificationSubscription: response.notificationSubscription,
    tags: response.tags.map((tag) => {
      return new Tag({
        id: tag.id,
        name: new MultilingualString(tag.title),
        vendorType: new VendorType(tag.vendorType),
        type: new TagType(tag.type),
        status: new TagStatus(tag.status),
        icon: tag.icon || '',
        creationDate: new Datetime(tag.creationDate),
      });
    }),
    hashTags: response.hashTags.map((tag) => {
      return new HashTag({
        id: tag.id,
        name: new MultilingualString(tag.title),
        vendorType: new VendorType(tag.vendorType),
        status: new HashTagStatus(tag.status),
        creationDate: new Datetime(tag.creationDate),
      });
    }),
    b2cStatus: new BranchB2CStatus(response.b2cStatus),
    avgBasketSize: response.avgBasketSize.amount,
    deliveryFees: new Money(response.deliveryFees),
    stacking: response.stacking,
    maxStackedOrders: response.maxStackedOrders,
    stackingWindowInMinutes: response.stackingWindowInMinutes,
    address: new Address({
      countryId: response.address.countryId,
      cityId: response.address.cityId,
      areaId: response.address.areaId,
      coordinates: [
        response.address.geoLocation.longitude,
        response.address.geoLocation.latitude,
      ],
      street: response.address.street,
      building: response.address.building,
      floor: response.address.floor,
      apartment: response.address.apartmentNo,
      companyName: response.address.companyName,
      landmark: response.address.landmark,
    }),
    posIntegrated: response.posIntegrated,
    posIntegrationType: response.posIntegrationType,
  });
}

export function mapRetrieveBranchCodeResponseToBranchCodeString(
  response: RetrieveBranchCodeResponse
): string {
  return response.code;
}
