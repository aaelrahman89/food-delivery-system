import GetAlbumProcessor from '../../../../../src/core/deprecated/images/GetAlbumProcessor';
import NetworkService from '../../../../../src/shell/services-deprecated/network/NetworkService';
import { $sb } from '@survv/commons/test/utils/sandbox';
import { IMAGES_REF_TYPES } from '../../../../../src/core/deprecated/constants';
import { assert } from 'chai';
import {
  createUrl,
  survvEndpoints,
} from '../../../../../src/core/deprecated/survv.nc';

describe('GetAlbumProcessor Unit', function () {
  it('should call network service with correct params and return the result', async function () {
    const p = new GetAlbumProcessor({
      referenceType: IMAGES_REF_TYPES.VENDOR_COVER_PHOTO,
      referenceId: 1234,
    });

    const networkServiceMock = $sb.mock(NetworkService);
    networkServiceMock
      .expects('get')
      .once()
      .withExactArgs(
        createUrl(survvEndpoints.ALBUMS, null, {
          referenceType: IMAGES_REF_TYPES.VENDOR_COVER_PHOTO,
          referenceId: 1234,
        })
      )
      .resolves([2165529378315486711, 2165529378315486722]);

    const response = await p.execute();

    networkServiceMock.verify();

    assert.deepEqual(response, [
      {
        id: 2165529378315486711,
        url: createUrl(survvEndpoints.IMAGE, { imageId: 2165529378315486711 }),
      },
      {
        id: 2165529378315486722,
        url: createUrl(survvEndpoints.IMAGE, { imageId: 2165529378315486722 }),
      },
    ]);
  });
});
