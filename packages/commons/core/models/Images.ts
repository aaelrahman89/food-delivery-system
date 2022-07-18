import { EntityId } from '../types';
import { EnumClass } from './EnumClass';
import { createBackendUrl } from '../../shell/backend/backend';

export type ImageUrlString = string;
export class ImageRefType extends EnumClass {
  static VENDOR_ONLINE_PROFILE_LOGO = new ImageRefType(
    'vendorOnlineProfileLogo'
  );

  static VENDOR_ONLINE_PROFILE_COVER_PHOTO = new ImageRefType(
    'vendorOnlineProfileCover'
  );

  static VENDOR_ONLINE_PROFILE_GALLERY_IMAGE = new ImageRefType(
    'vendorOnlineProfileGallery'
  );

  static TASK_C2C_RECEIPT = new ImageRefType('errandItemReceipt');
  static TASK_B2B_RECEIPT = new ImageRefType('taskReceiptImage');

  static VENDOR_OPS_LOGO = new ImageRefType('vendorLogoImage');
  static OPS_USER_PROFILE_IMAGE = new ImageRefType('UserProfileImage');
  static CATALOGUE_ITEM_GALLERY_IMAGE = new ImageRefType(
    'catalogueItemGallery'
  );

  static C2C_BRAND_ICON = new ImageRefType('c2cBrandIcon');
  static CATALOGUE_ITEM_COVER_IMAGE = new ImageRefType('catalogueItemCover');
  static PILOT_PROFILE_IMAGE = new ImageRefType('pilotProfileImage');

  static ERRAND_CATEGORY_ICON = new ImageRefType('errandCategoryIcon');

  protected readonly _prefix: string;

  constructor(value: string) {
    super(value);
    this._prefix = 'IMAGE_REF_TYPE';
  }
}
export function createImageUrl(
  options: ImageUrlCreationOptions
): ImageUrlString {
  return createBackendUrl({
    url: '/api/v1/images',
    query: {
      referenceType: options.refType.valueOf(),
      referenceId: options.refId,
    },
  });
}

interface ImageUrlCreationOptions {
  refType: ImageRefType;
  refId: EntityId;
}
