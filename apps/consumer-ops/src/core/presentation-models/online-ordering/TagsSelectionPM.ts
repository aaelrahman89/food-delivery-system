import { BasePM } from '@survv/commons/core/base/BasePM';
import { BottomSheetListGroup } from '@survv/commons/core/models/ItemsList';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { TagType } from '../../models/TagType';
import { UnifiedTag } from '../../models/UnifiedTag';
import { UnifiedTagsRepo } from '../../repositories/UnifiedTagsRepo';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { createNotification } from '../../notification/notification';

interface TagsSelectionPMOptions {
  unifiedTagsRepo: UnifiedTagsRepo;
  notificationService: NotificationService;
  vendorType: VendorType;
}

export class TagsSelectionPM extends BasePM {
  private readonly _unifiedTagsRepo: UnifiedTagsRepo;
  private readonly _notificationService: NotificationService;
  private _unifiedTags: UnifiedTag[];
  private readonly _vendorType: VendorType;

  constructor({
    unifiedTagsRepo,
    notificationService,
    vendorType,
  }: TagsSelectionPMOptions) {
    super();
    this._unifiedTagsRepo = unifiedTagsRepo;
    this._notificationService = notificationService;
    this._unifiedTags = [];
    this._vendorType = vendorType;
  }

  get tagsSelectionsList(): BottomSheetListGroup<UnifiedTag>[] {
    const groupedTags = new Map<string, UnifiedTag[]>();
    this._unifiedTags.forEach((tag) => {
      const group = tag.type.toString();
      if (!groupedTags.has(group)) {
        groupedTags.set(group, []);
      }
      groupedTags.set(group, [...groupedTags.get(group)!, tag]);
    });

    return Array.from(groupedTags.entries(), ([groupName, tags]) => ({
      name: groupName,
      items: tags.map((tag) => {
        return {
          id: tag.id,
          label: tag.name,
          icon: tag.icon,
          value: tag,
        };
      }),
    }));
  }

  async hydrateTags(options: { types: TagType[] }): Promise<void> {
    try {
      const { items } = await this._unifiedTagsRepo.listVisibleTagsByType(
        options.types,
        this._vendorType
      );
      this._unifiedTags = items;
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }
}
