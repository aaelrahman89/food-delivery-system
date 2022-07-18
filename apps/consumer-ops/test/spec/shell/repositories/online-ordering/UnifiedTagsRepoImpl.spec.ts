import { $sb } from '@survv/commons/test/utils/sandbox';
import { HashTagStatus } from '../../../../../src/core/models/HashTagStatus';
import { TagStatus } from '../../../../../src/core/models/TagStatus';
import { TagType } from '../../../../../src/core/models/TagType';
import { UnifiedTagsRepoImpl } from '../../../../../src/shell/repositories/online-ordering/UnifiedTagsRepoImpl';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { assert } from 'chai';
import { hashTagsListResponseStub } from '@survv/api/stubs/hash-tags';
import {
  mapHashTagsListToUnifiedTagsList,
  mapTagsListToUnifiedTagsList,
} from '../../../../../src/shell/repositories/online-ordering/mappers/responses';
import { networkService } from '@survv/commons/shell/backend/networkService';
import { tagsListResponseStub } from '@survv/api/stubs/tags';

describe('UnifiedTagsRepoImpl', function () {
  it('fetches hash tags when requested tag types includes hash tags', async function () {
    const repo = new UnifiedTagsRepoImpl();
    const vendorType = VendorType.FOOD;
    const tagTypes = [TagType.HASH_TAG];
    const hashTagsQuerySpec = {
      vgql: 'v1',
      filter: {
        elements: [
          {
            field: 'vendorType',
            operator: 'eq',
            value: vendorType.valueOf(),
          },
          {
            field: 'status',
            operator: 'eq',
            value: HashTagStatus.VISIBLE.valueOf(),
          },
        ],
      },
    };
    const requestStub = $sb
      .stub(networkService, 'request')
      .resolves(hashTagsListResponseStub());

    const result = await repo.listVisibleTagsByType(tagTypes, vendorType);

    assert.deepEqual(
      result,
      mapHashTagsListToUnifiedTagsList(hashTagsListResponseStub())
    );
    $sb.assert.calledOnce(requestStub);
    $sb.assert.calledWith(requestStub, {
      requestLine: 'get /consumer/api/v1/hash-tags',
      query: {
        query: hashTagsQuerySpec,
      },
    });
  });
  it('fetches the tags when the requested tags types includes ', async function () {
    const repo = new UnifiedTagsRepoImpl();
    const vendorType = VendorType.FOOD;
    const tagTypes = TagType.lookup().filter((type) =>
      TagType.HASH_TAG.notEqual(type)
    );
    const tagsQuerySpec = {
      vgql: 'v1',
      filter: {
        elements: [
          {
            field: 'vendorType',
            operator: 'eq',
            value: vendorType.valueOf(),
          },
          {
            field: 'type',
            operator: 'in',
            value: tagTypes.map((type) => type.valueOf()),
          },
          {
            field: 'status',
            operator: 'eq',
            value: TagStatus.VISIBLE.valueOf(),
          },
        ],
      },
    };

    const requestStub = $sb
      .stub(networkService, 'request')
      .resolves(tagsListResponseStub());

    const result = await repo.listVisibleTagsByType(
      tagTypes as TagType[],
      vendorType
    );

    assert.deepEqual(
      result,
      mapTagsListToUnifiedTagsList(tagsListResponseStub())
    );
    $sb.assert.calledOnce(requestStub);
    $sb.assert.calledWith(requestStub, {
      requestLine: 'get /consumer/api/v1/tags',
      query: {
        query: tagsQuerySpec,
      },
    });
  });
});
