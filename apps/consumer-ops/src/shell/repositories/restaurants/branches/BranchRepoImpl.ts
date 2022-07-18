import { Branch, BranchProfileListItem } from '../../../../core/models/Branch';
import {
  BranchCreationRequest,
  BranchCreationResponse,
  BranchUpdateRequest,
  BranchUpdateResponse,
  ResetBranchRequest,
  ResetBranchResponse,
  RetrieveBranchCodeRequest,
  RetrieveBranchCodeResponse,
  VendorBranchProfileRequest,
  VendorBranchProfileResponse,
  VendorBranchesListingRequest,
  VendorBranchesListingResponse,
} from '@survv/api/definitions/branches';
import { BranchForm } from '../../../../core/models/BranchForm';
import { BranchRepo } from '../../../../core/repositories/branches/BranchRepo';
import {
  DisableStackingConfigurationsRequest,
  DisableStackingConfigurationsResponse,
  SetStackingConfigurationsRequest,
  SetStackingConfigurationsResponse,
} from '@survv/api/definitions/vendors';
import { EntityId } from '@survv/commons/core/types';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import {
  ListingQuery,
  filterOperators,
  queryMapper,
} from '@survv/commons/core/models/Query';
import {
  NetworkService,
  networkService,
} from '@survv/commons/shell/backend/networkService';
import {
  mapBranchResponseToBranchDetails,
  mapBranchesResponseToBranchesItemList,
  mapRetrieveBranchCodeResponseToBranchCodeString,
} from './mappers/responses';
import {
  mapBranchToBranchCreationRequest,
  mapBranchToBranchUpdateRequest,
} from './mappers/requests';

export class BranchRepoImpl implements BranchRepo {
  private readonly _networkService: NetworkService = networkService;

  public async listBranches(
    listingQuery: ListingQuery
  ): Promise<ItemsList<BranchProfileListItem>> {
    const beQuery = queryMapper({
      ...listingQuery,
      filterMap: {
        vendorId: {
          fieldName: 'vendorId',
          operator: filterOperators.EQUAL,
        },
        label: {
          fieldName: 'label',
          operator: filterOperators.EQUAL,
        },
      },
    });

    return mapBranchesResponseToBranchesItemList(
      await this._networkService.request<
        VendorBranchesListingRequest,
        VendorBranchesListingResponse
      >({
        requestLine: 'get /consumer/api/v1/branches',
        query: { query: beQuery },
      })
    );
  }

  public async getBranchDetails(branchId: EntityId): Promise<Branch> {
    return mapBranchResponseToBranchDetails(
      await this._networkService.request<
        VendorBranchProfileRequest,
        VendorBranchProfileResponse
      >({
        requestLine: 'get /consumer/api/v1/branches/:branchId',
        params: {
          branchId,
        },
      })
    );
  }

  public async createBranch(
    vendorId: EntityId,
    branchForm: BranchForm
  ): Promise<void> {
    await this._networkService.request<
      BranchCreationRequest,
      BranchCreationResponse
    >({
      requestLine: 'post /consumer/api/v1/vendors/:vendorId/branches',
      params: {
        vendorId,
      },
      body: mapBranchToBranchCreationRequest(branchForm),
    });
  }

  // eslint-disable-next-line max-params
  public async updateBranch(
    vendorId: EntityId,
    branchId: EntityId,
    branchForm: BranchForm,
    branchDetails: Branch
  ): Promise<void> {
    await this._networkService.request<
      BranchUpdateRequest,
      BranchUpdateResponse
    >({
      requestLine: 'put /consumer/api/v1/branches/:branchId',
      params: {
        branchId,
      },
      body: mapBranchToBranchUpdateRequest(vendorId, branchForm, branchDetails),
    });
  }

  async setStackingConfigurations(
    branchId: EntityId,
    maxStackedOrders: number,
    stackingWindowInMinutes: number
  ): Promise<void> {
    await this._networkService.request<
      SetStackingConfigurationsRequest,
      SetStackingConfigurationsResponse
    >({
      requestLine: 'patch /consumer/api/v1/branches/:branchId/stacking',
      params: { branchId },
      body: {
        maxStackedOrders,
        stackingWindowInMinutes,
      },
    });
  }

  async disableStacking(branchId: EntityId): Promise<void> {
    await this._networkService.request<
      DisableStackingConfigurationsRequest,
      DisableStackingConfigurationsResponse
    >({
      requestLine: 'patch /api/v1/branches/:branchId/stacking/disable',
      params: { branchId },
    });
  }

  async resetBranchCode(branchId: EntityId): Promise<void> {
    await this._networkService.request<ResetBranchRequest, ResetBranchResponse>(
      {
        requestLine: 'post /api/v1/branches/:branchId/code-reset',
        params: { branchId },
      }
    );
  }

  async retrieveBranchCode(branchId: EntityId): Promise<string> {
    return mapRetrieveBranchCodeResponseToBranchCodeString(
      await this._networkService.request<
        RetrieveBranchCodeRequest,
        RetrieveBranchCodeResponse
      >({
        requestLine: 'get /api/v1/branches/:branchId/code',
        params: { branchId },
      })
    );
  }
}
