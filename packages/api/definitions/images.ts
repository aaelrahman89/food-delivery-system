export interface ImageCreationRequest {
  referenceType: ImageReferenceType;
  referenceId: number;
  payload: string;
  mimeType?: ImageMimeType;
  size?: number;
  resolution?: {
    width: number;
    height: number;
  };
  append: boolean;
}
export interface ImageCreationResponse {
  id: number;
  creationDate: string;
}
export type ImageDeletionRequest = void;
export type ImageDeletionResponse = void;

export type ImageReferenceType = string &
  (
    | 'taskReceiptImage'
    | 'pilotProfileImage'
    | 'vendorLogoImage'
    | 'vendorOnlineProfileLogo'
    | 'vendorOnlineProfileCover'
    | 'vendorOnlineProfileGallery'
    | 'UserProfileImage'
    | 'vendorReceiptImage'
    | 'bankLogoImage'
    | 'tagIcon'
    | 'tagGroupIcon'
  );
export type ImageMimeType = 'image/jpeg' | 'image/png' | 'image/svg+xml';
