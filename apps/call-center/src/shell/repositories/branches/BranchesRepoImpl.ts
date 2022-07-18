import { Branch } from '../../../core/models/Branch';
import {
  BranchB2CStatus,
  ConsumerB2CBranchesListRequest,
  ConsumerB2CBranchesListResponse,
  SetBranchB2CStatusRequest,
  SetBranchB2CStatusResponse,
} from '@survv/api/definitions/branches';
import { BranchesRepo } from '../../../core/repositories/BranchesRepo';
import {
  ListingQuery,
  filterOperators,
  queryMapper,
} from '@survv/commons/core/models/Query';
import {
  NetworkService,
  networkService,
} from '@survv/commons/shell/backend/networkService';
import { kvStorage } from '@survv/pwa/shell/kv-storage-impl';
import { mapBranchesListV2ResponseToBranches } from './mappers/responses';

export class BranchesRepoImpl implements BranchesRepo {
  private _networkService: NetworkService = networkService;

  async listBranches(query?: ListingQuery): Promise<Branch[]> {
    const vendorId = Number(await kvStorage.getItem('vendor-id'));
    const beQuery = queryMapper({
      ...query,
      filterMap: {
        branchLabel: {
          fieldName: 'label',
          operator: filterOperators.REGEX,
        },
        vendorId: {
          fieldName: 'vendorId',
          operator: filterOperators.EQUAL,
        },
        statuses: {
          fieldName: 'b2cStatus',
          operator: filterOperators.IN,
        },
      },
      filter: {
        ...query?.filter,
        vendorId,
      },
    });

    return mapBranchesListV2ResponseToBranches(
      await this._networkService.request<
        ConsumerB2CBranchesListRequest,
        ConsumerB2CBranchesListResponse
      >({
        requestLine: 'get /consumer/api/v1/b2c-branches',
        query: { query: beQuery },
      })
    );
  }

  async updateBranchStatus(branchId: number, status: string): Promise<void> {
    await this._networkService.request<
      SetBranchB2CStatusRequest,
      SetBranchB2CStatusResponse
    >({
      requestLine: 'post /consumer/api/v1/branches/:branchId/b2c-status',
      params: { branchId },
      body: { b2cStatus: status as BranchB2CStatus },
    });
  }
}
