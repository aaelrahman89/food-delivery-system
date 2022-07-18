import { Campaign, CampaignForm } from '../../../core/models/Campaign';
import {
  CampaignCreationRequest,
  CampaignCreationResponse,
  CampaignsListRequest,
  CampaignsListResponse,
  DisableCampaignRequest,
  DisableCampaignResponse,
  EnableCampaignRequest,
  EnableCampaignResponse,
} from '@survv/api/definitions/campaigns';
import { CampaignsRepo } from '../../../core/repositories/CampaignsRepo';
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
import { mapCampaignFormToCampaignCreationRequest } from './mappers/requests';
import { mapCampaignsListResponseToCampaigns } from './mappers/responses';

export class CampaignsRepoImpl implements CampaignsRepo {
  private readonly _networkService: NetworkService = networkService;

  async addCampaign(campaignForm: CampaignForm): Promise<void> {
    await this._networkService.request<
      CampaignCreationRequest,
      CampaignCreationResponse
    >({
      requestLine: 'post /consumer/api/v1/campaigns',
      body: mapCampaignFormToCampaignCreationRequest(campaignForm),
    });
  }

  async listCampaigns(query?: ListingQuery): Promise<ItemsList<Campaign>> {
    const branchId = query?.filter?.branchId;
    delete query?.filter?.branchId;

    const beQuery = queryMapper({
      ...query,
      filterMap: {
        name: {
          fieldName: 'name',
          operator: filterOperators.REGEX,
        },
        area: {
          fieldName: 'promotions.branchesCriteria.referencesIds',
          operator: filterOperators.IN,
        },
        tag: {
          fieldName: 'promotions.branchesCriteria.referencesIds',
          operator: filterOperators.IN,
        },
        status: {
          fieldName: 'status',
          operator: filterOperators.IN,
        },
        promoCodeName: {
          fieldName: 'promotions.name',
          operator: filterOperators.REGEX,
        },
        createdBy: {
          fieldName: 'createdBy.email',
          operator: filterOperators.REGEX,
        },
        usageType: {
          fieldName: 'promotions.promoCodeUsage',
          operator: filterOperators.IN,
        },
        service: {
          fieldName: 'service',
          operator: filterOperators.IN,
        },
        startDateFrom: {
          fieldName: 'startDate',
          operator: filterOperators.GTE,
        },
        startDateTo: {
          fieldName: 'startDate',
          operator: filterOperators.LTE,
        },
        endDateFrom: {
          fieldName: 'endDate',
          operator: filterOperators.GTE,
        },
        endDateTo: {
          fieldName: 'endDate',
          operator: filterOperators.LTE,
        },
      },
    });

    return mapCampaignsListResponseToCampaigns(
      await this._networkService.request<
        CampaignsListRequest,
        CampaignsListResponse
      >({
        requestLine: 'get /consumer/api/v1/campaigns',
        query:
          beQuery || branchId
            ? {
                query: beQuery || undefined,
                branchId: (branchId as number) || undefined,
              }
            : undefined,
      })
    );
  }

  async enableCampaign(campaignId: EntityId): Promise<void> {
    await this._networkService.request<
      EnableCampaignRequest,
      EnableCampaignResponse
    >({
      requestLine: 'patch /consumer/api/v1/campaigns/:campaignId/enable',
      params: { campaignId },
    });
  }

  async disableCampaign(campaignId: EntityId): Promise<void> {
    await this._networkService.request<
      DisableCampaignRequest,
      DisableCampaignResponse
    >({
      requestLine: 'patch /consumer/api/v1/campaigns/:campaignId/disable',
      params: { campaignId },
    });
  }
}
