import axios from 'axios';
import { authTokenRepo } from '../repositories/AuthTokenRepoImpl';
import { createUrl, parseRequestLine } from '../../core/utils/url';
import { isEmpty, isNotEmpty } from '../../core/utils/checks';
import { mappedAxiosError } from './axiosErrorMapper';
import { storageKeys } from '../../core/models/Storage';

const storage = window.localStorage;

export function addBaseUrlOverride(url) {
  const baseUrlOverride = storage.getItem(storageKeys.baseUrl);

  if (isEmpty(baseUrlOverride)) {
    return url;
  }

  return baseUrlOverride + url;
}

export function removeBaseUrlOverride(url) {
  const baseUrlOverride = storage.getItem(storageKeys.baseUrl);

  if (isEmpty(baseUrlOverride)) {
    return url;
  }

  return url.replace(baseUrlOverride, '');
}

export function createBackendUrl({ url, params, query }) {
  return createUrl({ url: addBaseUrlOverride(url), params, query });
}

export async function request({ requestLine, params, query, body, headers }) {
  try {
    const { method, url } = parseRequestLine(requestLine);
    const authToken = await authTokenRepo.getToken();
    const defaultHeaders = {
      'content-type': 'application/json',
    };

    if (isNotEmpty(authToken)) {
      defaultHeaders.authorization = `Bearer ${authToken}`;
    }

    const mergedHeaders = {
      ...defaultHeaders,
      ...headers,
    };

    const response = await axios.request({
      method,
      url: createBackendUrl({ url, params, query }),
      data: body,
      headers: mergedHeaders,
      timeout: 30000,
    });

    return response.data;
  } catch (err) {
    throw mappedAxiosError(err);
  }
}
