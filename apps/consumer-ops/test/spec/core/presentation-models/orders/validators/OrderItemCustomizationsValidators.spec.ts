import {
  CatalogueItemOption,
  CatalogueItemOptionSelection,
} from '../../../../../../src/core/models/CatalogueItemOption';
import { Money } from '@survv/commons/core/models/money';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { assert } from 'chai';
import { hasValidCustomizations } from '../../../../../../src/core/presentation-models/orders/validators/OrderItemCustomizationsValidators';

describe('OrderItemCustomizationsValidators', function () {
  describe('options customization validity', function () {
    context('mandatory and multi-selection option', function () {
      it('is invalid when no selections are added', function () {
        const randomOptionId = 98511;
        const option = new CatalogueItemOption({
          template: false,
          multiSelection: true,
          mandatory: true,
          id: randomOptionId,
          minAllowed: 2,
          maxAllowed: 4,
          description: new MultilingualString(),
          displayName: new MultilingualString(),
          selections: [
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 6284,
              price: new Money({ amount: 30, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 98715,
              price: new Money({ amount: 70, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 61586,
              price: new Money({ amount: 80, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 775111,
              price: new Money({ amount: 15, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 19985,
              price: new Money({ amount: 17, currency: 'EGP' }),
            }),
          ],
        });

        const validationResult = hasValidCustomizations({
          option,
          customizations: [
            {
              optionId: 67856918731561235,
              selectionId: 987654321,
              relatedOptions: [],
            },
            {
              optionId: 897513513,
              selectionId: 888017829651,
              relatedOptions: [],
            },
          ],
        });

        assert.isFalse(validationResult);
      });
      it('is invalid when the checked option selections count is less than the minimum', function () {
        const randomOptionId = 98511;
        const option = new CatalogueItemOption({
          template: false,
          multiSelection: true,
          mandatory: true,
          id: randomOptionId,
          minAllowed: 2,
          maxAllowed: 4,
          description: new MultilingualString(),
          displayName: new MultilingualString(),
          selections: [
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 6284,
              price: new Money({ amount: 30, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 98715,
              price: new Money({ amount: 70, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 61586,
              price: new Money({ amount: 80, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 775111,
              price: new Money({ amount: 15, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 19985,
              price: new Money({ amount: 17, currency: 'EGP' }),
            }),
          ],
        });

        const validationResult = hasValidCustomizations({
          option,
          customizations: [
            {
              optionId: option.id,
              selectionId: option.selections[0].id,
              relatedOptions: [],
            },
            {
              optionId: 87192421,
              selectionId: 78846815414,
              relatedOptions: [],
            },
          ],
        });

        assert.isFalse(validationResult);
      });
      it('is invalid when the checked option selections count is more than the maximum', function () {
        const randomOptionId = 98511;
        const option = new CatalogueItemOption({
          template: false,
          multiSelection: true,
          mandatory: true,
          id: randomOptionId,
          minAllowed: 2,
          maxAllowed: 4,
          description: new MultilingualString(),
          displayName: new MultilingualString(),
          selections: [
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 6284,
              price: new Money({ amount: 30, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 98715,
              price: new Money({ amount: 70, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 61586,
              price: new Money({ amount: 80, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 775111,
              price: new Money({ amount: 15, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 19985,
              price: new Money({ amount: 17, currency: 'EGP' }),
            }),
          ],
        });

        const validationResult = hasValidCustomizations({
          option,
          customizations: [
            {
              optionId: option.id,
              selectionId: option.selections[0].id,
              relatedOptions: [],
            },
            {
              optionId: option.id,
              selectionId: option.selections[1].id,
              relatedOptions: [],
            },
            {
              optionId: option.id,
              selectionId: option.selections[2].id,
              relatedOptions: [],
            },
            {
              optionId: option.id,
              selectionId: option.selections[3].id,
              relatedOptions: [],
            },
            {
              optionId: option.id,
              selectionId: option.selections[4].id,
              relatedOptions: [],
            },
            {
              optionId: 87192421,
              selectionId: 78846815414,
              relatedOptions: [],
            },
          ],
        });

        assert.isFalse(validationResult);
      });
      it('is valid when the checked option selections count equals the minimum', function () {
        const randomOptionId = 98511;
        const option = new CatalogueItemOption({
          template: false,
          multiSelection: true,
          mandatory: true,
          id: randomOptionId,
          minAllowed: 2,
          maxAllowed: 4,
          description: new MultilingualString(),
          displayName: new MultilingualString(),
          selections: [
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 6284,
              price: new Money({ amount: 30, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 98715,
              price: new Money({ amount: 70, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 61586,
              price: new Money({ amount: 80, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 775111,
              price: new Money({ amount: 15, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 19985,
              price: new Money({ amount: 17, currency: 'EGP' }),
            }),
          ],
        });

        const validationResult = hasValidCustomizations({
          option,
          customizations: [
            {
              optionId: option.id,
              selectionId: option.selections[3].id,
              relatedOptions: [],
            },
            {
              optionId: option.id,
              selectionId: option.selections[4].id,
              relatedOptions: [],
            },
            {
              optionId: 87192421,
              selectionId: 78846815414,
              relatedOptions: [],
            },
          ],
        });

        assert.isTrue(validationResult);
      });
      it('is valid when the checked option selections count equals the maximum', function () {
        const randomOptionId = 98511;
        const option = new CatalogueItemOption({
          template: false,
          multiSelection: true,
          mandatory: true,
          id: randomOptionId,
          minAllowed: 2,
          maxAllowed: 4,
          description: new MultilingualString(),
          displayName: new MultilingualString(),
          selections: [
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 6284,
              price: new Money({ amount: 30, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 98715,
              price: new Money({ amount: 70, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 61586,
              price: new Money({ amount: 80, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 775111,
              price: new Money({ amount: 15, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 19985,
              price: new Money({ amount: 17, currency: 'EGP' }),
            }),
          ],
        });

        const validationResult = hasValidCustomizations({
          option,
          customizations: [
            {
              optionId: option.id,
              selectionId: option.selections[3].id,
              relatedOptions: [],
            },
            {
              optionId: option.id,
              selectionId: option.selections[4].id,
              relatedOptions: [],
            },
            {
              optionId: option.id,
              selectionId: option.selections[1].id,
              relatedOptions: [],
            },
            {
              optionId: option.id,
              selectionId: option.selections[2].id,
              relatedOptions: [],
            },
            {
              optionId: 87192421,
              selectionId: 78846815414,
              relatedOptions: [],
            },
          ],
        });

        assert.isTrue(validationResult);
      });
      it('is valid when the checked option selections count is between the minimum and maximum', function () {
        const randomOptionId = 98511;
        const option = new CatalogueItemOption({
          template: false,
          multiSelection: true,
          mandatory: true,
          id: randomOptionId,
          minAllowed: 2,
          maxAllowed: 4,
          description: new MultilingualString(),
          displayName: new MultilingualString(),
          selections: [
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 6284,
              price: new Money({ amount: 30, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 98715,
              price: new Money({ amount: 70, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 61586,
              price: new Money({ amount: 80, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 775111,
              price: new Money({ amount: 15, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 19985,
              price: new Money({ amount: 17, currency: 'EGP' }),
            }),
          ],
        });

        const validationResult = hasValidCustomizations({
          option,
          customizations: [
            {
              optionId: option.id,
              selectionId: option.selections[3].id,
              relatedOptions: [],
            },
            {
              optionId: option.id,
              selectionId: option.selections[4].id,
              relatedOptions: [],
            },
            {
              optionId: option.id,
              selectionId: option.selections[1].id,
              relatedOptions: [],
            },
            {
              optionId: 87192421,
              selectionId: 78846815414,
              relatedOptions: [],
            },
          ],
        });

        assert.isTrue(validationResult);
      });
    });
    context('mandatory and single-selection option', function () {
      it('is invalid when no selections are added', function () {
        const randomOptionId = 98511;
        const option = new CatalogueItemOption({
          template: false,
          multiSelection: false,
          mandatory: true,
          id: randomOptionId,
          minAllowed: 0,
          maxAllowed: 0,
          description: new MultilingualString(),
          displayName: new MultilingualString(),
          selections: [
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 6284,
              price: new Money({ amount: 30, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 98715,
              price: new Money({ amount: 70, currency: 'EGP' }),
            }),
          ],
        });

        const validationResult = hasValidCustomizations({
          option,
          customizations: [
            {
              optionId: 87192421,
              selectionId: 78846815414,
              relatedOptions: [],
            },
          ],
        });

        assert.isFalse(validationResult);
      });
      it('is invalid when the checked option selections count is more than one', function () {
        const randomOptionId = 98511;
        const option = new CatalogueItemOption({
          template: false,
          multiSelection: false,
          mandatory: true,
          id: randomOptionId,
          minAllowed: 0,
          maxAllowed: 0,
          description: new MultilingualString(),
          displayName: new MultilingualString(),
          selections: [
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 6284,
              price: new Money({ amount: 30, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 98715,
              price: new Money({ amount: 70, currency: 'EGP' }),
            }),
          ],
        });

        const validationResult = hasValidCustomizations({
          option,
          customizations: [
            {
              optionId: option.id,
              selectionId: option.selections[1].id,
              relatedOptions: [],
            },
            {
              optionId: option.id,
              selectionId: option.selections[0].id,
              relatedOptions: [],
            },
            {
              optionId: 87192421,
              selectionId: 78846815414,
              relatedOptions: [],
            },
          ],
        });

        assert.isFalse(validationResult);
      });
      it('is valid when the checked option selections count is equal to one', function () {
        const randomOptionId = 98511;
        const option = new CatalogueItemOption({
          template: false,
          multiSelection: false,
          mandatory: true,
          id: randomOptionId,
          minAllowed: 0,
          maxAllowed: 0,
          description: new MultilingualString(),
          displayName: new MultilingualString(),
          selections: [
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 6284,
              price: new Money({ amount: 30, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 98715,
              price: new Money({ amount: 70, currency: 'EGP' }),
            }),
          ],
        });

        const validationResult = hasValidCustomizations({
          option,
          customizations: [
            {
              optionId: option.id,
              selectionId: option.selections[0].id,
              relatedOptions: [],
            },
            {
              optionId: 87192421,
              selectionId: 78846815414,
              relatedOptions: [],
            },
          ],
        });

        assert.isTrue(validationResult);
      });
    });
    context('non-mandatory and multi-selection option', function () {
      it('is invalid when the checked option selections count is less than the minimum', function () {
        const randomOptionId = 98511;
        const option = new CatalogueItemOption({
          template: false,
          multiSelection: true,
          mandatory: false,
          id: randomOptionId,
          minAllowed: 2,
          maxAllowed: 4,
          description: new MultilingualString(),
          displayName: new MultilingualString(),
          selections: [
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 6284,
              price: new Money({ amount: 30, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 98715,
              price: new Money({ amount: 70, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 61586,
              price: new Money({ amount: 80, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 775111,
              price: new Money({ amount: 15, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 19985,
              price: new Money({ amount: 17, currency: 'EGP' }),
            }),
          ],
        });

        const validationResult = hasValidCustomizations({
          option,
          customizations: [
            {
              optionId: option.id,
              selectionId: option.selections[0].id,
              relatedOptions: [],
            },
            {
              optionId: 87192421,
              selectionId: 78846815414,
              relatedOptions: [],
            },
          ],
        });

        assert.isFalse(validationResult);
      });
      it('is invalid when the checked option selections count is more than the maximum', function () {
        const randomOptionId = 98511;
        const option = new CatalogueItemOption({
          template: false,
          multiSelection: true,
          mandatory: false,
          id: randomOptionId,
          minAllowed: 2,
          maxAllowed: 4,
          description: new MultilingualString(),
          displayName: new MultilingualString(),
          selections: [
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 6284,
              price: new Money({ amount: 30, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 98715,
              price: new Money({ amount: 70, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 61586,
              price: new Money({ amount: 80, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 775111,
              price: new Money({ amount: 15, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 19985,
              price: new Money({ amount: 17, currency: 'EGP' }),
            }),
          ],
        });

        const validationResult = hasValidCustomizations({
          option,
          customizations: [
            {
              optionId: option.id,
              selectionId: option.selections[0].id,
              relatedOptions: [],
            },
            {
              optionId: option.id,
              selectionId: option.selections[1].id,
              relatedOptions: [],
            },
            {
              optionId: option.id,
              selectionId: option.selections[2].id,
              relatedOptions: [],
            },
            {
              optionId: option.id,
              selectionId: option.selections[3].id,
              relatedOptions: [],
            },
            {
              optionId: option.id,
              selectionId: option.selections[4].id,
              relatedOptions: [],
            },
            {
              optionId: 87192421,
              selectionId: 78846815414,
              relatedOptions: [],
            },
          ],
        });

        assert.isFalse(validationResult);
      });
      it('is valid when no selections are added', function () {
        const randomOptionId = 98511;
        const option = new CatalogueItemOption({
          template: false,
          multiSelection: true,
          mandatory: false,
          id: randomOptionId,
          minAllowed: 2,
          maxAllowed: 4,
          description: new MultilingualString(),
          displayName: new MultilingualString(),
          selections: [
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 6284,
              price: new Money({ amount: 30, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 98715,
              price: new Money({ amount: 70, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 61586,
              price: new Money({ amount: 80, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 775111,
              price: new Money({ amount: 15, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 19985,
              price: new Money({ amount: 17, currency: 'EGP' }),
            }),
          ],
        });

        const validationResult = hasValidCustomizations({
          option,
          customizations: [
            {
              optionId: 67856918731561235,
              selectionId: 987654321,
              relatedOptions: [],
            },
            {
              optionId: 897513513,
              selectionId: 888017829651,
              relatedOptions: [],
            },
          ],
        });

        assert.isTrue(validationResult);
      });
      it('is valid when the checked option selections count equals the minimum', function () {
        const randomOptionId = 98511;
        const option = new CatalogueItemOption({
          template: false,
          multiSelection: true,
          mandatory: false,
          id: randomOptionId,
          minAllowed: 2,
          maxAllowed: 4,
          description: new MultilingualString(),
          displayName: new MultilingualString(),
          selections: [
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 6284,
              price: new Money({ amount: 30, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 98715,
              price: new Money({ amount: 70, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 61586,
              price: new Money({ amount: 80, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 775111,
              price: new Money({ amount: 15, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 19985,
              price: new Money({ amount: 17, currency: 'EGP' }),
            }),
          ],
        });

        const validationResult = hasValidCustomizations({
          option,
          customizations: [
            {
              optionId: option.id,
              selectionId: option.selections[3].id,
              relatedOptions: [],
            },
            {
              optionId: option.id,
              selectionId: option.selections[4].id,
              relatedOptions: [],
            },
            {
              optionId: 87192421,
              selectionId: 78846815414,
              relatedOptions: [],
            },
          ],
        });

        assert.isTrue(validationResult);
      });
      it('is valid when the checked option selections count equals the maximum', function () {
        const randomOptionId = 98511;
        const option = new CatalogueItemOption({
          template: false,
          multiSelection: true,
          mandatory: false,
          id: randomOptionId,
          minAllowed: 2,
          maxAllowed: 4,
          description: new MultilingualString(),
          displayName: new MultilingualString(),
          selections: [
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 6284,
              price: new Money({ amount: 30, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 98715,
              price: new Money({ amount: 70, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 61586,
              price: new Money({ amount: 80, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 775111,
              price: new Money({ amount: 15, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 19985,
              price: new Money({ amount: 17, currency: 'EGP' }),
            }),
          ],
        });

        const validationResult = hasValidCustomizations({
          option,
          customizations: [
            {
              optionId: option.id,
              selectionId: option.selections[3].id,
              relatedOptions: [],
            },
            {
              optionId: option.id,
              selectionId: option.selections[4].id,
              relatedOptions: [],
            },
            {
              optionId: option.id,
              selectionId: option.selections[1].id,
              relatedOptions: [],
            },
            {
              optionId: option.id,
              selectionId: option.selections[2].id,
              relatedOptions: [],
            },
            {
              optionId: 87192421,
              selectionId: 78846815414,
              relatedOptions: [],
            },
          ],
        });

        assert.isTrue(validationResult);
      });
      it('is valid when the checked option selections count is between the minimum and maximum', function () {
        const randomOptionId = 98511;
        const option = new CatalogueItemOption({
          template: false,
          multiSelection: true,
          mandatory: false,
          id: randomOptionId,
          minAllowed: 2,
          maxAllowed: 4,
          description: new MultilingualString(),
          displayName: new MultilingualString(),
          selections: [
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 6284,
              price: new Money({ amount: 30, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 98715,
              price: new Money({ amount: 70, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 61586,
              price: new Money({ amount: 80, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 775111,
              price: new Money({ amount: 15, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 19985,
              price: new Money({ amount: 17, currency: 'EGP' }),
            }),
          ],
        });

        const validationResult = hasValidCustomizations({
          option,
          customizations: [
            {
              optionId: option.id,
              selectionId: option.selections[3].id,
              relatedOptions: [],
            },
            {
              optionId: option.id,
              selectionId: option.selections[4].id,
              relatedOptions: [],
            },
            {
              optionId: option.id,
              selectionId: option.selections[1].id,
              relatedOptions: [],
            },
            {
              optionId: 87192421,
              selectionId: 78846815414,
              relatedOptions: [],
            },
          ],
        });

        assert.isTrue(validationResult);
      });
    });
    context('non-mandatory and single-selection option', function () {
      it('is invalid when the checked option selections count is more than one', function () {
        const randomOptionId = 98511;
        const option = new CatalogueItemOption({
          template: false,
          multiSelection: false,
          mandatory: false,
          id: randomOptionId,
          minAllowed: 0,
          maxAllowed: 0,
          description: new MultilingualString(),
          displayName: new MultilingualString(),
          selections: [
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 6284,
              price: new Money({ amount: 30, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 98715,
              price: new Money({ amount: 70, currency: 'EGP' }),
            }),
          ],
        });

        const validationResult = hasValidCustomizations({
          option,
          customizations: [
            {
              optionId: option.id,
              selectionId: option.selections[1].id,
              relatedOptions: [],
            },
            {
              optionId: option.id,
              selectionId: option.selections[0].id,
              relatedOptions: [],
            },
            {
              optionId: 87192421,
              selectionId: 78846815414,
              relatedOptions: [],
            },
          ],
        });

        assert.isFalse(validationResult);
      });
      it('is valid when no selections are added', function () {
        const randomOptionId = 98511;
        const option = new CatalogueItemOption({
          template: false,
          multiSelection: false,
          mandatory: false,
          id: randomOptionId,
          minAllowed: 0,
          maxAllowed: 0,
          description: new MultilingualString(),
          displayName: new MultilingualString(),
          selections: [
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 6284,
              price: new Money({ amount: 30, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 98715,
              price: new Money({ amount: 70, currency: 'EGP' }),
            }),
          ],
        });

        const validationResult = hasValidCustomizations({
          option,
          customizations: [
            {
              optionId: 87192421,
              selectionId: 78846815414,
              relatedOptions: [],
            },
          ],
        });

        assert.isTrue(validationResult);
      });
      it('is valid when the checked option selections count is equal to one', function () {
        const randomOptionId = 98511;
        const option = new CatalogueItemOption({
          template: false,
          multiSelection: false,
          mandatory: false,
          id: randomOptionId,
          minAllowed: 0,
          maxAllowed: 0,
          description: new MultilingualString(),
          displayName: new MultilingualString(),
          selections: [
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 6284,
              price: new Money({ amount: 30, currency: 'EGP' }),
            }),
            new CatalogueItemOptionSelection({
              calories: 0,
              relatedOptions: [],
              displayName: new MultilingualString(),
              id: 98715,
              price: new Money({ amount: 70, currency: 'EGP' }),
            }),
          ],
        });

        const validationResult = hasValidCustomizations({
          option,
          customizations: [
            {
              optionId: option.id,
              selectionId: option.selections[0].id,
              relatedOptions: [],
            },
            {
              optionId: 87192421,
              selectionId: 78846815414,
              relatedOptions: [],
            },
          ],
        });

        assert.isTrue(validationResult);
      });
    });
  });
});
