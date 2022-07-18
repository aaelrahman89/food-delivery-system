import stringify from 'fast-json-stable-stringify';
import { Primitive, UrlString } from '../types';
import { Query } from '../models/Query';
import { RequestOptions } from '../../shell/backend/backend';
import {
  isEmpty,
  isNotEmpty,
  isNotPrimitive,
  isObject,
  isPrimitive,
} from './checks';

export function parseRequestLine(requestLine: string): {
  method: string;
  url: UrlString;
} {
  const [method, url] = requestLine.trim().split(/\s+/);
  return {
    method,
    url,
  };
}

export function reduceUrlParams(
  url: UrlString,
  params: Record<string, Primitive>
): UrlString {
  if (!isObject(params)) {
    return url;
  }
  return Object.entries(params).reduce(function urlParamsReducer(
    accumulator,
    paramKeyValuePair
  ) {
    const [key, value] = paramKeyValuePair;
    return accumulator.replace(new RegExp(`/:${key}`, 'g'), `/${value}`);
  },
  url);
}

export function reduceUrlQuery(url: string, query: Query): UrlString {
  if (!isObject(query)) {
    return url;
  }
  const queryString = Object.entries(query)
    .sort()
    .reduce(function urlQueryReducer(accumulator, paramKeyValuePair) {
      const [key, value] = paramKeyValuePair;

      if (isPrimitive(value) && isNotEmpty(value)) {
        accumulator.append(key, value as string);
        return accumulator;
      }

      if (isNotPrimitive(value) && isNotEmpty(value)) {
        accumulator.append(key, stringify(value));
        return accumulator;
      }

      return accumulator;
    }, new URLSearchParams())
    .toString();

  if (isEmpty(queryString)) {
    return url;
  }

  return `${url}?${queryString}`;
}

export function createUrl(urlOptions: UrlOptions): UrlString {
  const { url, params, query } = urlOptions;
  let createdUrl = url;

  if (isObject(params) && isNotEmpty(params)) {
    createdUrl = reduceUrlParams(createdUrl, params);
  }

  if (isObject(query) && isNotEmpty(query)) {
    createdUrl = reduceUrlQuery(createdUrl, query);
  }

  return createdUrl;
}

interface UrlOptions
  extends Pick<RequestOptions<undefined>, 'params' | 'query'> {
  url: UrlString;
}
