import { $sb } from '@survv/commons/test/utils/sandbox';
import { Area } from '../../../../../src/core/models/Area';
import {
  AreasListV2Request,
  AreasListV2Response,
} from '@survv/api/definitions/areas';
import { AreasRepoImpl } from '../../../../../src/shell/repositories/areas/AreasRepoImpl';
import { Branch } from '../../../../../src/core/models/Branch';
import { BranchesRepoImpl } from '../../../../../src/shell/repositories/branches/BranchesRepoImpl';
import { CampaignCreationPM } from '../../../../../src/core/presentation-models/campaigns/CampaignCreationPM';
import {
  CampaignCreationRequest,
  CampaignCreationResponse,
} from '@survv/api/definitions/campaigns';
import { CampaignForm } from '../../../../../src/core/models/Campaign';
import { CampaignsRepoImpl } from '../../../../../src/shell/repositories/campaigns/CampaignsRepoImpl';
import {
  ConsumerB2CBranchesListRequest,
  ConsumerB2CBranchesListResponse,
} from '@survv/api/definitions/branches';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { HashTag } from '../../../../../src/core/models/HashTag';
import { HashTagStatus } from '../../../../../src/core/models/HashTagStatus';
import {
  HashTagsListRequest,
  HashTagsListResponse,
} from '@survv/api/definitions/hash-tags';
import { HashTagsRepoImpl } from '../../../../../src/shell/repositories/hash-tags/HashTagsRepoImpl';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import {
  PromoCodeType,
  PromoCodeUsageType,
  PromotionBranchesCriteria,
  PromotionCustomersCriteria,
} from '../../../../../src/core/models/Promotion';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { areasListV2ResponseStub } from '@survv/api/stubs/areas';
import { assert } from 'chai';
import {
  b2cBranchesListResponseStub,
  consumerB2cBranchesListResponseStub,
} from '@survv/api/stubs/branches';
import { campaignCreationResponseStub } from '@survv/api/stubs/campaigns';
import { createNotification } from '../../../../../src/core/notification';
import { errorModel } from '@survv/commons/core/errors/errors';
import { hashTagsListResponseStub } from '@survv/api/stubs/hash-tags';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { successfulOperation } from '@survv/commons/core/notification/notification';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('CampaignCreationPM', function () {
  let pm: CampaignCreationPM;

  beforeEach('setup "pm"', function () {
    pm = new CampaignCreationPM({
      campaignsRepo: new CampaignsRepoImpl(),
      branchesRepo: new BranchesRepoImpl(),
      hashTagsRepo: new HashTagsRepoImpl(),
      areasRepo: new AreasRepoImpl(),
      notificationService,
    });
  });

  context('submitting form', function () {
    describe('submit()', function () {
      it('submits campaign successfully', async function () {
        await wiremock
          .stub<CampaignCreationRequest, CampaignCreationResponse>()
          .request({
            requestLine: 'post /consumer/api/v1/campaigns',
            body: {
              name: 'campaign name',
              startDate: '2020-11-01T22:00:00.000Z',
              endDate: '2020-12-01T22:00:00.000Z',
              budget: 10000,
              targetActivationsCount: 10,
              service: 'B2C_FOOD',
              promotion: {
                promotionType: 'PROMO_CODE',
                name: 'promo code name',
                maxNumberOfUse: 1,
                promoCodeType: 'PERCENTAGE',
                promoCodeUsage: 'CASH_BACK',
                percentage: 10,
                value: 50,
                minSpending: 100,
                ordersCountOperator: 'EQUAL',
                ordersCount: 5,
                customersCriteria: {
                  criteria: 'SUBSET_OF_CUSTOMERS',
                  subsetPhoneNumbers: ['0102312381', '0109991112'],
                },
                branchesCriteria: {
                  criteria: 'SUBSET_OF_BRANCHES',
                  referencesIds: [11, 22, 33],
                  vendorsIds: [],
                },
              },
            },
          })
          .response({ status: 200, body: campaignCreationResponseStub() });

        pm.campaignForm.name = 'campaign name';
        pm.campaignForm.startDate = '2020-11-02';
        pm.campaignForm.endDate = '2020-12-01';
        pm.campaignForm.budget = 10000;
        pm.campaignForm.maxActivations = 10;
        pm.campaignForm.promoCode.name = 'promo code name';
        pm.campaignForm.promoCode.maxNumberOfUses = 1;
        pm.campaignForm.promoCode.type = PromoCodeType.PERCENTAGE.valueOf();
        pm.campaignForm.promoCode.usage =
          PromoCodeUsageType.CASH_BACK.valueOf();
        pm.campaignForm.promoCode.percentage = 10;
        pm.campaignForm.promoCode.cap = 50;
        pm.campaignForm.promoCode.minSpending = 100;
        pm.campaignForm.promoCode.numberOfOrdersOperator = 'EQUAL';
        pm.campaignForm.promoCode.numberOfOrders = '5';
        pm.campaignForm.eligibleUsersCriteria =
          PromotionCustomersCriteria.SUBSET_OF_CUSTOMERS.valueOf();
        pm.campaignForm.subsetPhoneNumbers = ['0102312381', '0109991112'];
        pm.campaignForm.eligibleBranchesCriteria =
          PromotionBranchesCriteria.SUBSET_OF_BRANCHES.valueOf();
        pm.campaignForm.selectedBranches = [
          { id: 11, vendorId: 111 },
          { id: 22, vendorId: 222 },
          { id: 33, vendorId: 333 },
        ];

        const submitted = await pm.campaignForm.submit();

        assert.isTrue(submitted);
        assert.deepEqual(
          notificationService.notification,
          successfulOperation()
        );
      });
      it('submits campaign with correct vendor ids and branch (reference) ids', async function () {
        await wiremock
          .stub<CampaignCreationRequest, CampaignCreationResponse>()
          .request({
            requestLine: 'post /consumer/api/v1/campaigns',
            body: {
              name: 'campaign name',
              startDate: '2020-11-01T22:00:00.000Z',
              endDate: '2020-12-01T22:00:00.000Z',
              budget: 10000,
              targetActivationsCount: 10,
              service: 'B2C_FOOD',
              promotion: {
                promotionType: 'PROMO_CODE',
                name: 'promo code name',
                maxNumberOfUse: 1,
                promoCodeType: 'PERCENTAGE',
                promoCodeUsage: 'CASH_BACK',
                percentage: 10,
                value: 50,
                minSpending: 100,
                ordersCountOperator: 'EQUAL',
                ordersCount: 5,
                customersCriteria: {
                  criteria: 'SUBSET_OF_CUSTOMERS',
                  subsetPhoneNumbers: ['0102312381', '0109991112'],
                },
                branchesCriteria: {
                  criteria: 'SUBSET_OF_BRANCHES',
                  referencesIds: [21],
                  vendorsIds: [111],
                },
              },
            },
          })
          .response({ status: 200, body: campaignCreationResponseStub() });

        pm.campaignForm.name = 'campaign name';
        pm.campaignForm.startDate = '2020-11-02';
        pm.campaignForm.endDate = '2020-12-01';
        pm.campaignForm.budget = 10000;
        pm.campaignForm.maxActivations = 10;
        pm.campaignForm.promoCode.name = 'promo code name';
        pm.campaignForm.promoCode.maxNumberOfUses = 1;
        pm.campaignForm.promoCode.type = PromoCodeType.PERCENTAGE.valueOf();
        pm.campaignForm.promoCode.usage =
          PromoCodeUsageType.CASH_BACK.valueOf();
        pm.campaignForm.promoCode.percentage = 10;
        pm.campaignForm.promoCode.cap = 50;
        pm.campaignForm.promoCode.minSpending = 100;
        pm.campaignForm.promoCode.numberOfOrdersOperator = 'EQUAL';
        pm.campaignForm.promoCode.numberOfOrders = '5';
        pm.campaignForm.eligibleUsersCriteria =
          PromotionCustomersCriteria.SUBSET_OF_CUSTOMERS.valueOf();
        pm.campaignForm.subsetPhoneNumbers = ['0102312381', '0109991112'];
        pm.campaignForm.eligibleBranchesCriteria =
          PromotionBranchesCriteria.SUBSET_OF_BRANCHES.valueOf();
        pm.campaignForm.allBranches = [
          { id: 11, vendorId: 111 },
          { id: 12, vendorId: 111 },
          { id: 21, vendorId: 222 },
          { id: 22, vendorId: 222 },
        ];
        pm.campaignForm.selectedBranches = [
          { id: 11, vendorId: 111 },
          { id: 12, vendorId: 111 },
          { id: 21, vendorId: 222 },
        ];

        const submitted = await pm.campaignForm.submit();

        assert.isTrue(submitted);
        assert.deepEqual(
          notificationService.notification,
          successfulOperation()
        );
      });
      it('notifies error in case of failure', async function () {
        $sb
          .stub(CampaignsRepoImpl.prototype, 'addCampaign')
          .rejects(errorModel({ code: 'any', message: 'example error' }));

        pm.campaignForm.name = 'campaign name';
        pm.campaignForm.startDate = '2020-11-02T06:54:14.227Z';
        pm.campaignForm.endDate = '2020-12-02T06:54:14.227Z';
        pm.campaignForm.budget = 10000;
        pm.campaignForm.maxActivations = 10;
        pm.campaignForm.promoCode.name = 'promo code name';
        pm.campaignForm.promoCode.maxNumberOfUses = 1;
        pm.campaignForm.promoCode.type = PromoCodeType.PERCENTAGE.valueOf();
        pm.campaignForm.promoCode.usage =
          PromoCodeUsageType.CASH_BACK.valueOf();
        pm.campaignForm.promoCode.percentage = 10;
        pm.campaignForm.promoCode.cap = 50;
        pm.campaignForm.promoCode.minSpending = 100;
        pm.campaignForm.promoCode.numberOfOrdersOperator = 'EQUAL';
        pm.campaignForm.promoCode.numberOfOrders = '5';
        pm.campaignForm.eligibleUsersCriteria =
          PromotionCustomersCriteria.SUBSET_OF_CUSTOMERS.valueOf();
        pm.campaignForm.subsetPhoneNumbers = ['0102312381', '0109991112'];
        pm.campaignForm.eligibleBranchesCriteria =
          PromotionBranchesCriteria.SUBSET_OF_BRANCHES.valueOf();
        pm.campaignForm.selectedBranches = [
          { id: 11, vendorId: 111 },
          { id: 22, vendorId: 222 },
          { id: 33, vendorId: 333 },
        ];

        const submitted = await pm.submit();

        assert.isFalse(submitted);
        assert.deepEqual(
          notificationService.notification,
          createNotification(
            errorModel({ code: 'any', message: 'example error' })
          )
        );
      });
    });
    describe('get submittable', function () {
      it('returns if the campaign form was submittable or not', function () {
        pm.campaignForm = new CampaignForm();
        assert.isFalse(pm.submittable);

        pm.campaignForm.name = 'campaign name';
        pm.campaignForm.startDate = '2020-11-02T06:54:14.227Z';
        pm.campaignForm.endDate = '2020-12-02T06:54:14.227Z';
        pm.campaignForm.budget = 10000;
        pm.campaignForm.maxActivations = 10;
        pm.campaignForm.promoCode.name = 'promo code name';
        pm.campaignForm.promoCode.maxNumberOfUses = 1;
        pm.campaignForm.promoCode.type = PromoCodeType.PERCENTAGE.valueOf();
        pm.campaignForm.promoCode.usage =
          PromoCodeUsageType.CASH_BACK.valueOf();
        pm.campaignForm.promoCode.percentage = 10;
        pm.campaignForm.promoCode.cap = 50;
        pm.campaignForm.promoCode.minSpending = 100;
        pm.campaignForm.promoCode.numberOfOrdersOperator = 'EQUAL';
        pm.campaignForm.promoCode.numberOfOrders = '5';
        pm.campaignForm.eligibleUsersCriteria =
          PromotionCustomersCriteria.SUBSET_OF_CUSTOMERS.valueOf();
        pm.campaignForm.subsetPhoneNumbers = ['0102312381', '0109991112'];
        pm.campaignForm.eligibleBranchesCriteria =
          PromotionBranchesCriteria.SUBSET_OF_BRANCHES.valueOf();
        pm.campaignForm.selectedBranches = [
          { id: 11, vendorId: 111 },
          { id: 22, vendorId: 222 },
          { id: 33, vendorId: 333 },
        ];

        assert.isTrue(pm.submittable);
      });
    });
  });
  context('"branches with hash-tags" eligibility criteria', function () {
    describe('setUpdateHashTags()', function () {
      it('hydrates bottom sheet list group of hash-tags', async function () {
        await wiremock
          .stub<HashTagsListRequest, HashTagsListResponse>()
          .request({ requestLine: 'get /consumer/api/v1/hash-tags' })
          .response({ status: 200, body: hashTagsListResponseStub() });

        await pm.setUpdateHashTags();

        assert.deepEqual(pm.hashTags, [
          {
            items: hashTagsListResponseStub().hashTags.map((hashTag) => ({
              id: hashTag.id,
              label: hashTag.title,
              value: new HashTag({
                id: hashTag.id,
                name: new MultilingualString(hashTag.title),
                vendorType: new VendorType(hashTag.vendorType),
                creationDate: new Datetime(hashTag.creationDate),
                status: new HashTagStatus(hashTag.status),
              }),
            })),
          },
        ]);
      });

      it('opens hashTags bottom sheet', async function () {
        $sb.stub(HashTagsRepoImpl.prototype, 'listHashTags').resolves();

        await pm.setUpdateHashTags();

        assert.isTrue(pm.shouldOpenHashtagBottomSheet);
      });
    });

    describe('closeHashtagBottomSheet()', function () {
      it('closes hash-tags bottom sheet', function () {
        pm.closeHashtagBottomSheet();

        assert.isFalse(pm.shouldOpenAreasBottomSheet);
      });
    });

    describe('onHashTagsSelection()', function () {
      it('saves given selected hash-tags', async function () {
        $sb
          .stub(BranchesRepoImpl.prototype, 'listBranchesWithHashTags')
          .resolves();

        await pm.onHashTagsSelection([
          new HashTag({
            id: 1,
            name: new MultilingualString({ en: 'en1', ar: 'ar1' }),
            vendorType: VendorType.FOOD,
            creationDate: new Datetime('1/1/2021'),
            status: HashTagStatus.VISIBLE,
          }),
          new HashTag({
            id: 2,
            name: new MultilingualString({ en: 'en2', ar: 'ar2' }),
            vendorType: VendorType.FOOD,
            creationDate: new Datetime('1/1/2021'),
            status: HashTagStatus.VISIBLE,
          }),
        ]);

        assert.deepEqual(pm.selectedHashTags, [
          new HashTag({
            id: 1,
            name: new MultilingualString({ en: 'en1', ar: 'ar1' }),
            vendorType: VendorType.FOOD,
            creationDate: new Datetime('1/1/2021'),
            status: HashTagStatus.VISIBLE,
          }),
          new HashTag({
            id: 2,
            name: new MultilingualString({ en: 'en2', ar: 'ar2' }),
            vendorType: VendorType.FOOD,
            creationDate: new Datetime('1/1/2021'),
            status: HashTagStatus.VISIBLE,
          }),
        ]);
      });

      it('sets eligibility criteria referencesIds', async function () {
        $sb
          .stub(BranchesRepoImpl.prototype, 'listBranchesWithHashTags')
          .resolves();

        await pm.onHashTagsSelection([
          new HashTag({
            id: 1,
            name: new MultilingualString({ en: 'en1', ar: 'ar1' }),
            vendorType: VendorType.FOOD,
            creationDate: new Datetime('1/1/2021'),
            status: HashTagStatus.VISIBLE,
          }),
          new HashTag({
            id: 2,
            name: new MultilingualString({ en: 'en2', ar: 'ar2' }),
            vendorType: VendorType.FOOD,
            creationDate: new Datetime('1/1/2021'),
            status: HashTagStatus.VISIBLE,
          }),
        ]);

        assert.deepEqual(pm.campaignForm.referencesIds, [1, 2]);
      });

      it('closes the hash-tags bottom sheet', async function () {
        $sb.stub(HashTagsRepoImpl.prototype, 'listHashTags').resolves();
        $sb
          .stub(BranchesRepoImpl.prototype, 'listBranchesWithHashTags')
          .resolves();

        // open hash-tags bottom sheet
        await pm.setUpdateHashTags();

        await pm.onHashTagsSelection([
          new HashTag({
            id: 1,
            name: new MultilingualString({ en: 'en1', ar: 'ar1' }),
            vendorType: VendorType.FOOD,
            creationDate: new Datetime('1/1/2021'),
            status: HashTagStatus.VISIBLE,
          }),
          new HashTag({
            id: 2,
            name: new MultilingualString({ en: 'en2', ar: 'ar2' }),
            vendorType: VendorType.FOOD,
            creationDate: new Datetime('1/1/2021'),
            status: HashTagStatus.VISIBLE,
          }),
        ]);

        assert.isFalse(pm.shouldOpenHashtagBottomSheet);
      });

      it('hydrates bottom sheet list group of branches that contains any of selected hash-tags', async function () {
        await wiremock
          .stub<
            ConsumerB2CBranchesListRequest,
            ConsumerB2CBranchesListResponse
          >()
          .request({
            requestLine: 'get /consumer/api/v1/b2c-branches',
            query: {
              query: {
                vgql: 'v1',
                filter: {
                  elements: [
                    { field: 'hashTagIds', operator: 'in', value: [1, 2] },
                  ],
                },
              },
            },
          })
          .response({
            status: 200,
            body: consumerB2cBranchesListResponseStub(),
          });

        await pm.onHashTagsSelection([
          new HashTag({
            id: 1,
            name: new MultilingualString({ en: 'en1', ar: 'ar1' }),
            vendorType: VendorType.FOOD,
            creationDate: new Datetime('1/1/2021'),
            status: HashTagStatus.VISIBLE,
          }),
          new HashTag({
            id: 2,
            name: new MultilingualString({ en: 'en2', ar: 'ar2' }),
            vendorType: VendorType.FOOD,
            creationDate: new Datetime('1/1/2021'),
            status: HashTagStatus.VISIBLE,
          }),
        ]);

        assert.equal(pm.branchesIncludedCount, 1);
        assert.deepEqual(pm.branchesIncluded, [
          {
            items: b2cBranchesListResponseStub().branches.map((branch) => ({
              id: branch.id,
              label: branch.label,
              value: new Branch({
                id: branch.id,
                vendorId: branch.vendorId,
                label: branch.label,
                vendorLabel: branch.vendorLabel,
              }),
            })),
          },
        ]);
      });
    });

    describe('get selectedHashTagsCount', function () {
      it('returns selected hash-tags count', function () {
        pm.selectedHashTags = [
          new HashTag({
            id: 1,
            name: new MultilingualString({ en: 'en1', ar: 'ar1' }),
            vendorType: VendorType.FOOD,
            creationDate: new Datetime('1/1/2021'),
            status: HashTagStatus.VISIBLE,
          }),
        ];
        assert.equal(pm.selectedHashTagsCount, 1);
      });
    });
  });
  context('"branches with areas" eligibility criteria', function () {
    describe('setUpdateAreas()', function () {
      it('hydrates bottom sheet list group of areas', async function () {
        await wiremock
          .stub<AreasListV2Request, AreasListV2Response>()
          .request({ requestLine: 'get /api/v1.1/areas' })
          .response({ status: 200, body: areasListV2ResponseStub() });

        await pm.setUpdateAreas();

        assert.deepEqual(pm.areas, [
          {
            items: areasListV2ResponseStub().areas.map((area) => ({
              id: area.areaId,
              label: area.name,
              value: new Area({
                id: area.areaId,
                name: new MultilingualString(area.name),
                cityId: area.cityId,
              }),
            })),
          },
        ]);
      });

      it('opens areas bottom sheet', async function () {
        $sb.stub(AreasRepoImpl.prototype, 'listAreas').resolves();

        await pm.setUpdateAreas();

        assert.isTrue(pm.shouldOpenAreasBottomSheet);
      });
    });

    describe('closeAreasBottomSheet()', function () {
      it('closes areas bottom sheet', function () {
        pm.closeAreasBottomSheet();

        assert.isFalse(pm.shouldOpenAreasBottomSheet);
      });
    });

    describe('onAreasSelection()', function () {
      it('saves given selected areas', async function () {
        $sb
          .stub(BranchesRepoImpl.prototype, 'listBranchesWithAreas')
          .resolves();

        await pm.onAreasSelection([
          new Area({
            id: 1,
            name: new MultilingualString({ en: 'en1', ar: 'ar1' }),
            cityId: 11,
          }),
          new Area({
            id: 2,
            name: new MultilingualString({ en: 'en2', ar: 'ar2' }),
            cityId: 11,
          }),
        ]);

        assert.deepEqual(pm.selectedAreas, [
          new Area({
            id: 1,
            name: new MultilingualString({ en: 'en1', ar: 'ar1' }),
            cityId: 11,
          }),
          new Area({
            id: 2,
            name: new MultilingualString({ en: 'en2', ar: 'ar2' }),
            cityId: 11,
          }),
        ]);
      });

      it('sets eligibility criteria referencesIds', async function () {
        $sb
          .stub(BranchesRepoImpl.prototype, 'listBranchesWithAreas')
          .resolves();

        await pm.onAreasSelection([
          new Area({
            id: 1,
            name: new MultilingualString({ en: 'en1', ar: 'ar1' }),
            cityId: 11,
          }),
          new Area({
            id: 2,
            name: new MultilingualString({ en: 'en2', ar: 'ar2' }),
            cityId: 11,
          }),
        ]);

        assert.deepEqual(pm.campaignForm.referencesIds, [1, 2]);
      });

      it('closes the areas bottom sheet', async function () {
        $sb.stub(AreasRepoImpl.prototype, 'listAreas').resolves();
        $sb
          .stub(BranchesRepoImpl.prototype, 'listBranchesWithAreas')
          .resolves();

        await pm.setUpdateAreas();

        await pm.onAreasSelection([
          new Area({
            id: 1,
            name: new MultilingualString({ en: 'en1', ar: 'ar1' }),
            cityId: 11,
          }),
          new Area({
            id: 2,
            name: new MultilingualString({ en: 'en2', ar: 'ar2' }),
            cityId: 11,
          }),
        ]);

        assert.isFalse(pm.shouldOpenAreasBottomSheet);
      });

      it('hydrates bottom sheet list group of branches that contains any of selected areas', async function () {
        await wiremock
          .stub<
            ConsumerB2CBranchesListRequest,
            ConsumerB2CBranchesListResponse
          >()
          .request({
            requestLine: 'get /consumer/api/v1/b2c-branches',
            query: {
              query: {
                vgql: 'v1',
                filter: {
                  elements: [
                    { field: 'address.areaId', operator: 'in', value: [1, 2] },
                  ],
                },
              },
            },
          })
          .response({
            status: 200,
            body: consumerB2cBranchesListResponseStub(),
          });

        await pm.onAreasSelection([
          new Area({
            id: 1,
            name: new MultilingualString({ en: 'en1', ar: 'ar1' }),
            cityId: 11,
          }),
          new Area({
            id: 2,
            name: new MultilingualString({ en: 'en2', ar: 'ar2' }),
            cityId: 11,
          }),
        ]);

        assert.deepEqual(pm.branchesIncluded, [
          {
            items: b2cBranchesListResponseStub().branches.map((branch) => ({
              id: branch.id,
              label: branch.label,
              value: new Branch({
                id: branch.id,
                vendorId: branch.vendorId,
                label: branch.label,
                vendorLabel: branch.vendorLabel,
              }),
            })),
          },
        ]);
      });
    });

    describe('get selectedAreasCount', function () {
      it('returns selected areas count', function () {
        pm.selectedAreas = [
          new Area({
            id: 1,
            name: new MultilingualString({ en: 'en1', ar: 'ar1' }),
            cityId: 11,
          }),
        ];
        assert.equal(pm.selectedAreasCount, 1);
      });
    });
  });
  context(
    '"branches with specific branches" eligibility criteria',
    function () {
      describe('setUpdateBranches()', function () {
        it('hydrates bottom sheet list group of branches', async function () {
          await wiremock
            .stub<
              ConsumerB2CBranchesListRequest,
              ConsumerB2CBranchesListResponse
            >()
            .request({
              requestLine: 'get /consumer/api/v1/b2c-branches',
            })
            .response({
              status: 200,
              body: consumerB2cBranchesListResponseStub(),
            });

          await pm.setUpdateBranches();

          assert.deepEqual(pm.branches, [
            {
              items: consumerB2cBranchesListResponseStub().branches.map(
                (branch) => ({
                  id: branch.id,
                  label: branch.label,
                  value: new Branch({
                    id: branch.id,
                    label: branch.label,
                    vendorId: branch.vendorId,
                    vendorLabel: branch.vendorLabel,
                  }),
                })
              ),
            },
          ]);
        });

        it('opens branches bottom sheet', async function () {
          $sb.stub(BranchesRepoImpl.prototype, 'listBranches').resolves();

          await pm.setUpdateBranches();

          assert.isTrue(pm.shouldOpenBranchesBottomSheet);
        });
      });

      describe('isBranchSelected()', function () {
        it('checks if given branch is selected', function () {
          pm.selectedBranches = [
            new Branch({
              id: 11,
              label: 'label',
              vendorId: 22,
              vendorLabel: 'vlabel',
            }),
          ];

          assert.isFalse(
            pm.isBranchSelected(
              new Branch({
                id: 22,
                label: 'label',
                vendorId: 22,
                vendorLabel: 'vlabel',
              })
            )
          );

          assert.isTrue(
            pm.isBranchSelected(
              new Branch({
                id: 11,
                label: 'label',
                vendorId: 22,
                vendorLabel: 'vlabel',
              })
            )
          );
        });
      });

      describe('closeBranchesBottomSheet()', function () {
        it('closes branches bottom sheet', function () {
          pm.closeBranchesBottomSheet();

          assert.isFalse(pm.shouldOpenBranchesBottomSheet);
        });
      });

      describe('onBranchesSelection()', function () {
        it('saves given selected branches', function () {
          pm.onBranchesSelection([
            new Branch({
              id: 1,
              label: 'label1',
              vendorLabel: 'vendorLabel1',
              vendorId: 11,
            }),
            new Branch({
              id: 2,
              label: 'label2',
              vendorLabel: 'vendorLabel2',
              vendorId: 22,
            }),
          ]);

          assert.deepEqual(pm.selectedBranches, [
            new Branch({
              id: 1,
              label: 'label1',
              vendorLabel: 'vendorLabel1',
              vendorId: 11,
            }),
            new Branch({
              id: 2,
              label: 'label2',
              vendorLabel: 'vendorLabel2',
              vendorId: 22,
            }),
          ]);
        });

        it('sets eligibility criteria subsetIds', async function () {
          await pm.onBranchesSelection([
            new Branch({
              id: 1,
              label: 'label1',
              vendorLabel: 'vendorLabel1',
              vendorId: 11,
            }),
            new Branch({
              id: 2,
              label: 'label2',
              vendorLabel: 'vendorLabel2',
              vendorId: 22,
            }),
          ]);

          assert.deepEqual(pm.campaignForm.selectedBranches, [
            { id: 1, vendorId: 11 },
            { id: 2, vendorId: 22 },
          ]);
        });

        it('closes the branches bottom sheet', async function () {
          $sb.stub(BranchesRepoImpl.prototype, 'listBranches').resolves();

          await pm.setUpdateBranches();

          await pm.onBranchesSelection([
            new Branch({
              id: 1,
              label: 'label1',
              vendorLabel: 'vendorLabel1',
              vendorId: 11,
            }),
            new Branch({
              id: 2,
              label: 'label2',
              vendorLabel: 'vendorLabel2',
              vendorId: 22,
            }),
          ]);

          assert.isFalse(pm.shouldOpenBranchesBottomSheet);
        });

        it('hydrates bottom sheet list group of branches that were selected', async function () {
          await pm.onBranchesSelection([
            new Branch({
              id: 1,
              label: 'label1',
              vendorLabel: 'vendorLabel1',
              vendorId: 11,
            }),
            new Branch({
              id: 2,
              label: 'label2',
              vendorLabel: 'vendorLabel2',
              vendorId: 22,
            }),
          ]);

          assert.deepEqual(pm.branchesIncluded, [
            {
              items: [
                {
                  id: 1,
                  label: 'label1',
                  value: new Branch({
                    id: 1,
                    label: 'label1',
                    vendorLabel: 'vendorLabel1',
                    vendorId: 11,
                  }),
                },
                {
                  id: 2,
                  label: 'label2',
                  value: new Branch({
                    id: 2,
                    label: 'label2',
                    vendorLabel: 'vendorLabel2',
                    vendorId: 22,
                  }),
                },
              ],
            },
          ]);
        });
      });

      describe('selectAllBranchesFromVendor()', function () {
        it("selects all vendor's branches of given branch", async function () {
          pm.selectedBranches = [
            new Branch({
              id: 1,
              label: 'label1',
              vendorId: 11,
              vendorLabel: 'vlabel1',
            }),
          ];

          const modifiedB2CBranchesListResponseStub =
            consumerB2cBranchesListResponseStub();
          modifiedB2CBranchesListResponseStub.branches = [
            {
              id: 1,
              vendorId: 11,
              hubId: 2165529378315486700,
              avgTransactionPerHour: 20,
              label: 'label1',
              vendorLabel: 'vlabel1',
              creationDate: '2018-09-05T19:04:53.178Z',
              displayName: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              active: false,
              b2cStatus: 'BUSY_TWO_HOUR',
            },
            ...modifiedB2CBranchesListResponseStub.branches,
          ];

          await wiremock
            .stub<
              ConsumerB2CBranchesListRequest,
              ConsumerB2CBranchesListResponse
            >()
            .request({
              requestLine: 'get /consumer/api/v1/b2c-branches',
              query: {
                query: {
                  vgql: 'v1',
                  filter: {
                    elements: [
                      {
                        field: 'vendorId',
                        operator: 'in',
                        value: 11,
                      },
                    ],
                  },
                },
              },
            })
            .response({
              status: 200,
              body: modifiedB2CBranchesListResponseStub,
            });

          await pm.selectAllBranchesFromVendor(
            new Branch({
              id: 1,
              label: 'label1',
              vendorId: 11,
              vendorLabel: 'vlabel1',
            })
          );

          assert.deepEqual(pm.selectedBranches, [
            new Branch({
              id: 1,
              label: 'label1',
              vendorId: 11,
              vendorLabel: 'vlabel1',
            }),
            ...consumerB2cBranchesListResponseStub().branches.map(
              (branch) =>
                new Branch({
                  id: branch.id,
                  label: branch.label,
                  vendorId: branch.vendorId,
                  vendorLabel: branch.vendorLabel,
                })
            ),
          ]);
        });
      });

      describe('get selectedBranchesCount', function () {
        it('returns selected branches count', function () {
          pm.selectedBranches = [
            new Branch({
              id: 1,
              vendorId: 11,
              label: 'label',
              vendorLabel: 'vlabel',
            }),
            new Branch({
              id: 2,
              vendorId: 22,
              label: 'label2',
              vendorLabel: 'vlabel2',
            }),
          ];

          assert.equal(pm.selectedBranchesCount, 2);
        });
      });
    }
  );
  context('branches included', function () {
    describe('viewBranchesIncluded()', function () {
      it('views branches included bottom sheet', function () {
        pm.viewBranchesIncluded();
        assert.isTrue(pm.shouldOpenBranchesIncludedBottomSheet);
      });
    });
    describe('closeBranchesIncludedBottomSheet()', function () {
      it('closes branches included bottom sheet', function () {
        pm.viewBranchesIncluded();
        pm.closeBranchesIncludedBottomSheet();
        assert.isFalse(pm.shouldOpenBranchesIncludedBottomSheet);
      });
    });
  });

  describe('updateEligibleBranchesCriteria()', function () {
    it('updates branches eligibility criteria', function () {
      pm.updateEligibleBranchesCriteria(
        PromotionBranchesCriteria.ALL_VENDORS.valueOf()
      );

      assert.equal(
        pm.campaignForm.eligibleBranchesCriteria,
        PromotionBranchesCriteria.ALL_VENDORS.valueOf()
      );
    });

    it('resets related bottom sheets selections', function () {
      pm.onBranchesSelection([
        new Branch({
          id: 1,
          label: 'label1',
          vendorLabel: 'vendorLabel1',
          vendorId: 11,
        }),
        new Branch({
          id: 2,
          label: 'label2',
          vendorLabel: 'vendorLabel2',
          vendorId: 22,
        }),
      ]);
      pm.selectedBranches = [
        new Branch({
          id: 1,
          vendorId: 11,
          label: 'label',
          vendorLabel: 'vlabel',
        }),
        new Branch({
          id: 2,
          vendorId: 22,
          label: 'label2',
          vendorLabel: 'vlabel2',
        }),
      ];
      pm.selectedAreas = [
        new Area({
          id: 1,
          name: new MultilingualString({ en: 'en1', ar: 'ar1' }),
          cityId: 11,
        }),
      ];
      pm.selectedHashTags = [
        new HashTag({
          id: 1,
          name: new MultilingualString({ en: 'en1', ar: 'ar1' }),
          vendorType: VendorType.FOOD,
          creationDate: new Datetime('1/1/2021'),
          status: HashTagStatus.VISIBLE,
        }),
      ];

      pm.updateEligibleBranchesCriteria(
        PromotionBranchesCriteria.BRANCHES_IN_AREAS.valueOf()
      );

      assert.deepEqual(pm.selectedHashTags, []);
      assert.deepEqual(pm.selectedAreas, []);
      assert.deepEqual(pm.selectedBranches, []);
      assert.deepEqual(pm.branchesIncluded, [{ items: [] }]);
    });
  });

  describe('updatePromoCodeUsage()', function () {
    it('updates promo-code usage', function () {
      pm.updatePromoCodeUsage(PromoCodeUsageType.CASH_BACK.valueOf());

      assert.equal(
        pm.campaignForm.promoCode.usage,
        PromoCodeUsageType.CASH_BACK.valueOf()
      );
    });

    it('resets promo-code\'s ["type", "percentage", "cap", "value"] if usage was "Free Delivery"', function () {
      pm.updatePromoCodeUsage(PromoCodeUsageType.FREE_DELIVERY.valueOf());

      assert.equal(pm.campaignForm.promoCode.type, '');
      assert.equal(pm.campaignForm.promoCode.percentage, 0);
      assert.equal(pm.campaignForm.promoCode.cap, 0);
      assert.equal(pm.campaignForm.promoCode.value, 0);
    });
  });

  describe('updatePromoCodeType()', function () {
    it('updates promo-code type', function () {
      pm.updatePromoCodeType(PromoCodeType.FIXED_VALUE.valueOf());

      assert.equal(
        pm.campaignForm.promoCode.type,
        PromoCodeType.FIXED_VALUE.valueOf()
      );
    });

    it('resets promo-code\'s ["percentage", "cap", "value"]', function () {
      pm.updatePromoCodeType(PromoCodeType.FIXED_VALUE.valueOf());

      assert.equal(pm.campaignForm.promoCode.percentage, 0);
      assert.equal(pm.campaignForm.promoCode.cap, 0);
      assert.equal(pm.campaignForm.promoCode.value, 0);
    });
  });

  describe('get shouldShowPromoCodePercentage', function () {
    it('shows percentage only if promo-code type was "Percentage"', function () {
      pm.campaignForm.promoCode.type = PromoCodeType.FIXED_VALUE.valueOf();
      assert.isFalse(pm.shouldShowPromoCodePercentage);

      pm.campaignForm.promoCode.type = PromoCodeType.PERCENTAGE.valueOf();
      assert.isTrue(pm.shouldShowPromoCodePercentage);
    });
  });
  describe('get shouldShowPromoCodeCap', function () {
    it('shows cap only if promo-code type was "Percentage"', function () {
      pm.campaignForm.promoCode.type = PromoCodeType.FIXED_VALUE.valueOf();
      assert.isFalse(pm.shouldShowPromoCodeCap);

      pm.campaignForm.promoCode.type = PromoCodeType.PERCENTAGE.valueOf();
      assert.isTrue(pm.shouldShowPromoCodeCap);
    });
  });
  describe('get shouldShowPromoCodeValue', function () {
    it('shows value only if promo-code type was "Fixed Value"', function () {
      pm.campaignForm.promoCode.type = PromoCodeType.PERCENTAGE.valueOf();
      assert.isFalse(pm.shouldShowPromoCodeValue);

      pm.campaignForm.promoCode.type = PromoCodeType.FIXED_VALUE.valueOf();
      assert.isTrue(pm.shouldShowPromoCodeValue);
    });
  });
  describe('get shouldShowPromoCodeType', function () {
    it('shows value only if promo-code usage was defined & was not "Free Delivery"', function () {
      pm.campaignForm.promoCode.usage = '';
      assert.isFalse(pm.shouldShowPromoCodeType);

      pm.campaignForm.promoCode.usage =
        PromoCodeUsageType.FREE_DELIVERY.valueOf();
      assert.isFalse(pm.shouldShowPromoCodeType);

      pm.campaignForm.promoCode.usage = PromoCodeUsageType.CASH_BACK.valueOf();
      assert.isTrue(pm.shouldShowPromoCodeType);
    });
  });
  describe('updateSubsetUsersPhoneNumbers()', function () {
    it('saves customers phone numbers & CSV file name', function () {
      const parserCSVData = {
        data: [
          { '$properties.$phone': '0109991112', 'dummy': 'data' },
          { '$properties.$phone': '0102312381', 'dummy': 'data' },
        ],
        fileName: 'customers.csv',
      };

      pm.updateSubsetUsersPhoneNumbers(parserCSVData);

      assert.deepEqual(pm.campaignForm.subsetPhoneNumbers, [
        '0109991112',
        '0102312381',
      ]);
      assert.equal(pm.CSVFileName, 'customers.csv');
    });

    it('notifies "InvalidCSVFIleException" if data didn\'t contain "phone" key', function () {
      const parserCSVData = {
        data: [
          { phoneNumber: '0109991112', dummy: 'data' },
          { phoneNumber: '0102312381', dummy: 'data' },
        ],
        fileName: 'customers.csv',
      };

      pm.updateSubsetUsersPhoneNumbers(parserCSVData);

      assert.deepEqual(pm.campaignForm.subsetPhoneNumbers, []);
      assert.equal(pm.CSVFileName, '');
      assert.deepEqual(
        notificationService.notification,
        createNotification(
          errorModel({
            message: 'Invalid CSV File',
            code: 'InvalidCSVFIleException',
            args: {
              headerName: '$properties.$phone',
            },
          })
        )
      );
    });

    it('resets ["subsetPhoneNumbers", "CSVFileName"] if given parsed data were not valid', function () {
      pm.updateSubsetUsersPhoneNumbers({
        data: [
          { phone: '0109991112', dummy: 'data' },
          { phone: '0102312381', dummy: 'data' },
        ],
        fileName: 'customers.csv',
      });

      pm.updateSubsetUsersPhoneNumbers({
        data: [
          { phoneNumber: '0109991112', dummy: 'data' },
          { phoneNumber: '0102312381', dummy: 'data' },
        ],
        fileName: 'customers.csv',
      });

      assert.deepEqual(pm.campaignForm.subsetPhoneNumbers, []);
      assert.equal(pm.CSVFileName, '');
    });
  });

  it('searches & filters branches included successfully', async function () {
    $sb
      .stub(BranchesRepoImpl.prototype, 'listBranchesBottomSheetListGroup')
      .resolves([
        {
          items: [
            {
              id: 1,
              label: 'label1',
              value: new Branch({
                id: 1,
                label: 'label1',
                vendorId: 11,
                vendorLabel: 'label11',
              }),
            },
            {
              id: 2,
              label: 'label2',
              value: new Branch({
                id: 2,
                label: 'label2',
                vendorId: 22,
                vendorLabel: 'label22',
              }),
            },
          ],
        },
      ]);

    await pm.setUpdateBranches();
    pm.onBranchesSelection([
      new Branch({
        id: 1,
        label: 'label1',
        vendorId: 11,
        vendorLabel: 'label11',
      }),
      new Branch({
        id: 2,
        label: 'label2',
        vendorId: 22,
        vendorLabel: 'label22',
      }),
    ]);

    pm.searchBranchesIncluded('Label1');

    assert.deepEqual(pm.branchesIncluded, [
      {
        items: [
          {
            id: 1,
            label: 'label1',
            value: new Branch({
              id: 1,
              label: 'label1',
              vendorId: 11,
              vendorLabel: 'label11',
            }),
          },
        ],
      },
    ]);
  });

  it('searches & filters hash-tags successfully', async function () {
    $sb
      .stub(HashTagsRepoImpl.prototype, 'listHashTagsBottomSheetListGroup')
      .resolves([
        {
          items: [
            {
              id: 1,
              label: { en: 'en1', ar: 'ar1' },
              value: new HashTag({
                id: 1,
                name: new MultilingualString({ en: 'en1', ar: 'ar1' }),
                vendorType: VendorType.FOOD,
                creationDate: new Datetime('1/1/2021'),
                status: HashTagStatus.VISIBLE,
              }),
            },
            {
              id: 2,
              label: { en: 'en2', ar: 'ar2' },
              value: new HashTag({
                id: 2,
                name: new MultilingualString({ en: 'en2', ar: 'ar2' }),
                vendorType: VendorType.FOOD,
                creationDate: new Datetime('1/1/2021'),
                status: HashTagStatus.VISIBLE,
              }),
            },
          ],
        },
      ]);

    await pm.setUpdateHashTags();

    pm.searchHashTags('en1');

    assert.deepEqual(pm.hashTags, [
      {
        items: [
          {
            id: 1,
            label: { en: 'en1', ar: 'ar1' },
            value: new HashTag({
              id: 1,
              name: new MultilingualString({ en: 'en1', ar: 'ar1' }),
              vendorType: VendorType.FOOD,
              creationDate: new Datetime('1/1/2021'),
              status: HashTagStatus.VISIBLE,
            }),
          },
        ],
      },
    ]);

    pm.searchHashTags('ar2');

    assert.deepEqual(pm.hashTags, [
      {
        items: [
          {
            id: 2,
            label: { en: 'en2', ar: 'ar2' },
            value: new HashTag({
              id: 2,
              name: new MultilingualString({ en: 'en2', ar: 'ar2' }),
              vendorType: VendorType.FOOD,
              creationDate: new Datetime('1/1/2021'),
              status: HashTagStatus.VISIBLE,
            }),
          },
        ],
      },
    ]);
  });

  it('searches & filters branches successfully', async function () {
    $sb
      .stub(BranchesRepoImpl.prototype, 'listBranchesBottomSheetListGroup')
      .resolves([
        {
          items: [
            {
              id: 1,
              label: 'label1',
              value: new Branch({
                id: 1,
                label: 'label1',
                vendorId: 11,
                vendorLabel: 'label11',
              }),
            },
            {
              id: 2,
              label: 'label2',
              value: new Branch({
                id: 2,
                label: 'label2',
                vendorId: 22,
                vendorLabel: 'label22',
              }),
            },
          ],
        },
      ]);

    await pm.setUpdateBranches();

    pm.searchBranches('Label2');

    assert.deepEqual(pm.branches, [
      {
        items: [
          {
            id: 2,
            label: 'label2',
            value: new Branch({
              id: 2,
              label: 'label2',
              vendorId: 22,
              vendorLabel: 'label22',
            }),
          },
        ],
      },
    ]);
  });

  it('searches & filters areas successfully', async function () {
    $sb
      .stub(AreasRepoImpl.prototype, 'listAreasBottomSheetListGroup')
      .resolves([
        {
          items: [
            {
              id: 1,
              label: { en: 'en1', ar: 'ar1' },
              value: new Area({
                id: 1,
                name: new MultilingualString({ en: 'en1', ar: 'ar1' }),
                cityId: 11,
              }),
            },
            {
              id: 2,
              label: { en: 'en2', ar: 'ar2' },
              value: new Area({
                id: 2,
                name: new MultilingualString({ en: 'en2', ar: 'ar2' }),
                cityId: 11,
              }),
            },
          ],
        },
      ]);

    await pm.setUpdateAreas();

    pm.searchAreas('en1');

    assert.deepEqual(pm.areas, [
      {
        items: [
          {
            id: 1,
            label: { en: 'en1', ar: 'ar1' },
            value: new Area({
              id: 1,
              name: new MultilingualString({ en: 'en1', ar: 'ar1' }),
              cityId: 11,
            }),
          },
        ],
      },
    ]);

    pm.searchAreas('ar2');

    assert.deepEqual(pm.areas, [
      {
        items: [
          {
            id: 2,
            label: { en: 'en2', ar: 'ar2' },
            value: new Area({
              id: 2,
              name: new MultilingualString({ en: 'en2', ar: 'ar2' }),
              cityId: 11,
            }),
          },
        ],
      },
    ]);
  });
});
