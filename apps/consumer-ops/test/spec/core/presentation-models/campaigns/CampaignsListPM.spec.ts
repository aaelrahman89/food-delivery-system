import { $sb } from '@survv/commons/test/utils/sandbox';
import {
  AreasListV2Request,
  AreasListV2Response,
} from '@survv/api/definitions/areas';
import { AreasRepoImpl } from '../../../../../src/shell/repositories/areas/AreasRepoImpl';
import {
  BranchesListV2Request,
  BranchesListV2Response,
} from '@survv/api/definitions/branches';
import { BranchesRepoImpl } from '../../../../../src/shell/repositories/branches/BranchesRepoImpl';
import {
  CampaignBranchesListRequest,
  CampaignBranchesListResponse,
  CampaignsListRequest,
  CampaignsListResponse,
  DisableCampaignRequest,
  DisableCampaignResponse,
  EnableCampaignRequest,
  EnableCampaignResponse,
} from '@survv/api/definitions/campaigns';
import { CampaignsListPM } from '../../../../../src/core/presentation-models/campaigns/CampaignsListPM';
import { CampaignsRepoImpl } from '../../../../../src/shell/repositories/campaigns/CampaignsRepoImpl';
import {
  HashTagsListRequest,
  HashTagsListResponse,
} from '@survv/api/definitions/hash-tags';
import { HashTagsRepoImpl } from '../../../../../src/shell/repositories/hash-tags/HashTagsRepoImpl';
import { LocalError } from '@survv/commons/core/errors/errors';
import { areasListV2ResponseStub } from '@survv/api/stubs/areas';
import { assert } from 'chai';
import { branchesListV2ResponseStub } from '@survv/api/stubs/branches';
import {
  campaignBranchesListResponseStub,
  campaignsListResponseStub,
} from '@survv/api/stubs/campaigns';
import { createNotification } from '../../../../../src/core/notification';
import { filterOperators, queryMapper } from '@survv/commons/core/models/Query';
import { hashTagsListResponseStub } from '@survv/api/stubs/hash-tags';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { successfulOperation } from '@survv/commons/core/notification/notification';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('CampaignsListPM', function () {
  let pm: CampaignsListPM;
  const dummyCampaignId = 123;
  const error = new LocalError({
    code: 'any',
    message: 'any',
  });
  const campaignsRepo = new CampaignsRepoImpl();
  const branchesRepo = new BranchesRepoImpl();
  const areasRepo = new AreasRepoImpl();
  const hashTagsRepo = new HashTagsRepoImpl();

  async function setup() {
    await wiremock
      .stub<CampaignsListRequest, CampaignsListResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/campaigns',
        query: {
          query: queryMapper({
            sort: {
              creationDate: 'desc',
            },
            skip: 0,
            limit: 25,
          }),
        },
      })
      .response({
        status: 200,
        body: campaignsListResponseStub(),
      });

    await wiremock
      .stub<BranchesListV2Request, BranchesListV2Response>()
      .request({
        requestLine: 'get /api/v1.1/branches',
      })
      .response({
        status: 200,
        body: branchesListV2ResponseStub(),
      });

    await wiremock
      .stub<AreasListV2Request, AreasListV2Response>()
      .request({
        requestLine: 'get /api/v1.1/areas',
      })
      .response({
        status: 200,
        body: areasListV2ResponseStub(),
      });

    await wiremock
      .stub<HashTagsListRequest, HashTagsListResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/hash-tags',
      })
      .response({
        status: 200,
        body: hashTagsListResponseStub(),
      });

    await wiremock
      .stub<EnableCampaignRequest, EnableCampaignResponse>()
      .request({
        requestLine: 'patch /consumer/api/v1/campaigns/:campaignId/enable',
        params: { campaignId: dummyCampaignId },
      })
      .response({ status: 200 });

    await wiremock
      .stub<DisableCampaignRequest, DisableCampaignResponse>()
      .request({
        requestLine: 'patch /consumer/api/v1/campaigns/:campaignId/disable',
        params: { campaignId: dummyCampaignId },
      })
      .response({ status: 200 });

    pm = new CampaignsListPM({
      campaignsRepo,
      branchesRepo,
      areasRepo,
      hashTagsRepo,
      notificationService,
    });
  }
  beforeEach(function () {
    pm = new CampaignsListPM({
      campaignsRepo,
      branchesRepo,
      areasRepo,
      hashTagsRepo,
      notificationService,
    });
  });

  it('hydrates the campaigns list successfully', async function () {
    await setup();

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.isAbove(pm.list.items.length, 0);
  });
  it('hydrates the branches list successfully', async function () {
    await setup();

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.isAbove(pm.branchesListOptions.length, 0);
  });
  it('hydrates the areas list successfully', async function () {
    await setup();

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.isAbove(pm.areasListOptions.length, 0);
  });
  it('hydrates the hashtags list successfully', async function () {
    await setup();

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.isAbove(pm.hashTagsListOptions.length, 0);
  });
  it('should keep hydrating branches until all branches are fetched', async function () {
    await setup();

    const branchesListV2Stub = branchesListV2ResponseStub();
    branchesListV2Stub.branches = [
      {
        id: 2165529378315486700,
        vendorId: 2165529378315486700,
        hubId: 2165529378315486700,
        avgTransactionPerHour: 20,
        label: 'McDonald Manial',
        vendorLabel: 'McDonald',
        serviceTypes: ['B2B'],
        creationDate: '2018-09-05T19:04:53.178Z',
        displayName: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        active: false,
        deliverySMS: false,
        b2cStatus: 'BUSY_TWO_HOUR',
        maxStackedOrders: 3,
        stacking: true,
        stackingWindowInMinutes: 20,
      },
    ];
    branchesListV2Stub.metadata.totalReturned = 1;
    branchesListV2Stub.metadata.totalCount = 2;

    await wiremock
      .stub<BranchesListV2Request, BranchesListV2Response>()
      .request({
        requestLine: 'get /api/v1.1/branches',
      })
      .response({
        status: 200,
        body: branchesListV2Stub,
      });

    await wiremock
      .stub<BranchesListV2Request, BranchesListV2Response>()
      .request({
        requestLine: 'get /api/v1.1/branches',
        query: {
          query: {
            vgql: 'v1',
            skip: 1,
          },
        },
      })
      .response({
        status: 200,
        body: branchesListV2Stub,
      });

    await pm.init();
    assert.isUndefined(notificationService.notification);
    assert.equal(
      pm.branchesListOptions.length,
      branchesListV2Stub.metadata.totalCount
    );
  });
  it('notifies error on hydration failure', async function () {
    await setup();

    $sb.stub(campaignsRepo, 'listCampaigns').rejects(error);
    $sb.stub(branchesRepo, 'listBranches').rejects(error);
    $sb.stub(areasRepo, 'listAreas').rejects(error);
    $sb.stub(hashTagsRepo, 'listHashTags').rejects(error);

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
  it('refreshes successfully', async function () {
    await setup();
    const repoSpy = $sb.spy(campaignsRepo, 'listCampaigns');
    await pm.init();
    await pm.onPaginationUpdate({
      skip: 0,
      limit: 25,
    });

    $sb.assert.calledTwice(repoSpy);
  });
  it('notifies error on refresh failure', async function () {
    await setup();

    await pm.init();

    $sb.stub(campaignsRepo, 'listCampaigns').rejects(error);

    await pm.refresh();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
  it('enables a campaign successfully', async function () {
    await setup();

    await pm.enableCampaign(dummyCampaignId);

    assert.deepEqual(notificationService.notification, successfulOperation());
  });
  it('notifies failure if enable campaign action fails', async function () {
    await setup();

    $sb.stub(CampaignsRepoImpl.prototype, 'enableCampaign').rejects(error);

    await pm.enableCampaign(dummyCampaignId);

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
  it('disables a campaign successfully', async function () {
    await setup();

    await pm.disableCampaign(dummyCampaignId);

    assert.deepEqual(notificationService.notification, successfulOperation());
  });
  it('notifies failure if disable campaign action fails', async function () {
    await setup();

    $sb.stub(CampaignsRepoImpl.prototype, 'disableCampaign').rejects(error);

    await pm.disableCampaign(dummyCampaignId);

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
  it('hydrates the branches list with branches successfully', async function () {
    await setup();

    const campaignsListStub = campaignsListResponseStub();
    const campaignId = campaignsListStub.campaigns[0].id;
    const promotionId = campaignsListStub.campaigns[0].promotions[0].id;

    await wiremock
      .stub<CampaignsListRequest, CampaignsListResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/campaigns',
        query: {
          query: queryMapper({
            sort: {
              creationDate: 'desc',
            },
            skip: 0,
            limit: 25,
          }),
        },
      })
      .response({
        status: 200,
        body: campaignsListStub,
      });

    await wiremock
      .stub<CampaignBranchesListRequest, CampaignBranchesListResponse>()
      .request({
        requestLine:
          'get /consumer/api/v1/campaigns/:campaignId/promotions/:promotionId/branches',
        params: { campaignId, promotionId },
      })
      .response({ status: 200, body: campaignBranchesListResponseStub() });

    await pm.init();

    await pm.setBranchesBottomSheet(campaignId);

    assert.isUndefined(notificationService.notification);
    assert.isAbove(pm.branches.length, 0);
  });
  it('notifies failure if hydrating the branches list fails', async function () {
    await setup();

    await pm.init();

    $sb.stub(BranchesRepoImpl.prototype, 'listCampaignBranches').rejects(error);

    await pm.setBranchesBottomSheet(123);

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
  it('hydrates the vendors criteria list with areas successfully', async function () {
    await setup();

    const campaignsListStub = campaignsListResponseStub();
    campaignsListStub.campaigns[0].promotions[0].branchesCriteria.criteria =
      'BRANCHES_IN_AREAS';

    const campaignId = campaignsListStub.campaigns[0].id;

    const referenceIds =
      campaignsListStub.campaigns[0].promotions[0].branchesCriteria
        .referencesIds;

    await wiremock
      .stub<CampaignsListRequest, CampaignsListResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/campaigns',
        query: {
          query: queryMapper({
            sort: {
              creationDate: 'desc',
            },
            skip: 0,
            limit: 25,
          }),
        },
      })
      .response({
        status: 200,
        body: campaignsListStub,
      });

    await wiremock
      .stub<AreasListV2Request, AreasListV2Response>()
      .request({
        requestLine: 'get /api/v1.1/areas',
        query: {
          query: {
            vgql: 'v1',
            filter: {
              elements: [
                {
                  field: '_id',
                  operator: filterOperators.IN,
                  value: referenceIds,
                },
              ],
            },
          },
        },
      })
      .response({ status: 200, body: areasListV2ResponseStub() });

    await pm.init();

    await pm.setVendorsCriteriaBottomSheet(campaignId);

    assert.isUndefined(notificationService.notification);
    assert.isAbove(pm.vendorsCriteriaItems.length, 0);
  });
  it('notifies failure if hydrating the areas list fails', async function () {
    await setup();

    const campaignsListStub = campaignsListResponseStub();
    campaignsListStub.campaigns[0].promotions[0].branchesCriteria.criteria =
      'BRANCHES_IN_AREAS';

    const campaignId = campaignsListStub.campaigns[0].id;

    await wiremock
      .stub<CampaignsListRequest, CampaignsListResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/campaigns',
        query: {
          query: queryMapper({
            sort: {
              creationDate: 'desc',
            },
            skip: 0,
            limit: 25,
          }),
        },
      })
      .response({
        status: 200,
        body: campaignsListStub,
      });

    await pm.init();

    $sb.stub(AreasRepoImpl.prototype, 'listCampaignAreas').rejects(error);

    await pm.setVendorsCriteriaBottomSheet(campaignId);

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
  it('hydrates the vendors criteria list with hash tags successfully', async function () {
    await setup();

    const campaignsListStub = campaignsListResponseStub();
    campaignsListStub.campaigns[0].promotions[0].branchesCriteria.criteria =
      'BRANCHES_WITH_TAGS';

    const campaignId = campaignsListStub.campaigns[0].id;

    const referenceIds =
      campaignsListStub.campaigns[0].promotions[0].branchesCriteria
        .referencesIds;

    await wiremock
      .stub<CampaignsListRequest, CampaignsListResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/campaigns',
        query: {
          query: queryMapper({
            sort: {
              creationDate: 'desc',
            },
            skip: 0,
            limit: 25,
          }),
        },
      })
      .response({
        status: 200,
        body: campaignsListStub,
      });

    await wiremock
      .stub<HashTagsListRequest, HashTagsListResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/hash-tags',
        query: {
          query: {
            vgql: 'v1',
            filter: {
              elements: [
                {
                  field: '_id',
                  operator: filterOperators.IN,
                  value: referenceIds,
                },
              ],
            },
          },
        },
      })
      .response({ status: 200, body: hashTagsListResponseStub() });

    await pm.init();

    await pm.setVendorsCriteriaBottomSheet(campaignId);

    assert.isUndefined(notificationService.notification);
    assert.isAbove(pm.vendorsCriteriaItems.length, 0);
  });
  it('notifies failure if hydrating the hash tags list fails', async function () {
    await setup();

    const campaignsListStub = campaignsListResponseStub();
    campaignsListStub.campaigns[0].promotions[0].branchesCriteria.criteria =
      'BRANCHES_WITH_TAGS';

    const campaignId = campaignsListStub.campaigns[0].id;

    await wiremock
      .stub<CampaignsListRequest, CampaignsListResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/campaigns',
        query: {
          query: queryMapper({
            sort: {
              creationDate: 'desc',
            },
            skip: 0,
            limit: 25,
          }),
        },
      })
      .response({
        status: 200,
        body: campaignsListStub,
      });

    await pm.init();

    $sb.stub(HashTagsRepoImpl.prototype, 'listCampaignHashTags').rejects(error);

    await pm.setVendorsCriteriaBottomSheet(campaignId);

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
  it('opens and closes the vendor criteria list bottom sheet successfully', async function () {
    await setup();

    await pm.init();

    assert.isFalse(pm.shouldOpenVendorsCriteriaBottomSheet);

    await pm.setVendorsCriteriaBottomSheet(123);

    assert.isTrue(pm.shouldOpenVendorsCriteriaBottomSheet);

    pm.closeVendorsCriteriaBottomSheet();

    assert.isFalse(pm.shouldOpenVendorsCriteriaBottomSheet);
  });
  it('opens and closes the branches list bottom sheet successfully', async function () {
    await setup();

    await pm.init();

    assert.isFalse(pm.shouldOpenBranchesBottomSheet);

    await pm.setBranchesBottomSheet(123);

    assert.isTrue(pm.shouldOpenBranchesBottomSheet);

    pm.closeBranchesBottomSheet();

    assert.isFalse(pm.shouldOpenBranchesBottomSheet);
  });
});
