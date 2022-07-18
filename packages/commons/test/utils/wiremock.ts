/* eslint no-console: 'off' */
import axios, { AxiosResponse } from 'axios';
import stringify from 'fast-json-stable-stringify';
import { HttpHeaders, RequestOptions } from '../../shell/backend/backend';
import { UrlString } from '../../core/types';
import { createUrl, parseRequestLine } from '../../core/utils/url';
import {
  isNotEmpty,
  isNotPrimitive,
  isObject,
  isPrimitive,
} from '../../core/utils/checks';
import { nokubeGateway } from '../../../../scripts/projectConfig';

const adminApi = `http://${nokubeGateway}/__admin`;
const addedMappingsIds: string[] = [];
const defaultResponseHeaders = Object.freeze({
  'content-type': 'application/json',
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'get, post, put, delete',
  'access-control-allow-headers': 'content-type, authorization',
});

class WiremockStub<Req, Res> {
  private _createdRequest: WiremockRequest<Req> | undefined;
  private _createdResponse: WiremockResponse | undefined;

  request(requestStub: RequestStub<Req>): this {
    const { requestLine, params, query, body, headers } = requestStub;
    const { method, url } = parseRequestLine(requestLine);

    const request: WiremockRequest<Req> = {
      url: createUrl({ url, params, query }),
      method: method.toUpperCase(),
      headers: undefined,
      bodyPatterns: undefined,
    };

    if (isObject(headers) && isNotEmpty(headers)) {
      request.headers = headers;
    }

    if (isNotPrimitive(body) && isNotEmpty(body)) {
      request.bodyPatterns = [
        {
          equalToJson: body,
        },
      ];
    }

    this._createdRequest = request;

    return this;
  }

  async response(responseStub: ResponseStub<Res>): Promise<void> {
    const { status, body, headers } = responseStub;
    const response: WiremockResponse = {
      status,
      headers: {
        ...defaultResponseHeaders,
        ...headers,
      },
    };

    if (isPrimitive(body) && isNotEmpty(body)) {
      response.headers['content-type'] = 'text';
    } else {
      response.body = stringify(body);
    }

    this._createdResponse = response;

    await this._addMapping(
      this._createdRequest as NonNullable<WiremockRequest<Req>>,
      this._createdResponse
    );
  }

  async _addMapping(
    request: WiremockRequest<Req>,
    response: WiremockResponse
  ): Promise<void> {
    try {
      const result = await axios.post(`${adminApi}/mappings`, {
        request,
        response,
      });
      addedMappingsIds.push(result.data.id);
    } catch (err) {
      console.error('WIREMOCK ERROR: Cannot add stub');
      console.error(err.response.data);
    }
  }
}

class Wiremock {
  private _rules: WiremockRule[];

  constructor() {
    this._rules = [];
  }

  async setup(): Promise<void> {
    await this._saveExistingRules();
    await this._clearExistingRules();
  }

  async teardown(): Promise<void> {
    await this._deleteAddedMappings();
    await this._restoreSavedRules();
  }

  async clearAddedStubs(): Promise<void> {
    await this._deleteAddedMappings();
  }

  stub<Req, Res>(): WiremockStub<Req, Res> {
    return new WiremockStub();
  }

  private async _saveExistingRules(): Promise<void> {
    const result = await axios.get(`${adminApi}/mappings`);
    this._rules = result.data.mappings;
  }

  private async _clearExistingRules(): Promise<void> {
    await axios.post(`${adminApi}/reset`);
  }

  private async _restoreSavedRules(): Promise<void> {
    const promises: Promise<AxiosResponse>[] = [];

    this._rules.forEach((rule) =>
      promises.push(axios.post(`${adminApi}/mappings`, rule))
    );

    await Promise.all(promises);
  }

  private async _deleteAddedMappings(): Promise<void> {
    const promises: Promise<AxiosResponse>[] = [];

    addedMappingsIds.forEach((mappingId) => {
      promises.push(axios.delete(`${adminApi}/mappings/${mappingId}`));
    });

    await Promise.all(promises);
    // clear the array
    addedMappingsIds.length = 0;
  }
}

export const wiremock = new Wiremock();

type RequestStub<T> = RequestOptions<T>;

interface ResponseStub<T> extends Pick<RequestOptions<T>, 'body' | 'headers'> {
  status: number;
}

interface WiremockRequest<T> {
  url: UrlString;
  method: string;
  headers?: HttpHeaders;
  bodyPatterns?: [
    {
      equalToJson: T;
    }
  ];
}

interface WiremockResponse {
  status: number;
  headers: HttpHeaders;
  body?: string;
}

interface WiremockBodyPatterns {
  equalToJson?: Record<string, unknown>;
}
interface WiremockRule {
  id: string;
  request: {
    url: string;
    method: string;
    bodyPatterns?: WiremockBodyPatterns[];
  };
  response: {
    status: number;
    body?: string;
    headers?: Record<string, string>;
  };
  uuid: string;
}
