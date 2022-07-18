import { EntityId } from '@survv/commons/core/types';
import {
  FilterSpec,
  FilterSpecElement,
  QuerySpec,
  filterOperators,
} from '@survv/commons/core/models/Query';
import {
  NetworkService,
  networkService,
} from '@survv/commons/shell/backend/networkService';
import {
  VendorOnlineProfile,
  VendorOnlineProfileForm,
  VendorOnlineProfileList,
  VendorOpsProfileList,
} from '../../../core/models/VendorOnlineProfile';

import { AlbumsRequest, AlbumsResponse } from '@survv/api/definitions/albums';
import { Base64EncodedFile } from '@survv/commons/core/models/Files';
import { CataloguesListResponse } from '@survv/api/definitions/catalogues';
import { CataloguesVendorsListResponse } from '@survv/api/definitions/catalogues-vendors';
import {
  ConsumerVendorCreationRequest,
  ConsumerVendorCreationResponse,
  ConsumerVendorProfileResponse,
  ConsumerVendorUpdateRequest,
  ConsumerVendorUpdateResponse,
  DeleteVendorUserRequest,
  DeleteVendorUserResponse,
  DisableVendorStackingRequest,
  DisableVendorStackingResponse,
  SetVendorStackingRequest,
  SetVendorStackingResponse,
  VendorUserCreationRequest,
  VendorUserCreationResponse,
  VendorsListRequest,
  VendorsListResponse,
  VendorsUntaxedCatalogueListRequest,
  VendorsUntaxedCatalogueListResponse,
} from '@survv/api/definitions/vendors';
import {
  ImageCreationRequest,
  ImageCreationResponse,
  ImageMimeType,
  ImageReferenceType,
} from '@survv/api/definitions/images';
import { ImageRefType } from '@survv/commons/core/models/Images';
import { UntaxedCatalogue } from '../../../core/models/Catalogue';
import { VendorOnlineProfileRepo } from '../../../core/repositories/VendorOnlineProfileRepo';
import { isEmpty } from '@survv/commons/core/utils/checks';

import {
  ContactPerson,
  ContactPersonForm,
} from '../../../core/models/ContactPerson';
import { VendorStackingConfigurationForm } from '../../../core/models/VendorStackingConfiguration';
import {
  mapCataloguesVendorToProfileList,
  mapVendorProfileToOnlineProfile,
  mapVendorUserCreationResponseToContactPerson,
  mapVendorsToOpsProfileList,
} from './mappers/responses';
import {
  mapVendorOnlineProfileFormToCreationRequest,
  mapVendorOnlineProfileFormToUpdateRequest,
} from './mappers/requests';
import { uploadGallery } from './GalleryUploader';

function isCatalogueFilter(element: FilterSpecElement): boolean {
  return element.field.startsWith('catalogue');
}
function isNotCatalogueFilter(element: FilterSpecElement): boolean {
  return !isCatalogueFilter(element);
}
function extractCatalogueFilter(query?: QuerySpec): FilterSpec | undefined {
  const catalogueFilterElements = query?.filter?.elements
    .filter(isCatalogueFilter)
    .map((element) => {
      const field = element.field.replace('catalogue', '');
      return {
        ...element,
        field: field.charAt(0).toLowerCase() + field.substring(1),
      };
    });

  if (isEmpty(catalogueFilterElements)) {
    return undefined;
  }

  return {
    elements: catalogueFilterElements!,
  };
}
function extractVendorQuery(query?: QuerySpec): QuerySpec | undefined {
  const filterElements = query?.filter?.elements.filter(isNotCatalogueFilter);

  const queryCopy: QuerySpec = { ...query };

  if (isEmpty(filterElements)) {
    delete queryCopy.filter;
    if (Object.keys(queryCopy).length === 1) {
      return undefined;
    }
    return queryCopy;
  }

  queryCopy.filter = { elements: filterElements! };

  return queryCopy;
}

export class VendorOnlineProfileRepoImpl implements VendorOnlineProfileRepo {
  private readonly _networkService: NetworkService;
  constructor() {
    this._networkService = networkService;
  }

  async getProfile(
    vendorOnlineProfileId: EntityId
  ): Promise<VendorOnlineProfile> {
    const vendorProfileResponse = await this._networkService.request<
      undefined,
      ConsumerVendorProfileResponse
    >({
      requestLine: 'get /consumer/api/v1/vendors/:vendorId',
      params: { vendorId: vendorOnlineProfileId },
    });
    const catalogueQuerySpec: QuerySpec = {
      vgql: 'v1',
      filter: {
        elements: [
          {
            field: 'vendor.id',
            operator: filterOperators.EQUAL,
            value: vendorOnlineProfileId,
          },
        ],
      },
    };

    const cataloguesResponse = await this._networkService.request<
      undefined,
      CataloguesListResponse
    >({
      requestLine: 'get /api/v1/catalogues',
      query: { query: catalogueQuerySpec },
    });

    const albumResponse = await this._networkService.request<
      AlbumsRequest,
      AlbumsResponse
    >({
      requestLine: 'get /api/v1/albums',
      query: {
        referenceId: vendorOnlineProfileId,
        referenceType:
          ImageRefType.VENDOR_ONLINE_PROFILE_GALLERY_IMAGE.valueOf(),
      },
    });

    return mapVendorProfileToOnlineProfile(
      vendorProfileResponse,
      cataloguesResponse,
      albumResponse
    );
  }

