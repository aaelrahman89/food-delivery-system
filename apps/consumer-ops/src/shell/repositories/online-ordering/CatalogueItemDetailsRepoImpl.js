import { Duration, TimeUnits } from '@survv/commons/core/models/Duration';
import { Money } from '@survv/commons/core/models/money';
import { createBackendUrl } from '@survv/commons/shell/backend/backend';
import { networkService } from '@survv/commons/shell/backend/networkService';

export class CatalogueItemDetailsRepoImpl {
  constructor() {
    this._networkService = networkService;
  }

  async getCatalogueItemDetails({ itemId }) {
    const {
      displayName,
      description,
      archived,
      calories,
      prepTime,
      price,
      tags,
      hashTags,
      options,
      catalogueId,
      catalogueSections,
      coverPhotosIds,
      creationDate,
    } = await this._networkService.request({
      requestLine: 'get /consumer/api/v1/items/:itemId',
      params: { itemId },
    });

    return {
      itemId,
      title: displayName,
      description,
      archived,
      calories,
      prepTime: new Duration({
        value: prepTime,
        timeUnit: TimeUnits.MINUTES,
      }),
      price: new Money({
        amount: price.amount,
        currency: price.currency,
      }),
      tags: [
        ...hashTags.map((tag) => ({
          tagId: tag.id,
          ...tag,
        })),
        ...tags.map((tag) => ({
          tagId: tag.id,
          ...tag,
        })),
      ],
      options: options.map((option) => {
        return {
          ...option,
          selections: option.selections.map((selection) => {
            return {
              ...selection,
              price: new Money({
                amount: selection.price.amount,
                currency: selection.price.currency,
              }),
            };
          }),
        };
      }),
      catalogueId,
      categories: catalogueSections.map((catalogueSection) => ({
        categoryId: catalogueSection.catalogueSectionId,
        title: catalogueSection.displayName,
        ...catalogueSection,
      })),
      coverPhotosIds,
      creationDate,
      coverPhotos: coverPhotosIds.map((id) => {
        return {
          id,
          url: createBackendUrl('images/:imageId', { imageId: id }),
        };
      }),
    };
  }
}
