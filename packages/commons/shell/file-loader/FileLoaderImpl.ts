import {
  Base64EncodedFile,
  FileLoader,
  FileReadingOptions,
} from '../../core/models/Files';
import { errorCodes, errorModel } from '../../core/errors/errors';

export class FileLoaderImpl implements FileLoader {
  readonly limit: number;
  readonly types: string[];
  readonly extensions: string[];

  constructor(options: FileLoaderOptions = {}) {
    const { types = [], extensions = [], limit = 5 * 1024 * 1024 } = options;

    this.types = types;
    this.extensions = extensions;
    this.limit = limit;
  }

  async loadAsBase64(
    file: Blob,
    options: FileReadingOptions = {}
  ): Promise<Base64EncodedFile> {
    return new Promise((resolve, reject) => {
      try {
        const { fileReader = new FileReader() } = options;
        this._validateLimit(file);
        this._validateType(file);

        fileReader.onload = (event): void => {
          resolve(
            new Base64EncodedFile({
              dataUrl: (event.target as FileReader).result as string,
              type: file.type,
              name: (file as File).name,
            })
          );
        };

        fileReader.onerror = (event): void => {
          reject(
            errorModel({
              message: ((event.target as FileReader).error as DOMException)
                .message,
              code: errorCodes.TECHNICAL_ERROR,
            })
          );
        };

        fileReader.onabort = (event): void => {
          reject(
            errorModel({
              message: ((event.target as FileReader).error as DOMException)
                .message,
              code: errorCodes.TECHNICAL_ERROR,
            })
          );
        };

        fileReader.readAsDataURL(file);
      } catch (err) {
        reject(err);
      }
    });
  }

  _validateLimit(file: Blob): void {
    if (file.size > this.limit) {
      throw errorModel({
        message: 'File limit exceeded',
        code: errorCodes.FILE_LIMIT_EXCEEDED,
        args: { limitInMegaBytes: this.limit / 1024 / 1024 },
      });
    }
  }

  _validateType(file: Blob): void {
    if (this.types.length > 0 && !this.types.includes(file.type)) {
      throw errorModel({
        message: 'Wrong file type',
        code: errorCodes.BAD_FILE_TYPE,
        args: {
          fileType: file.type,
          acceptedTypes: this.extensions.join(','),
        },
      });
    }
  }
}

interface FileLoaderOptions {
  types?: string[];
  extensions?: string[];
  limit?: number;
}
