import BaseProcessor from '../base/BaseProcessor';
import NetworkService from '../../../shell/services-deprecated/network/NetworkService';
import { createUrl, survvEndpoints } from '../survv.nc';

class GetAlbumProcessor extends BaseProcessor {
  constructor({ referenceType, referenceId }) {
    super();
    this.referenceType = referenceType;
    this.referenceId = referenceId;
  }

  async process() {
    const response = await NetworkService.get(
      createUrl(survvEndpoints.ALBUMS, null, {
        referenceType: this.referenceType,
        referenceId: this.referenceId,
      })
    );

    return response.map((imageId) => {
      return {
        id: imageId,
        url: createUrl(survvEndpoints.IMAGE, { imageId }),
      };
    });
  }
}

export default GetAlbumProcessor;
