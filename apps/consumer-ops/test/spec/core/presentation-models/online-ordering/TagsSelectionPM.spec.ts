import { $sb } from '@survv/commons/test/utils/sandbox';
import {
  BottomSheetListGroup,
  BottomSheetListItem,
} from '@survv/commons/core/models/ItemsList';
import { HashTagStatus } from '../../../../../src/core/models/HashTagStatus';
import { LocalError } from '@survv/commons/core/errors/errors';
import { TagStatus } from '../../../../../src/core/models/TagStatus';
import { TagType } from '../../../../../src/core/models/TagType';
import { TagsSelectionPM } from '../../../../../src/core/presentation-models/online-ordering/TagsSelectionPM';
import { UnifiedTag } from '../../../../../src/core/models/UnifiedTag';
import { UnifiedTagsRepoImpl } from '../../../../../src/shell/repositories/online-ordering/UnifiedTagsRepoImpl';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { assert } from 'chai';
import { createNotification } from '../../../../../src/core/notification/notification';
import { hashTagsListResponseStub } from '@survv/api/stubs/hash-tags';
import { mapTagsAndHashTagsToUnifiedTagsList } from '../../../../../src/shell/repositories/online-ordering/mappers/responses';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { tagsListResponseStub } from '@survv/api/stubs/tags';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('TagsSelectionPM', function () {
  it('hydrate tags list grouped by tag type', async function () {
    const pm = new TagsSelectionPM({
      unifiedTagsRepo: new UnifiedTagsRepoImpl(),
      notificationService,
      vendorType: VendorType.FOOD,
    });
    const tagsQuery = {
      vgql: 'v1',
      filter: {
        elements: [
          {
            field: 'vendorType',
            operator: 'eq',
            value: VendorType.FOOD.valueOf(),
          },
          {
            field: 'type',
            operator: 'in',
            value: TagType.lookup()
              .filter((type) => TagType.HASH_TAG.notEqual(type))
              .map((type) => type.valueOf()),
          },
          {
            field: 'status',
            operator: 'eq',
            value: TagStatus.VISIBLE.valueOf(),
          },
        ],
      },
    };
    const hashTagsQuery = {
      vgql: 'v1',
      filter: {
        elements: [
          {
            field: 'vendorType',
            operator: 'eq',
            value: VendorType.FOOD.valueOf(),
          },
          {
            field: 'status',
            operator: 'eq',
            value: HashTagStatus.VISIBLE.valueOf(),
          },
        ],
      },
    };
    const tagsStub = tagsListResponseStub();
    const hashTagsStub = hashTagsListResponseStub();
    const unifiedTagsList = mapTagsAndHashTagsToUnifiedTagsList(
      tagsStub,
      hashTagsStub
    );
    const tagGroupsMap = new Map<string, BottomSheetListItem<UnifiedTag>[]>();
    unifiedTagsList.items.forEach((tag) => {
      const group = tag.type.toString();
      if (!tagGroupsMap.has(group)) {
        tagGroupsMap.set(group, []);
      }
      tagGroupsMap.set(group, [
        ...tagGroupsMap.get(group)!,
        {
          id: tag.id,
          icon: tag.icon,
          label: tag.name,
          value: tag,
        },
      ]);
    });
    const unifiedTagGroups: BottomSheetListGroup<UnifiedTag>[] = Array.from(
      tagGroupsMap.entries(),
      ([key, value]) => {
        return {
          name: key,
          items: value,
        };
      }
    );

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/tags',
        query: {
          query: tagsQuery,
        },
      })
      .response({ status: 200, body: tagsStub });
    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/hash-tags',
        query: {
          query: hashTagsQuery,
        },
      })
      .response({ status: 200, body: hashTagsStub });

    await pm.hydrateTags({ types: TagType.lookup() });

    assert.deepEqual(pm.tagsSelectionsList, unifiedTagGroups);
  });

  it('notifies tags list hydration errors', async function () {
    const pm = new TagsSelectionPM({
      unifiedTagsRepo: new UnifiedTagsRepoImpl(),
      notificationService,
      vendorType: VendorType.FOOD,
    });

    const error = new LocalError({
      message: 'error message',
      code: 'BAD_OPERATION',
    });

    $sb
      .stub(UnifiedTagsRepoImpl.prototype, 'listVisibleTagsByType')
      .rejects(error);

    await pm.hydrateTags({ types: TagType.lookup() });

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
});
