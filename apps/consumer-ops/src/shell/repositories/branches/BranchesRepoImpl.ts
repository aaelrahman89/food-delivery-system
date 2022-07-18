import { BottomSheetListGroup } from '@survv/commons/core/models/ItemsList';
import { Branch, CampaignBranch } from '../../../core/models/Branch';
import {
  BranchesListV2Request,
  BranchesListV2Response,
  ConsumerB2CBranchesListRequest,
  ConsumerB2CBranchesListResponse,
} from '@survv/api/definitions/branches';
import { BranchesRepo } from '../../../core/repositories/BranchesRepo';
import {
  CampaignBranchesListRequest,
  CampaignBranchesListResponse,
} from '@survv/api/definitions/campaigns';
import { EntityId } from '@survv/commons/core/types';
import {
  NetworkService,
  networkService,
} from '@survv/commons/shell/backend/networkService';
import {
  mapBranchesListResponseToCampaignBranchesBottomSheetListGroup,
  mapBranchesListV2ResponseBranchesToBranchList,
  mapBranchesListV2ResponseToBranches,
  mapBranchesListV2ResponseToBranchesBottomSheetListGroup,
} from './mappers/responses';

export class BranchesRepoImpl implements BranchesRepo {
  private _networkService: NetworkService = networkService;

  async listAllBranches(): Promise<Branch[]> {
    let skip;
    let response = await this._networkService.request<
      BranchesListV2Request,
      BranchesListV2Response
    >({
      requestLine: 'get /api/v1.1/branches',
    });
    const fetchedBranches =
      mapBranchesListV2ResponseBranchesToBranchList(response);
    skip = response.metadata.totalReturned;

    while (fetchedBranches.length < response.metadata.totalCount) {
      // eslint-disable-next-line no-await-in-loop
      response = await this._networkService.request<
        BranchesListV2Request,
        BranchesListV2Response
      >({
        requestLine: 'get /api/v1.1/branches',
        query: {
          query: {
            vgql: 'v1',
            skip,
          },
        },
      });
      fetchedBranches.push(
        ...mapBranchesListV2ResponseBranchesToBranchList(response)
      );
      skip += response.metadata.totalReturned;
    }

    return fetchedBranches;
  }

  async listVendorBranches(vendorId: EntityId): Promise<Branch[]> {
    return mapBranchesListV2ResponseToBranches(
      await this._networkService.request<
        ConsumerB2CBranchesListRequest,
        ConsumerB2CBranchesListResponse
      >({
        requestLine: 'get /consumer/api/v1/b2c-branches',
        query: {
          query: {
            vgql: 'v1',
            filter: {
              elements: [
                { field: 'vendorId', operator: 'in', value: vendorId },
              ],
            },
          },
        },
      })
    );
  }

  async listBranchesBottomSheetListGroup(): Promise<
    BottomSheetListGroup<Branch>[]
  > {
    return mapBranchesListV2ResponseToBranchesBottomSheetListGroup(
      await this._networkService.request<
        ConsumerB2CBranchesListRequest,
        ConsumerB2CBranchesListResponse
      >({
        requestLine: 'get /consumer/api/v1/b2c-branches',
      })
    );
  }

  async listBranchesWithHashTags(
    hashTagIds: number[]
  ): Promise<BottomSheetListGroup<Branch>[]> {
    return mapBranchesListV2ResponseToBranchesBottomSheetListGroup(
      await this._networkService.request<
        ConsumerB2CBranchesListRequest,
        ConsumerB2CBranchesListResponse
      >({
        requestLine: 'get /consumer/api/v1/b2c-branches',
        query: {
          query: {
            vgql: 'v1',
            filter: {
              elements: [
                { field: 'hashTagIds', operator: 'in', value: hashTagIds },
              ],
            },
          },
        },
      })
    );
  }

  async listBranchesWithAreas(
    areaIds: number[]
  ): Promise<BottomSheetListGroup<Branch>[]> {
    return mapBranchesListV2ResponseToBranchesBottomSheetListGroup(
      await this._networkService.request<
        ConsumerB2CBranchesListRequest,
        ConsumerB2CBranchesListResponse
      >({
        requestLine: 'get /consumer/api/v1/b2c-branches',
        query: {
          query: {
            vgql: 'v1',
            filter: {
              elements: [
                { field: 'address.areaId', operator: 'in', value: areaIds },
              ],
            },
          },
        },
      })
    );
  }

  async listBranches(): Promise<Branch[]> {
    let skip;
    let response = await this._networkService.request<
      BranchesListV2Request,
      BranchesListV2Response
    >({
      requestLine: 'get /api/v1.1/branches',
    });
    const fetchedBranches = mapBranchesListV2ResponseToBranches(response);
    skip = response.metadata.totalReturned;

    while (fetchedBranches.length < response.metadata.totalCount) {
      // eslint-disable-next-line no-await-in-loop
      response = await this._networkService.request<
        BranchesListV2Request,
        BranchesListV2Response
      >({
        requestLine: 'get /api/v1.1/branches',
        query: {
          query: {
            vgql: 'v1',
            skip,
          },
        },
      });
      fetchedBranches.push(...mapBranchesListV2ResponseToBranches(response));
      skip += response.metadata.totalReturned;
    }

    return fetchedBranches;
  }

  async listCampaignBranches(
    campaignId: EntityId,
    promotionId: EntityId
  ): Promise<BottomSheetListGroup<CampaignBranch>[]> {
    return mapBranchesListResponseToCampaignBranchesBottomSheetListGroup(
      await this._networkService.request<
        CampaignBranchesListRequest,
        CampaignBranchesListResponse
      >({
        requestLine:
          'get /consumer/api/v1/campaigns/:campaignId/promotions/:promotionId/branches',
        params: { campaignId, promotionId },
      })
    );
  }
}
