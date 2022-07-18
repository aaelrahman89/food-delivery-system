/* eslint no-console: 'warn' */
import axios from 'axios';
import errors from '../../../core/deprecated/errors';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';

function NetworkModule() {
  const defaultOptions = {
    timeout: 40000,
  };

  async function request({
    method,
    url,
    data = '',
    options = {},
    authToken,
    httpClient = axios,
  } = {}) {
    const token = authToken ?? (await authTokenRepo.getToken());
    try {
      const response = await httpClient.request({
        method,
        url,
        data,
        headers: {
          'content-type': 'application/json',
          'authorization': `Bearer ${token}`,
        },
        ...options,
      });
      return response.data;
    } catch (err) {
      if (err.response && err.response.data && err.response.data.code) {
        const exception = err.response.data;
        if (errors.survv[exception.code]) {
          throw new Error(errors.survv[exception.code]);
        } else {
          throw new Error(errors.misc.unknown);
        }
      } else if (err.response && err.response.status >= 500) {
        throw new Error(errors.misc.server);
      }
      throw new Error(errors.misc.connection);
    }
  }

  return {
    get(url, options = defaultOptions) {
      return request({ method: 'get', url, options });
    },
    post(url, data = '', options = defaultOptions) {
      return request({
        method: 'post',
        url,
        data,
        options,
      });
    },
    // put(url, data, options = defaultOptions) {
    //   return request({
    //     method: 'put', url, data, options,
    //   });
    // },
    // delete(url, data, options = defaultOptions) {
    //   return request({
    //     method: 'delete', url, data, options,
    //   });
    // },
  };
}

const NetworkService = NetworkModule();

export default NetworkService;
