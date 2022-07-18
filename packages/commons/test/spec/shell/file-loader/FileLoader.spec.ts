import nodeAssert from 'assert';
import {
  Base64EncodedFile,
  FileExtension,
  FileType,
} from '../../../../core/models/Files';
import { FileLoaderImpl } from '../../../../shell/file-loader/FileLoaderImpl';
import { assert } from 'chai';
import { errorCodes, errorModel } from '../../../../core/errors/errors';

describe('FileLoader unit', function () {
  describe('loadAsBase64', function () {
    it('rejects with a FILE_LIMIT_EXCEEDED if file size is greater than 5MB', async function () {
      const fileLoader = new FileLoaderImpl();

      await nodeAssert.rejects(
        fileLoader.loadAsBase64({
          size: 50 * 1024 * 1024,
        } as File),
        errorModel({
          message: 'File limit exceeded',
          code: errorCodes.FILE_LIMIT_EXCEEDED,
          args: { limitInMegaBytes: 5 },
        })
      );
    });

    it('accepts arbitrary limits', async function () {
      const fileLoader = new FileLoaderImpl({ limit: 2 * 1024 * 1024 });

      await nodeAssert.rejects(
        fileLoader.loadAsBase64({
          size: 50 * 1024 * 1024,
        } as File),
        errorModel({
          message: 'File limit exceeded',
          code: errorCodes.FILE_LIMIT_EXCEEDED,
          args: { limitInMegaBytes: 2 },
        })
      );
    });

    it('rejects with a BAD_FILE_TYPE and extensions as args when the file type does not match given mediaTypes', async function () {
      const types: FileType[] = ['image/jpeg', 'image/png'];
      const extensions: FileExtension[] = ['.jpg', '.jpeg', '.png'];

      const fileLoader = new FileLoaderImpl({
        types,
        extensions,
      });

      await nodeAssert.rejects(
        fileLoader.loadAsBase64({
          size: 4 * 1024 * 1024,
          type: 'text/plain',
        } as File),
        errorModel({
          message: 'Wrong file type',
          code: errorCodes.BAD_FILE_TYPE,
          args: {
            fileType: 'text/plain',
            acceptedTypes: extensions.join(','),
          },
        })
      );
    });

    it('resolves with a base64EncodedFile', async function () {
      const fileLoader = new FileLoaderImpl();

      const fileMock = {
        size: 4 * 1024 * 1024,
        type: 'image/jpeg',
      };

      const fileReaderMock = {
        result: 'data:text/plain;base64,aGVsbG8=',
        onload: (ev: unknown) => ev,
        readAsDataURL() {
          this.onload({
            target: this,
          });
        },
      };

      assert.deepEqual(
        await fileLoader.loadAsBase64(fileMock as File, {
          fileReader: fileReaderMock as unknown as FileReader,
        }),
        new Base64EncodedFile({
          dataUrl: fileReaderMock.result,
          type: fileMock.type,
        })
      );
    });

    it('rejects with TECHNICAL_ERROR on file loading error', async function () {
      const fileLoader = new FileLoaderImpl();

      const fileMock = {
        size: 4 * 1024 * 1024,
      };

      const error = new Error('testing error');
      const fileReaderMock = {
        error,
        onerror: (ev: unknown) => ev,
        readAsDataURL() {
          this.onerror({
            target: this,
          });
        },
      };

      await nodeAssert.rejects(
        fileLoader.loadAsBase64(fileMock as File, {
          fileReader: fileReaderMock as unknown as FileReader,
        }),
        errorModel({
          message: error.message,
          code: errorCodes.TECHNICAL_ERROR,
        })
      );
    });

    it('rejects with TECHNICAL_ERROR on file loading abort', async function () {
      const fileLoader = new FileLoaderImpl();

      const fileMock = {
        size: 4 * 1024 * 1024,
      };

      const error = new Error('testing error');
      const fileReaderMock = {
        error,
        onabort: (ev: unknown) => ev,
        readAsDataURL() {
          this.onabort({
            target: this,
          });
        },
      };

      await nodeAssert.rejects(
        fileLoader.loadAsBase64(fileMock as File, {
          fileReader: fileReaderMock as unknown as FileReader,
        }),
        errorModel({
          message: error.message,
          code: errorCodes.TECHNICAL_ERROR,
        })
      );
    });
  });
});
