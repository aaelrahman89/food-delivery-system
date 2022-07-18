import { errorCodes, errorModel } from '../../core/errors/errors';
import { isObject } from '../../core/utils/checks';

export function mappedAxiosError({ response, request, message, code }) {
  if (response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { data, status } = response;
    if ([400, 401, 404, 409].includes(status)) {
      if (isObject(data)) {
        // backend usually replies with a data object
        return errorModel({
          message: data.devDetails,
          code: data.code,
          args: data.args,
        });
      }

      return errorModel({
        message,
        code: errorCodes.WRONG_SERVER_PATH_ERROR,
      });
    }

    // ingress replies with HTML or empty reply
    return errorModel({
      message,
      code: errorCodes.SERVER_ERROR,
    });
  }

  if (request) {
    // The request was made but no response was received
    if (code == 'ECONNABORTED') {
      return errorModel({
        message,
        code: errorCodes.CONNECTION_TIMEOUT_ERROR,
      });
    }

    return errorModel({
      message,
      code: errorCodes.CONNECTION_ERROR,
    });
  }

  // Something happened in setting up the request that triggered an Error
  return errorModel({
    message,
    code: errorCodes.NETWORK_CLIENT_ERROR,
  });
}