  async listProfiles(query?: QuerySpec): Promise<VendorOnlineProfileList> {
    return mapCataloguesVendorToProfileList(
      await this._networkService.request<
        undefined,
        CataloguesVendorsListResponse
      >({
        requestLine: 'get /consumer/api/v1/vendors-catalogues',
        query: {
          vendorQuery: extractVendorQuery(query),
          catalogueFilter: extractCatalogueFilter(query),
        },
      })
    );
  }

  async listOpsProfiles(query?: QuerySpec): Promise<VendorOpsProfileList> {
    return mapVendorsToOpsProfileList(
      await this._networkService.request<
        VendorsListRequest,
        VendorsListResponse
      >({
        requestLine: 'get /api/v1.1/vendors',
        query: { query },
      })
    );
  }

  async createProfile(form: VendorOnlineProfileForm): Promise<void> {
    const { id: vendorId } = await this._networkService.request<
      ConsumerVendorCreationRequest,
      ConsumerVendorCreationResponse
    >({
      requestLine: 'post /consumer/api/v1/vendors',
      headers: undefined,
      body: mapVendorOnlineProfileFormToCreationRequest(form),
    });
    await this._handleImages(vendorId, form);
  }

  async updateProfile(
    vendorId: EntityId,
    form: VendorOnlineProfileForm
  ): Promise<void> {
    await this._networkService.request<
      ConsumerVendorUpdateRequest,
      ConsumerVendorUpdateResponse
    >({
      requestLine: 'put /consumer/api/v1/vendors/:vendorId',
      params: { vendorId },
      headers: undefined,
      body: mapVendorOnlineProfileFormToUpdateRequest(form),
    });
    await this._handleImages(vendorId, form);
  }

  private async _handleImages(
    vendorId: number,
    form: VendorOnlineProfileForm
  ): Promise<void> {
    if (form.logo instanceof Base64EncodedFile) {
      await this._networkService.request<
        ImageCreationRequest,
        ImageCreationResponse
      >({
        requestLine: 'post /api/v1/files',
        body: {
          referenceId: vendorId,
          referenceType:
            ImageRefType.VENDOR_ONLINE_PROFILE_LOGO.valueOf() as ImageReferenceType,
          payload: form.logo.base64String,
          mimeType: form.logo.type as ImageMimeType,
          append: false,
        },
      });

      await this._networkService.request<
        ImageCreationRequest,
        ImageCreationResponse
      >({
        requestLine: 'post /api/v1/files',
        body: {
          referenceId: vendorId,
          referenceType:
            ImageRefType.VENDOR_OPS_LOGO.valueOf() as ImageReferenceType,
          payload: form.logo.base64String,
          mimeType: form.logo.type as ImageMimeType,
          append: false,
        },
      });
    }

    await uploadGallery({
      entityId: vendorId,
      coverPhotoRefType: ImageRefType.VENDOR_ONLINE_PROFILE_COVER_PHOTO,
      albumImageRefType: ImageRefType.VENDOR_ONLINE_PROFILE_GALLERY_IMAGE,
      newGallery: form.gallery,
      oldGallery: form.defaults.gallery,
      newCoverPhoto: form.coverPhoto,
      oldCoverPhoto: form.defaults.coverPhoto,
    });
  }

  async checkUntaxedCatalogues(
    vendorId: EntityId,
    vendorTaxStatus: string
  ): Promise<UntaxedCatalogue[]> {
    return (
      await this._networkService.request<
        VendorsUntaxedCatalogueListRequest,
        VendorsUntaxedCatalogueListResponse
      >({
        requestLine:
          'get /api/v1/catalogues/vendors/:vendorId/untaxed-catalogues',
        params: { vendorId },
        query: {
          taxStatus: vendorTaxStatus,
        },
      })
    ).catalogues;
  }

  async addVendorUser(
    vendorId: EntityId,
    vendorUserForm: ContactPersonForm,
    isCallCenterVendor: boolean
  ): Promise<ContactPerson> {
    return mapVendorUserCreationResponseToContactPerson(
      await this._networkService.request<
        VendorUserCreationRequest,
        VendorUserCreationResponse
      >({
        requestLine: 'post /consumer/api/v1/vendor-users',
        body: {
          vendorId,
          name: vendorUserForm.name,
          title: vendorUserForm.title,
          mobileNo: vendorUserForm.mobileNumber,
          email: vendorUserForm.email,
          roles: isCallCenterVendor
            ? ['VendorCallCenterSuperAdmin']
            : undefined,
        },
      }),
      vendorUserForm
    );
  }

  async deleteVendorUser(vendorUserId: EntityId): Promise<void> {
    await this._networkService.request<
      DeleteVendorUserRequest,
      DeleteVendorUserResponse
    >({
      requestLine: 'delete /consumer/api/v1/vendor-users/:vendorUserId',
      params: { vendorUserId },
    });
  }

  async setVendorStacking(
    vendorId: EntityId,
    stackingConfigurationForm: VendorStackingConfigurationForm
  ): Promise<void> {
    await this._networkService.request<
      SetVendorStackingRequest,
      SetVendorStackingResponse
    >({
      requestLine: 'patch /consumer/api/v1/vendors/:vendorId/stacking',
      params: { vendorId },
      body: {
        stackingWindowInMinutes:
          stackingConfigurationForm.stackingWindowInMinutes,
        maxStackedOrders: stackingConfigurationForm.maxStackedOrders,
      },
    });
  }

  async disableVendorStacking(vendorId: EntityId): Promise<void> {
    await this._networkService.request<
      DisableVendorStackingRequest,
      DisableVendorStackingResponse
    >({
      requestLine: 'patch /consumer/api/v1/vendors/:vendorId/stacking/disable',
      params: { vendorId },
    });
  }
}
