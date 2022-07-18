import { request } from '@survv/commons/shell/backend/backend';

export class EditItemOptionRepoImpl {
  constructor({ networkService = { request } } = {}) {
    this._networkService = networkService;
  }

  async EditItemOption({ catalogueId, itemId, optionId, payload }) {
    await this._networkService.request({
      requestLine:
        'put /api/v1/catalogues/:catalogueId/items/:itemId/options/:optionId',
      params: { catalogueId, itemId, optionId },
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
