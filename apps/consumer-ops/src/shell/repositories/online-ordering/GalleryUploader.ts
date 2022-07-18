import { Base64EncodedFile } from '@survv/commons/core/models/Files';
import { EntityId } from '@survv/commons/core/types';
import { FileLoaderImpl } from '@survv/commons/shell/file-loader/FileLoaderImpl';
import {
  ImageCreationRequest,
  ImageCreationResponse,
  ImageDeletionRequest,
  ImageDeletionResponse,
  ImageMimeType,
  ImageReferenceType,
} from '@survv/api/definitions/images';
import {
  ImageRefType,
  ImageUrlString,
} from '@survv/commons/core/models/Images';
import { networkService } from '@survv/commons/shell/backend/networkService';
import { removeBaseUrlOverride } from '@survv/commons/shell/backend/backend';

async function imageUrlToBase64EncodedFile(
  image: GalleryImage
): Promise<Base64EncodedFile> {
  if (image instanceof Base64EncodedFile) {
    return image;
  }
  const blob = await fetch(image).then((response: Response) => response.blob());
  return new FileLoaderImpl().loadAsBase64(blob);
}

class GalleryUploader {
  private _entityId: EntityId;
  private _coverPhotoRefType: ImageRefType;
  private _albumImageRefType: ImageRefType;
  private _oldGallery: GalleryImage[];
  private _oldCoverPhoto: GalleryImage;
  private _newGallery: GalleryImage[];
  private _newCoverPhoto: GalleryImage;
  private _networkService = networkService;

  constructor(options: GalleryServiceOptions) {
    const {
      entityId,
      coverPhotoRefType,
      albumImageRefType,
      oldGallery,
      newGallery,
      oldCoverPhoto,
      newCoverPhoto,
    } = options;
    this._entityId = entityId;
    this._coverPhotoRefType = coverPhotoRefType;
    this._albumImageRefType = albumImageRefType;
    this._newGallery = newGallery;
    this._newCoverPhoto = newCoverPhoto;
    this._oldGallery = oldGallery;
    this._oldCoverPhoto = oldCoverPhoto;
  }

  async upload(): Promise<void> {
    const { coverPhoto, gallery, deletedImages } =
      await this._resolveUpdatedGallery();
    await this._handleCoverPhotoUpload(coverPhoto);
    await this._handleGalleryImagesUpload(gallery);
    await this._handleGalleryImagesDeletion(deletedImages);
  }

  private async _handleCoverPhotoUpload(
    coverPhoto?: Base64EncodedFile
  ): Promise<ImageCreationResponse | undefined> {
    if (!coverPhoto) {
      return undefined;
    }
    return this._networkService.request<
      ImageCreationRequest,
      ImageCreationResponse
    >({
      requestLine: 'post /api/v1/files',
      body: {
        referenceId: this._entityId,
        referenceType: this._coverPhotoRefType.valueOf() as ImageReferenceType,
        payload: coverPhoto.base64String,
        mimeType: coverPhoto.type as ImageMimeType,
        append: false,
      },
    });
  }

  private async _handleGalleryImagesUpload(
    gallery: Base64EncodedFile[]
  ): Promise<void> {
    // eslint-disable-next-line no-restricted-syntax
    for (const image of gallery) {
      // eslint-disable-next-line no-await-in-loop
      await this._networkService.request<
        ImageCreationRequest,
        ImageCreationResponse
      >({
        requestLine: 'post /api/v1/files',
        body: {
          referenceId: this._entityId,
          referenceType:
            this._albumImageRefType.valueOf() as ImageReferenceType,
          payload: image.base64String,
          mimeType: image.type as ImageMimeType,
          append: true,
        },
      });
    }
  }

  private async _handleGalleryImagesDeletion(
    deletedImages: ImageUrlString[]
  ): Promise<void> {
    // eslint-disable-next-line no-restricted-syntax
    for (const imageUrl of deletedImages) {
      // eslint-disable-next-line no-await-in-loop
      await this._networkService.request<
        ImageDeletionRequest,
        ImageDeletionResponse
      >({
        requestLine: `delete ${removeBaseUrlOverride(imageUrl)}`,
      });
    }
  }

  private async _resolveUpdatedGallery(): Promise<ResolvedGallery> {
    let coverPhoto: Base64EncodedFile | undefined;
    let gallery: Base64EncodedFile[];
    let deletedImages: ImageUrlString[];

    // mark new photos for upload
    gallery = this._extractBase64GalleryImages();
    // mark images for deletion
    deletedImages = this._extractDeletedImages();

    // if user has changed the cover photo without deleting old one
    if (this._shouldUploadOldCoverWithGallery) {
      gallery = [
        await imageUrlToBase64EncodedFile(this._oldCoverPhoto),
        ...gallery,
      ];
    }

    // if user selected old image as cover photo
    // the old cover photo should be uploaded in the gallery
    // and the promoted image should be deleted from the gallery
    if (this._hasPromotedOldImageToCoverPhoto) {
      deletedImages = [this._newCoverPhoto as string, ...deletedImages];
    }

    if (this._hasChangedCoverPhoto) {
      coverPhoto = await imageUrlToBase64EncodedFile(this._newCoverPhoto);
    }

    return {
      coverPhoto,
      gallery,
      deletedImages,
    };
  }

  private get _hasPromotedOldImageToCoverPhoto(): boolean {
    return (
      this._newCoverPhoto != this._oldCoverPhoto &&
      this._oldGallery.includes(this._newCoverPhoto)
    );
  }

  private get _shouldUploadOldCoverWithGallery(): boolean {
    return (
      this._oldCoverPhoto != this._newCoverPhoto &&
      this._newGallery.includes(this._oldCoverPhoto)
    );
  }

  private get _hasChangedCoverPhoto(): boolean {
    return this._newCoverPhoto != this._oldCoverPhoto;
  }

  private _extractBase64GalleryImages(): Base64EncodedFile[] {
    return this._newGallery.filter(
      (image) =>
        image instanceof Base64EncodedFile && image != this._newCoverPhoto
    ) as Base64EncodedFile[];
  }

  private _extractDeletedImages(): ImageUrlString[] {
    // existing are always URL_Strings
    return this._oldGallery.filter(
      (image) =>
        image != this._oldCoverPhoto &&
        image != this._newCoverPhoto &&
        !this._newGallery.includes(image)
    ) as string[];
  }
}

export async function uploadGallery(
  options: GalleryServiceOptions
): Promise<void> {
  return new GalleryUploader(options).upload();
}

interface GalleryServiceOptions {
  entityId: EntityId;
  coverPhotoRefType: ImageRefType;
  albumImageRefType: ImageRefType;
  oldGallery: GalleryImage[];
  oldCoverPhoto: GalleryImage;
  newGallery: GalleryImage[];
  newCoverPhoto: GalleryImage;
}

interface ResolvedGallery {
  coverPhoto?: Base64EncodedFile;
  gallery: Base64EncodedFile[];
  deletedImages: ImageUrlString[];
}

type GalleryImage = Base64EncodedFile | ImageUrlString;
