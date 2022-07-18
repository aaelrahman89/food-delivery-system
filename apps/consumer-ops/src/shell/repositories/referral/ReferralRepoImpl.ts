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
  RefereeReport,
  ReferrerSummary,
} from '../../../core/models/RefereeReport';
import {
  RefereeReportRequest,
  RefereeReportResponse,
  ReferralListRequest,
  ReferralListResponse,
  ReferralReportListRequest,
  ReferralReportListResponse,
  ReferralSetupRequest,
  ReferralSetupResponse,
} from '@survv/api/definitions/referral';
import { Referral, ReferralForm } from '../../../core/models/Referral';
import { ReferralRepo } from '../../../core/repositories/ReferralRepo';
import { ReferralReportItem } from '../../../core/models/ReferralReport';
import {
  mapRefereeReportResponseToReferrerReport,
  mapReferralListResponseToReferral,
  mapReferralReportListResponseToReferralReport,
  mapReferralReportListResponseToReferrerSummary,
} from './mappers/responses';
import { mapReferralFormToReferralSetupRequest } from './mappers/requests';

export class ReferralRepoImpl implements ReferralRepo {
  private readonly _networkService: NetworkService = networkService;

  async setReferralSetup(referralForm: ReferralForm): Promise<void> {
    await this._networkService.request<
      ReferralSetupRequest,
      ReferralSetupResponse
    >({
      requestLine: 'post /api/v1/referrals',
      body: mapReferralFormToReferralSetupRequest(referralForm),
    });
  }

  async getReferralSetup(): Promise<Referral> {
    return mapReferralListResponseToReferral(
      await this._networkService.request<
        ReferralListRequest,
        ReferralListResponse
      >({
        requestLine: 'get /api/v1/referrals',
      })
    );
  }

  async getReferralReport(
    query: ListingQuery
  ): Promise<ItemsList<ReferralReportItem>> {
    const beQuery = queryMapper({
      ...query,
    });

    return mapReferralReportListResponseToReferralReport(
      await this._networkService.request<
        ReferralReportListRequest,
        ReferralReportListResponse
      >({
        requestLine: 'get /api/v1/referrer-codes/report',
        query: { query: beQuery },
      })
    );
  }

  async getRefereeReport(
    referrerCodeId: EntityId,
    query?: ListingQuery
  ): Promise<ItemsList<RefereeReport>> {
    const beQuery = queryMapper({
      ...query,
      filterMap: {
        orderStatus: {
          fieldName: 'orderStatus',
          operator: filterOperators.EQUAL,
        },
      },
    });

    return mapRefereeReportResponseToReferrerReport(
      await this._networkService.request<
        RefereeReportRequest,
        RefereeReportResponse
      >({
        requestLine:
          'get /api/v1/referrer-codes/:referrerCodeId/referee-report',
        params: { referrerCodeId },
        query: { query: beQuery },
      })
    );
  }

  async getReferrerSummary(referrerCodeId: EntityId): Promise<ReferrerSummary> {
    const beQuery = queryMapper({
      filter: {
        referrerCodeId,
      },
      filterMap: {
        referrerCodeId: {
          fieldName: '_id',
          operator: filterOperators.EQUAL,
        },
      },
    });

    return mapReferralReportListResponseToReferrerSummary(
      await this._networkService.request<
        ReferralReportListRequest,
        ReferralReportListResponse
      >({
        requestLine: 'get /api/v1/referrer-codes/report',
        query: { query: beQuery },
      })
    );
  }
}
