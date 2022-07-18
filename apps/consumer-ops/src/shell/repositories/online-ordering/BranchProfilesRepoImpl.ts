import { BranchProfileListItem } from '../../../core/models/Branch';

import { BranchProfilesRepo } from '../../../core/repositories/BranchProfilesRepo';
import { ConsumerVendorBranchProfileListResponse } from '@survv/api/definitions/vendors';
import { EntityId } from '@survv/commons/core/types';
import {
  NetworkService,
  networkService,
} from '@survv/commons/shell/backend/networkService';
import { mapBranchProfilesListResponseToBranchProfilesListItems } from './mappers/responses';

export class BranchProfilesRepoImpl implements BranchProfilesRepo {
  private readonly _networkService: NetworkService;

  constructor(
    options = {
      networkService,
    }
  ) {
    this._networkService = options.networkService;
  }

  async listCompletedProfiles(
    vendorId: EntityId
  ): Promise<BranchProfileListItem[]> {
    return mapBranchProfilesListResponseToBranchProfilesListItems(
      await this._networkService.request<
        undefined,
        ConsumerVendorBranchProfileListResponse
      >({
        requestLine: 'get /consumer/api/v1/vendors/:vendorId/branches-profile',
        params: { vendorId },
      })
    );
  }
}
