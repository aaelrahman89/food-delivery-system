import { request } from '@survv/commons/shell/backend/backend';

export class VendorProfileDetailsRepoImpl {
  constructor({ networkService = { request } } = {}) {
    this._networkService = networkService;
  }

  async getCatalogueLanguage({ vendorId }) {
    const { languageSupport } = await this._networkService.request({
      requestLine: 'get /consumer/api/v1/vendors/:vendorId',
      params: { vendorId },
    });

    return {
      catalogueLanguage: languageSupport,
    };
  }
}
