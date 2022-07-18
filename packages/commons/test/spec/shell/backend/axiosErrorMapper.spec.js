import nodeAssert from 'assert';
import { errorCodes, errorModel } from '../../../../core/errors/errors';
import { mappedAxiosError } from '../../../../shell/backend/axiosErrorMapper';

describe('axiosErrorMapper module unit', function () {
  describe('mappedAxiosError', function () {
    context('when responding to a non-existing url', function () {
      it('should keep the message and return an errorModel with code WRONG_SERVER_PATH_ERROR', function () {
        const axiosError = {
          response: {
            data: 'non object',
            status: 404,
          },
          message: 'url not found',
        };

        nodeAssert.deepStrictEqual(
          mappedAxiosError(axiosError),
          errorModel({
            message: 'url not found',
            code: errorCodes.WRONG_SERVER_PATH_ERROR,
          })
        );
      });
    });

    context('when responding to a bad client request', function () {
      it('should keep the code and args, and map devDetails to the error message', function () {
        const axiosError = {
          response: {
            data: {
              devDetails: 'a testing error',
              code: 'UnAuthorizedException',
              args: {
                token: 'a token',
              },
            },
            status: 401,
          },
        };

        nodeAssert.deepStrictEqual(
          mappedAxiosError(axiosError),
          errorModel({
            message: 'a testing error',
            code: 'UnAuthorizedException',
            args: {
              token: 'a token',
            },
          })
        );
      });
    });

    context('when the responding with a server error ', function () {
      it('should keep the message and return an errorModel with code SERVER_ERROR', function () {
        const axiosError = {
          response: {
            status: 500,
          },
          message: 'server error',
        };

        nodeAssert.deepStrictEqual(
          mappedAxiosError(axiosError),
          errorModel({
            message: 'server error',
            code: errorCodes.SERVER_ERROR,
          })
        );
      });
    });

    context('when the request timeout', function () {
      it('should keep the message and return an errorModel with code CONNECTION_TIMEOUT_ERROR', function () {
        const axiosError = {
          request: {
            url: 'any',
          },
          message: 'connection timeout',
          code: 'ECONNABORTED',
        };

        nodeAssert.deepStrictEqual(
          mappedAxiosError(axiosError),
          errorModel({
            message: 'connection timeout',
            code: errorCodes.CONNECTION_TIMEOUT_ERROR,
          })
        );
      });
    });

    context('when the server does not respond at all', function () {
      it('should keep the message and return an errorModel with code CONNECTION_ERROR', function () {
        const axiosError = {
          request: {
            url: 'any',
          },
          message: 'connection error',
        };

        nodeAssert.deepStrictEqual(
          mappedAxiosError(axiosError),
          errorModel({
            message: 'connection error',
            code: errorCodes.CONNECTION_ERROR,
          })
        );
      });
    });

    context('when failed to make a request', function () {
      it('should keep the message and return an errorModel with code NETWORK_CLIENT_ERROR', function () {
        const axiosError = {
          message: 'blow up',
        };

        nodeAssert.deepStrictEqual(
          mappedAxiosError(axiosError),
          errorModel({
            message: 'blow up',
            code: errorCodes.NETWORK_CLIENT_ERROR,
          })
        );
      });
    });
  });
});
