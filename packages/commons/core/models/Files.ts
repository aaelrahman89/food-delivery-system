import { DataUrl } from '../types';

export class Base64EncodedFile {
  readonly dataUrl: DataUrl;
  readonly type: string;
  // TODO: remove this as it's useless
  readonly name: string;

  constructor({ dataUrl, type, name = 'binary-blob' }: DataUrlParsedFile) {
    this.dataUrl = dataUrl;
    this.type = type;
    this.name = name;
  }

  get base64String(): string {
    return this.dataUrl.split(',').pop() as NonNullable<string>;
  }

  toString(): string {
    return this.dataUrl;
  }

  valueOf(): string {
    return this.dataUrl;
  }
}

export type FileType = 'image/jpeg' | 'image/png' | 'image/svg+xml';
export type FileExtension = '.jpeg' | '.jpg' | '.png' | '.svg';

interface DataUrlParsedFile {
  dataUrl: string;
  type: string;
  name?: string;
}

export interface FileReadingOptions {
  fileReader?: FileReader;
}

export interface FileLoader {
  limit: number;
  types: string[];
  extensions: string[];

  loadAsBase64(
    file: File,
    options?: FileReadingOptions
  ): Promise<Base64EncodedFile>;
}
