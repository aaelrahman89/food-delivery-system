import { $sb } from '@survv/commons/test/utils/sandbox';
import { AuthToken } from '@survv/commons/core/models/AuthToken';
import {
  BranchItemRequest,
  BranchItemsListRequest,
  BranchItemsListResponse,
  ConsumerBranchItemResponse,
} from '@survv/api/definitions/branches';
import { CatalogueItemsRepoImpl } from '../../../../../../src/shell/repositories/catalogues/CatalogueItemsRepoImpl';
import {
  ImageRefType,
  createImageUrl,
} from '@survv/commons/core/models/Images';
import { assert } from 'chai';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import {
  branchItemsListResponseStub,
  consumerBranchItemResponseStub,
} from '@survv/api/stubs/branches';
import { queryMapper } from '@survv/commons/core/models/Query';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('CatalogueItemsRepoImpl', function () {
  it('should add the query when given a query spec', async function () {
    const repo = new CatalogueItemsRepoImpl();
    const branchId = 18751;
    const itemsListResponseStub = branchItemsListResponseStub();
    const query = queryMapper({
      sort: {
        prop: 'asc',
      },
    });

    $sb
      .stub(authTokenRepo, 'getParsedToken')
      .resolves(
        new AuthToken({ sub: String(branchId), roles: [], exp: 0, iss: '0' })
      );

    await wiremock
      .stub<BranchItemsListRequest, BranchItemsListResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/branches/:branchId/items',
        params: {
          branchId,
        },
        query: {
          query,
        },
      })
      .response({
        status: 200,
        body: itemsListResponseStub,
      });

    const actualList = await repo.listItems(query);

    assert.isOk(actualList);
  });
  it('should not add the query when not given a query spec', async function () {
    const repo = new CatalogueItemsRepoImpl();
    const branchId = 18751;
    const itemsListResponseStub = branchItemsListResponseStub();

    $sb
      .stub(authTokenRepo, 'getParsedToken')
      .resolves(
        new AuthToken({ sub: String(branchId), roles: [], exp: 0, iss: '0' })
      );
    await wiremock
      .stub<BranchItemsListRequest, BranchItemsListResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/branches/:branchId/items',
        params: {
          branchId,
        },
      })
      .response({
        status: 200,
        body: itemsListResponseStub,
      });

    const actualList = await repo.listItems();

    assert.isOk(actualList);
  });
  it('should add a cover photo url when there is an ID for it in the items list response', async function () {
    const repo = new CatalogueItemsRepoImpl();
    const branchId = 18751;
    const coverPhotoId = 5185;
    const itemsListResponseStub = branchItemsListResponseStub();
    const itemsListWithDefaultCoverPhotoIds: BranchItemsListResponse = {
      ...itemsListResponseStub,
      items: itemsListResponseStub.items.map((item) => ({
        ...item,
        defaultCoverPhotoId: coverPhotoId,
      })),
    };

    $sb
      .stub(authTokenRepo, 'getParsedToken')
      .resolves(
        new AuthToken({ sub: String(branchId), roles: [], exp: 0, iss: '0' })
      );
    await wiremock
      .stub<BranchItemsListRequest, BranchItemsListResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/branches/:branchId/items',
        params: {
          branchId,
        },
      })
      .response({
        status: 200,
        body: itemsListWithDefaultCoverPhotoIds,
      });

    const actualList = await repo.listItems();

    assert.isTrue(
      actualList.items.every(
        (item) =>
          item.coverPhoto ==
          createImageUrl({
            refType: ImageRefType.CATALOGUE_ITEM_COVER_IMAGE,
            refId: coverPhotoId,
          })
      )
    );
  });
  it('should not add a cover photo url when there is no ID for it in the items list response', async function () {
    const repo = new CatalogueItemsRepoImpl();
    const branchId = 18751;
    const itemsListResponseStub = branchItemsListResponseStub();
    const itemsListWithoutDefaultCoverPhotoIds: BranchItemsListResponse = {
      ...itemsListResponseStub,
      items: itemsListResponseStub.items.map((item) => ({
        ...item,
        defaultCoverPhotoId: 0,
      })),
    };

    $sb
      .stub(authTokenRepo, 'getParsedToken')
      .resolves(
        new AuthToken({ sub: String(branchId), roles: [], exp: 0, iss: '0' })
      );
    await wiremock
      .stub<BranchItemsListRequest, BranchItemsListResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/branches/:branchId/items',
        params: {
          branchId,
        },
      })
      .response({
        status: 200,
        body: itemsListWithoutDefaultCoverPhotoIds,
      });

    const actualList = await repo.listItems();

    assert.isTrue(actualList.items.every((item) => item.coverPhoto === ''));
  });
  it('should add a cover photo url when there is an ID for it in the single item response', async function () {
    const repo = new CatalogueItemsRepoImpl();
    const branchId = 18751;
    const itemId = 8975;
    const coverPhotoId = 18975;
    const itemResponseStub = consumerBranchItemResponseStub();
    const itemWithDefaultCoverPhotoId: ConsumerBranchItemResponse = {
      ...itemResponseStub,
      itemId,
      defaultCoverPhoto: coverPhotoId,
    };

    $sb
      .stub(authTokenRepo, 'getParsedToken')
      .resolves(
        new AuthToken({ sub: String(branchId), roles: [], exp: 0, iss: '0' })
      );
    await wiremock
      .stub<BranchItemRequest, ConsumerBranchItemResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/branches/:branchId/items/:itemId',
        params: {
          branchId,
          itemId,
        },
      })
      .response({
        status: 200,
        body: itemWithDefaultCoverPhotoId,
      });

    const actualItem = await repo.getItem(itemId);

    assert.equal(
      actualItem.coverPhoto,
      createImageUrl({
        refId: coverPhotoId,
        refType: ImageRefType.CATALOGUE_ITEM_COVER_IMAGE,
      })
    );
  });
  it('should not add a cover photo url when there is no ID for it in the single item response', async function () {
    const repo = new CatalogueItemsRepoImpl();
    const branchId = 18751;
    const itemId = 8975;
    const itemResponseStub = consumerBranchItemResponseStub();
    const itemWithoutDefaultCoverPhotoId: ConsumerBranchItemResponse = {
      ...itemResponseStub,
      itemId,
      defaultCoverPhoto: 0,
    };

    $sb
      .stub(authTokenRepo, 'getParsedToken')
      .resolves(
        new AuthToken({ sub: String(branchId), roles: [], exp: 0, iss: '0' })
      );
    await wiremock
      .stub<BranchItemRequest, ConsumerBranchItemResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/branches/:branchId/items/:itemId',
        params: {
          branchId,
          itemId,
        },
      })
      .response({
        status: 200,
        body: itemWithoutDefaultCoverPhotoId,
      });

    const actualItem = await repo.getItem(itemId);

    assert.strictEqual(actualItem.coverPhoto, '');
  });
});
