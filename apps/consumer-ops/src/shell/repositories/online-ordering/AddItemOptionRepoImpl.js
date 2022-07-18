import { request } from '@survv/commons/shell/backend/backend';

export class AddItemOptionRepoImpl {
  constructor({ networkService = { request } } = {}) {
    this._networkService = networkService;
  }

  async addItemOption({ catalogueId, itemId, payload }) {
    await this._networkService.request({
      requestLine:
        'post /consumer/api/v1/catalogues/:catalogueId/items/:itemId/options',
      params: { catalogueId, itemId },
      body: {
        ...payload,
        selections: payload.selections.map((selection) => ({
          ...selection,
          price: {
            amount: selection.price,
            currency: 'EGP',
          },
        })),
      },
    });
  }
}
