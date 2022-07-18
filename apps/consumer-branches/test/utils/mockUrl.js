import stringify from 'json-stable-stringify-without-jsonify';

const apiPath = 'api';
const apiVersion = 'v1';

export function mockUrl(endpoint, endpointParams = null, queryParams = null) {
  const versionRegex = /^v\d{1,2}(\.\d{1,2})?\//;
  let createdUrl = '';

  if (versionRegex.test(endpoint)) {
    createdUrl = `/${apiPath}/${endpoint}`;
  } else {
    createdUrl = `/${apiPath}/${apiVersion}/${endpoint}`;
  }

  if (endpointParams != null && typeof endpointParams == 'object') {
    Object.entries(endpointParams).forEach(([key, value]) => {
      createdUrl = createdUrl.replace(new RegExp(`:${key}`, 'g'), `${value}`);
    });
  }

  if (queryParams != null && typeof queryParams == 'object') {
    const params = new URLSearchParams();
    const copiedQueryParams = JSON.parse(stringify(queryParams));
    Object.entries(copiedQueryParams).forEach(([key, value]) => {
      if (value != null && typeof value == 'object') {
        params.append(key, stringify(value));
      } else {
        params.append(key, value);
      }
    });
    if (params.toString().length) {
      createdUrl += `?${params.toString()}`;
    }
  }

  return createdUrl;
}

export function mockConsumerUrl(
  endpoint,
  endpointParams = null,
  queryParams = null
) {
  const versionRegex = /^v\d{1,2}(\.\d{1,2})?\//;
  let createdUrl = '';

  if (versionRegex.test(endpoint)) {
    createdUrl = `/consumer/${apiPath}/${endpoint}`;
  } else {
    createdUrl = `/consumer/${apiPath}/${apiVersion}/${endpoint}`;
  }

  if (endpointParams != null && typeof endpointParams == 'object') {
    Object.entries(endpointParams).forEach(([key, value]) => {
      createdUrl = createdUrl.replace(new RegExp(`:${key}`, 'g'), `${value}`);
    });
  }

  if (queryParams != null && typeof queryParams == 'object') {
    const params = new URLSearchParams();
    const copiedQueryParams = JSON.parse(stringify(queryParams));
    Object.entries(copiedQueryParams).forEach(([key, value]) => {
      if (value != null && typeof value == 'object') {
        params.append(key, stringify(value));
      } else {
        params.append(key, value);
      }
    });
    if (params.toString().length) {
      createdUrl += `?${params.toString()}`;
    }
  }

  return createdUrl;
}

export default mockUrl;
