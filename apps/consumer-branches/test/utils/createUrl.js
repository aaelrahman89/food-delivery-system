import stringify from 'json-stable-stringify-without-jsonify';

const ORIGIN_OVERRIDE_KEY = 'baseUrl';
const apiPath = 'api';
const apiVersion = 'v1';

function getOriginOverride() {
  const origin = localStorage.getItem(ORIGIN_OVERRIDE_KEY);

  if (origin == null || origin == 'null') {
    return '';
  }

  return origin;
}

function createUrl(endpoint, endpointParams = null, queryParams = null) {
  const versionRegex = /^v\d{1,2}(\.\d{1,2})?\//;
  let createdUrl = '';

  if (versionRegex.test(endpoint)) {
    createdUrl = `${getOriginOverride()}/${apiPath}/${endpoint}`;
  } else {
    createdUrl = `${getOriginOverride()}/${apiPath}/${apiVersion}/${endpoint}`;
  }

  if (endpointParams != null && typeof endpointParams == 'object') {
    Object.entries(endpointParams).forEach(([key, value]) => {
      createdUrl = createdUrl.replace(new RegExp(`:${key}`, 'g'), `${value}`);
    });
  }

  if (queryParams != null && typeof queryParams == 'object') {
    const copiedQueryParams = JSON.parse(stringify(queryParams));
    const params = new URLSearchParams();
    Object.entries(copiedQueryParams)
      .sort()
      .forEach(([key, value]) => {
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

export default createUrl;
