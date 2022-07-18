import NetworkService from '../../../../../src/shell/services-deprecated/network/NetworkService';
import axios from 'axios';
import errors from '../../../../../src/core/deprecated/errors';
import { $sb } from '@survv/commons/test/utils/sandbox';
import { assert } from 'chai';

describe('Network Service', function () {
  it('should throw errors.misc.connection if survv replies without exception code', async function () {
    $sb.stub(axios, 'request').throws({
      response: {
        data: 'ffds',
      },
    });
    try {
      await NetworkService.post('invalidurl');
      return Promise.reject(new Error('Should not reach this point'));
    } catch (err) {
      return assert.equal(err.message, errors.misc.connection);
    }
  });

  it('should throw errors.misc.unknown on unhandled survv exception code', async function () {
    $sb.stub(axios, 'request').throws({
      response: {
        data: {
          code: 'unhandled_code',
        },
      },
    });
    try {
      await NetworkService.get('/consumer/api/v1/vendors');
      return Promise.reject(new Error('Should not reach this point'));
    } catch (err) {
      return assert.equal(err.message, errors.misc.unknown);
    }
  });

  it('should throw errors.misc.server if server replies with status 500 and no exception code ', async function () {
    $sb.stub(axios, 'request').throws({
      response: {
        data: 'ffds',
        status: 500,
      },
    });
    try {
      await NetworkService.post('invalidurl');
      return Promise.reject(new Error('Should not reach this point'));
    } catch (err) {
      return assert.equal(err.message, errors.misc.server);
    }
  });
});
