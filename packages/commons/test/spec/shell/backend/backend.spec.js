import axios from 'axios';
import nodeAssert from 'assert';
import { assert } from 'chai';
import { authTokenRepo } from '../../../../shell/repositories/AuthTokenRepoImpl';
import { mappedAxiosError } from '../../../../shell/backend/axiosErrorMapper';

import { $sb } from '../../../utils/sandbox';
import {
  addBaseUrlOverride,
  createBackendUrl,
  removeBaseUrlOverride,
  request,
} from '../../../../shell/backend/backend';
import { networkService } from '../../../../shell/backend/networkService';
import { storageKeys } from '../../../../core/models/Storage';

describe('backend module unit', function () {
  afterEach('remove stored item', async function () {
    await authTokenRepo.clearToken();
    window.localStorage.removeItem('baseUrl');
  });

  describe('addBaseUrlOverride', function () {
    it('should return the url as is when the override is empty', function () {
      window.localStorage.setItem(storageKeys.baseUrl, '');

      assert.equal(addBaseUrlOverride('/api/v1'), '/api/v1');
    });

    it('should prefix the url with the override if it was not empty', function () {
      window.localStorage.setItem(storageKeys.baseUrl, 'http://example.com');

      assert.equal(addBaseUrlOverride('/api/v1'), 'http://example.com/api/v1');
    });
  });

  describe('removeBaseUrlOverride', function () {
    it('should return the url as is when the override is empty', function () {
      window.localStorage.setItem(storageKeys.baseUrl, '');

      assert.equal(removeBaseUrlOverride('/api/v1'), '/api/v1');
    });
    it('should remove the baseUrl prefix when the override if it was not empty', function () {
      window.localStorage.setItem(storageKeys.baseUrl, 'http://example.com');

      assert.equal(
        removeBaseUrlOverride('http://example.com/api/v1'),
        '/api/v1'
      );
    });
  });

  describe('createBackendURL', function () {
    it('should prefix the url and add params and query to it successfully', function () {
      window.localStorage.setItem(storageKeys.baseUrl, 'http://example.com');

      const url = createBackendUrl({
        url: '/api/v1/tasks/:taskId',
        params: { taskId: 1234 },
        query: { a: 'query' },
      });

      assert.equal(url, 'http://example.com/api/v1/tasks/1234?a=query');
    });
  });

  describe('request', function () {
    it('should make network request successfully with all parameters and a default timeout of 30000', async function () {
      const axiosMock = $sb.mock(axios);
      const requestObject = {
        requestLine: 'post /api/v1/tasks/:taskId',
        params: { taskId: 1234 },
        query: { q1: 1234567890, q2: { nested: 'query' } },
        headers: {
          'authorization': 'authorization header',
          'content-type': 'text/plain',
        },
        body: 'a plain text body',
      };

      axiosMock
        .expects('request')
        .once()
        .withExactArgs({
          method: 'post',
          url: '/api/v1/tasks/1234?q1=1234567890&q2=%7B%22nested%22%3A%22query%22%7D',
          headers: {
            'authorization': 'authorization header',
            'content-type': 'text/plain',
          },
          data: 'a plain text body',
          timeout: 30000,
        })
        .returns({
          data: 'response',
        });

      await networkService.request(requestObject);

      axiosMock.verify();
    });

    it('should resolve with the parsed response data after a successful request', async function () {
      $sb.stub(axios, 'request').resolves({
        data: {
          an: 'object',
        },
      });

      assert.deepEqual(
        await request({
          requestLine: 'get anything',
        }),
        {
          an: 'object',
        }
      );
    });

    it('should reject with a mapped axios error when a network request fails', async function () {
      const axiosError = new Error('NetworkError');

      axiosError.request = {
        any: 'prop',
      };
      axiosError.response = {
        any: 'prop',
      };
      axiosError.code = 'a code';

      $sb.stub(axios, 'request').rejects(axiosError);

      await nodeAssert.rejects(
        () => request({ requestLine: 'get anything' }),
        mappedAxiosError(axiosError)
      );
    });

    context('when headers do not exist', function () {
      it('should add a content-type = application/json', async function () {
        const axiosMock = $sb.mock(axios);
        const requestObject = { requestLine: 'get /api/v1/tasks' };

        axiosMock
          .expects('request')
          .once()
          .withExactArgs({
            method: 'get',
            url: '/api/v1/tasks',
            headers: { 'content-type': 'application/json' },
            data: undefined,
            timeout: 30000,
          })
          .returns({
            data: 'response',
          });

        await request(requestObject);

        axiosMock.verify();
      });
      it('should add the authorization header if an authToken exists', async function () {
        await authTokenRepo.saveToken('authToken');

        const axiosMock = $sb.mock(axios);
        const requestObject = { requestLine: 'get /api/v1/tasks' };

        axiosMock
          .expects('request')
          .once()
          .withExactArgs({
            method: 'get',
            url: '/api/v1/tasks',
            headers: {
              'content-type': 'application/json',
              'authorization': 'Bearer authToken',
            },
            data: undefined,
            timeout: 30000,
          })
          .returns({
            data: 'response',
          });

        await request(requestObject);

        axiosMock.verify();
      });
    });
    context('when a baseUrl override exists', function () {
      it('should prefix the path with the baseUrl', async function () {
        localStorage.setItem(storageKeys.baseUrl, 'http://baseUrl');

        const axiosMock = $sb.mock(axios);
        const requestObject = { requestLine: 'get /api/v1/tasks' };

        axiosMock
          .expects('request')
          .once()
          .withExactArgs({
            method: 'get',
            url: 'http://baseUrl/api/v1/tasks',
            headers: { 'content-type': 'application/json' },
            data: undefined,
            timeout: 30000,
          })
          .returns({
            data: 'response',
          });

        await request(requestObject);

        axiosMock.verify();
      });
    });
  });
});
