import EditItemOptionPM from '../../../../../src/core/presentation-models/online-ordering/EditItemOptionPM';
import { CatalogueItemDetailsRepoImpl } from '../../../../../src/shell/repositories/online-ordering/CatalogueItemDetailsRepoImpl';
import { EditItemOptionRepoImpl } from '../../../../../src/shell/repositories/online-ordering/EditItemOptionRepoImpl';
import { Money } from '@survv/commons/core/models/money';
import { VendorProfileDetailsRepoImpl } from '../../../../../src/shell/repositories/online-ordering/VendorProfileDetailsRepoImpl';

import mockUrl from '../../../../utils/mockUrl';
import wiremock from '../../../../utils/wiremock';
import { $sb } from '@survv/commons/test/utils/sandbox';
import { LocalError } from '@survv/commons/core/errors/errors';
import { assert } from 'chai';
import {
  badOperation,
  successfulOperation,
} from '@survv/commons/core/notification/notification';
import { createNotification } from '../../../../../src/core/notification';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import {
  stubGetCatalogueDetails,
  stubGetItemDetails,
} from '@survv/commons/test/api-stubs/catalogues';
import { vendorProfileResponseStub } from '@survv/api/stubs/vendors';

describe('EditItemOptionPM Integration', function () {
  it('should init and hydrate successfully', async function () {
    const pm = new EditItemOptionPM({
      catalogueId: 123,
      itemId: 456,
      optionId: 4444,
      vendorId: 555,
    });

    await stubGetItemDetails({ itemId: 456 });

    await stubGetCatalogueDetails({ catalogueId: 123 });

    await wiremock
      .stub()
      .request('get', mockUrl('vendors/:vendorId/profile', { vendorId: 555 }))
      .reply(200, vendorProfileResponseStub());

    await pm.init();

    assert.isUndefined(pm.notification);
  });

  it('should submit successfully', async function () {
    const pm = new EditItemOptionPM({
      catalogueId: 123,
      itemId: 456,
      optionId: 4444,
    });

    await stubGetCatalogueDetails({ catalogueId: 123 });

    const vendorStub = vendorProfileResponseStub();
    vendorStub.languageSupport = { en: true, ar: true };
    await wiremock
      .stub()
      .request('get', mockUrl('vendors/:vendorId/profile', { vendorId: 555 }))
      .reply(200, vendorStub);

    await pm.init();

    pm.updatedOption.title.en = 'title';
    pm.updatedOption.title.ar = 'title';
    pm.updatedOption.mandatory = true;
    pm.updatedOption.multiSelection = true;
    pm.updatedOption.minAllowed = 2;
    pm.updatedOption.maxAllowed = 4;
    pm.addSelection({
      title: {
        en: 'title',
        ar: 'title',
      },
      price: 8,
    });
    pm.updatedOption.description.en = 'helloWorld';
    pm.updatedOption.description.ar = 'helloWorld';

    await wiremock
      .stub()
      .request(
        'put',
        mockUrl('catalogues/:catalogueId/items/:itemId/options/:optionId', {
          catalogueId: 123,
          itemId: 456,
          optionId: 4444,
        })
      )
      .reply(200, {
        optionId: 123124,
      });

    await pm.submit();

    assert.deepEqual(notificationService.notification, successfulOperation());
  });
});

describe('EditItemOptionPM Unit', function () {
  it('should initialize items props correctly', function () {
    const pm = new EditItemOptionPM({
      catalogueId: 123,
      itemId: 457,
      optionId: 789,
    });

    assert.deepEqual(pm.item, {
      options: [],
      title: {},
      categories: [],
      tags: [],
    });
  });

  it('should determine enabled ui input languages based on catalogue language', async function () {
    const pm = new EditItemOptionPM({ catalogueId: 123, itemId: 456 });

    $sb
      .stub(VendorProfileDetailsRepoImpl.prototype, 'getCatalogueLanguage')
      .resolves({
        catalogueLanguage: {
          en: true,
          ar: true,
        },
      });

    $sb
      .stub(CatalogueItemDetailsRepoImpl.prototype, 'getCatalogueItemDetails')
      .resolves({
        any: 'Object',
      });

    await pm.init();

    assert.deepEqual(pm.inputLanguage, {
      en: true,
      ar: true,
    });
  });

  it('should show english input only as default', function () {
    const pm = new EditItemOptionPM({ catalogueId: 123, itemId: 456 });

    assert.deepEqual(pm.inputLanguage, {
      en: true,
      ar: false,
    });
  });

  it('should display error if init failed', async function () {
    const pm = new EditItemOptionPM({
      catalogueId: 123,
      itemId: 457,
      optionId: 789,
    });

    const error = new LocalError({
      message: 'init failed',
      code: 'ERR_TECHNICAL_ERROR',
    });

    $sb
      .stub(VendorProfileDetailsRepoImpl.prototype, 'getCatalogueLanguage')
      .rejects(error);

    $sb
      .stub(CatalogueItemDetailsRepoImpl.prototype, 'getCatalogueItemDetails')
      .rejects(error);

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });

  it('should be able to add selections', function () {
    const pm = new EditItemOptionPM({
      catalogueId: 123,
      itemId: 457,
      optionId: 789,
    });

    pm.addSelection({
      title: {
        en: 'selection 1',
        ar: undefined,
      },
      calories: 1,
      price: 1,
      relatedOptions: [123],
      code: 'text',
    });
    pm.addSelection({
      title: {
        en: 'selection 2',
        ar: undefined,
      },
      calories: 2,
      price: 2,
      relatedOptions: [456],
      code: 'text',
    });

    assert.deepEqual(pm.updatedOption.selections, [
      {
        title: {
          en: 'selection 1',
          ar: undefined,
        },
        calories: 1,
        price: 1,
        relatedOptions: [123],
        code: 'text',
      },
      {
        title: {
          en: 'selection 2',
          ar: undefined,
        },
        calories: 2,
        price: 2,
        relatedOptions: [456],
        code: 'text',
      },
    ]);
  });

  it('should be able to delete selections', function () {
    const pm = new EditItemOptionPM({
      catalogueId: 123,
      itemId: 457,
      optionId: 789,
    });

    pm.addSelection({
      title: {
        en: 'selection 1',
        ar: undefined,
      },
      calories: 1,
      price: 1,
      relatedOptions: [123],
      code: 'text',
    });
    pm.addSelection({
      title: {
        en: 'selection 2',
        ar: undefined,
      },
      calories: 2,
      price: 2,
      relatedOptions: [456],
      code: 'text',
    });
    pm.addSelection({
      title: {
        en: 'selection 3',
        ar: undefined,
      },
      calories: 3,
      price: 3,
      relatedOptions: [789],
      code: 'text',
    });

    pm.deleteSelection(2);
    pm.deleteSelection(0);

    assert.deepEqual(pm.updatedOption.selections, [
      {
        title: {
          en: 'selection 2',
          ar: undefined,
        },
        calories: 2,
        price: 2,
        relatedOptions: [456],
        code: 'text',
      },
    ]);
  });

  it('should be able to update selections', function () {
    const pm = new EditItemOptionPM({
      catalogueId: 123,
      itemId: 457,
      optionId: 789,
    });

    pm.addSelection({
      title: {
        en: 'selection 3',
        ar: undefined,
      },
      calories: 3,
      price: 3,
      relatedOptions: [789],
      code: 'text',
    });
    pm.addSelection({
      title: {
        en: 'selection 2',
        ar: undefined,
      },
      calories: 2,
      price: 2,
      relatedOptions: [456],
      code: 'text',
    });
    pm.addSelection({
      title: {
        en: 'selection 1',
        ar: undefined,
      },
      calories: 1,
      price: 1,
      relatedOptions: [123],
      code: 'text',
    });

    pm.updateSelection({
      index: 0,
      title: {
        en: 'selection 3 modified',
        ar: undefined,
      },
      calories: 3,
      price: 3,
      relatedOptions: [123, 567],
      code: 'text',
    });

    pm.updateSelection({
      index: 1,
      title: {
        en: 'selection 2 modified',
        ar: undefined,
      },
      calories: 22,
      price: 2,
      relatedOptions: [456],
      code: 'text',
    });

    assert.deepEqual(pm.updatedOption.selections, [
      {
        title: {
          en: 'selection 3 modified',
          ar: undefined,
        },
        calories: 3,
        price: 3,
        relatedOptions: [123, 567],
        code: 'text',
      },
      {
        title: {
          en: 'selection 2 modified',
          ar: undefined,
        },
        calories: 22,
        price: 2,
        relatedOptions: [456],
        code: 'text',
      },
      {
        title: {
          en: 'selection 1',
          ar: undefined,
        },
        calories: 1,
        price: 1,
        relatedOptions: [123],
        code: 'text',
      },
    ]);
  });

  it('should ignore updating selections with index >= selections.length', function () {
    const pm = new EditItemOptionPM({
      catalogueId: 123,
      itemId: 457,
      optionId: 789,
    });

    pm.addSelection({
      title: {
        en: 'selection 1',
        ar: undefined,
      },
      calories: 1,
      price: 1,
      relatedOptions: [123],
      code: 'text',
    });
    pm.addSelection({
      title: {
        en: 'selection 2',
        ar: undefined,
      },
      calories: 2,
      price: 2,
      relatedOptions: [456],
      code: 'text',
    });
    pm.addSelection({
      title: {
        en: 'selection 3',
        ar: undefined,
      },
      calories: 3,
      price: 3,
      relatedOptions: [789],
      code: 'text',
    });

    pm.updateSelection({ index: 6 });
    pm.updateSelection({ index: 10 });

    assert.deepEqual(pm.updatedOption.selections, [
      {
        title: {
          en: 'selection 1',
          ar: undefined,
        },
        calories: 1,
        price: 1,
        relatedOptions: [123],
        code: 'text',
      },
      {
        title: {
          en: 'selection 2',
          ar: undefined,
        },
        calories: 2,
        price: 2,
        relatedOptions: [456],
        code: 'text',
      },
      {
        title: {
          en: 'selection 3',
          ar: undefined,
        },
        calories: 3,
        price: 3,
        relatedOptions: [789],
        code: 'text',
      },
    ]);
  });

  context('validators', function () {
    it('should return errors.missingFieldError if required title locale does not exist', async function () {
      const pm = new EditItemOptionPM({
        catalogueId: 123,
        itemId: 457,
        optionId: 789,
      });

      $sb
        .stub(VendorProfileDetailsRepoImpl.prototype, 'getCatalogueLanguage')
        .resolves({
          catalogueLanguage: {
            en: true,
            ar: true,
          },
        });

      $sb
        .stub(CatalogueItemDetailsRepoImpl.prototype, 'getCatalogueItemDetails')
        .resolves({
          any: 'Object',
        });

      await pm.init();

      assert.equal(pm.validators().titleAr(), 'validation.missing.field');

      assert.equal(pm.validators().titleEn(), 'validation.missing.field');
    });

    it('should return true for non required localized titles', async function () {
      const pm = new EditItemOptionPM({
        catalogueId: 123,
        itemId: 457,
        optionId: 789,
      });

      $sb
        .stub(VendorProfileDetailsRepoImpl.prototype, 'getCatalogueLanguage')
        .resolves({
          catalogueLanguage: {
            en: false,
            ar: true,
          },
        });

      $sb
        .stub(CatalogueItemDetailsRepoImpl.prototype, 'getCatalogueItemDetails')
        .resolves({
          any: 'Object',
        });

      await pm.init();

      assert.equal(pm.validators().titleAr(), 'validation.missing.field');

      assert.isTrue(pm.validators().titleEn());
    });

    it('should return errors.invalidPositiveError on minAllowed and maxAllowed if multiSelection was enabled', function () {
      const pm = new EditItemOptionPM({
        catalogueId: 123,
        itemId: 457,
        optionId: 789,
      });

      pm.updatedOption.multiSelection = true;

      assert.equal(pm.validators().minAllowed(), 'validation.invalid.positive');

      assert.equal(pm.validators().maxAllowed(), 'validation.invalid.positive');
    });

    it('should return errors.invalidMinMaxError on if maxAllowed <= minAllowed if multiSelection was enabled', function () {
      const pm = new EditItemOptionPM({
        catalogueId: 123,
        itemId: 457,
        optionId: 789,
      });

      pm.updatedOption.multiSelection = true;

      pm.updatedOption.minAllowed = 2;

      pm.updatedOption.maxAllowed = 1;

      assert.equal(
        pm.validators().maxAllowed(),
        'validation.invalid.min_max',
        'asserting less than minAllowed'
      );

      pm.updatedOption.minAllowed = 7;

      pm.updatedOption.maxAllowed = 7;

      assert.equal(
        pm.validators().maxAllowed(),
        'validation.invalid.min_max',
        'asserting equals minAllowed'
      );
    });

    it('should return true if minAllowed and maxAllowed are not required', function () {
      const pm = new EditItemOptionPM({
        catalogueId: 123,
        itemId: 457,
        optionId: 789,
      });

      pm.updatedOption.multiSelection = false;

      assert.isTrue(pm.validators().minAllowed());

      assert.isTrue(pm.validators().maxAllowed());
    });

    it('should be able to validate the title for a single selection', function () {
      const pm = new EditItemOptionPM({
        catalogueId: 123,
        itemId: 457,
        optionId: 789,
      });

      pm.addSelection({
        title: {
          en: '',
          ar: undefined,
        },
        calories: 1,
        price: 1,
        relatedOptions: [123],
        code: 'text',
      });
      pm.addSelection({
        title: {
          en: 'selection 2',
          ar: undefined,
        },
        calories: 2,
        price: 2,
        relatedOptions: [456],
        code: 'text',
      });

      assert.deepEqual(
        pm.validators().selections({
          single: true,
          index: 0,
          field: 'title',
          locale: 'en',
        }),
        'validation.missing.field'
      );
      assert.isTrue(
        pm.validators().selections({
          single: true,
          index: 0,
          field: 'title',
          locale: 'ar',
        })
      );
      assert.isTrue(
        pm.validators().selections({
          single: true,
          index: 1,
          field: 'title',
          locale: 'en',
        })
      );
      assert.isTrue(
        pm.validators().selections({
          single: true,
          index: 1,
          field: 'title',
          locale: 'ar',
        })
      );
    });

    it('should validate the calories to be positive if given and ignore it otherwise', function () {
      const pm = new EditItemOptionPM({
        catalogueId: 123,
        itemId: 457,
        optionId: 789,
      });

      pm.addSelection({
        title: {
          en: '',
          ar: undefined,
        },
        calories: undefined,
        price: 0,
        relatedOptions: [123],
        code: 'text',
      });
      pm.addSelection({
        title: {
          en: 'selection 2',
          ar: undefined,
        },
        calories: 200,
        price: -1,
        relatedOptions: [456],
        code: 'text',
      });
      pm.addSelection({
        title: {
          en: 'selection 2',
          ar: undefined,
        },
        calories: -1,
        price: -1,
        relatedOptions: [456],
        code: 'text',
      });

      assert.isTrue(
        pm.validators().selections({
          single: true,
          index: 0,
          field: 'calories',
        })
      );
      assert.isTrue(
        pm.validators().selections({
          single: true,
          index: 1,
          field: 'calories',
        })
      );
      assert.equal(
        pm.validators().selections({
          single: true,
          index: 2,
          field: 'calories',
        }),
        'validation.invalid.positive'
      );
    });

    it('should return errors.missingFieldError if no selections were given', function () {
      const pm = new EditItemOptionPM({
        catalogueId: 123,
        itemId: 457,
        optionId: 789,
      });

      assert.equal(pm.validators().selections(), 'validation.missing.field');
    });

    it('should return true for selections validation if all selections are valid', function () {
      const pm = new EditItemOptionPM({
        catalogueId: 123,
        itemId: 457,
        optionId: 789,
      });

      pm.addSelection({
        title: {
          en: 'hello world',
          ar: undefined,
        },
        calories: 1234,
        price: 2000,
        relatedOptions: [123],
        code: 'text',
      });
      pm.addSelection({
        title: {
          en: 'selection 2',
          ar: undefined,
        },
        calories: 200,
        price: 1234,
        relatedOptions: [456],
        code: 'text',
      });
      pm.addSelection({
        title: {
          en: 'selection 2',
          ar: undefined,
        },
        calories: 11,
        price: 11,
        relatedOptions: [456],
        code: 'text',
      });

      assert.isTrue(pm.validators().selections());
    });

    it('should return false for selections validation if any selection is invalid', function () {
      const pm = new EditItemOptionPM({
        catalogueId: 123,
        itemId: 457,
        optionId: 789,
      });

      pm.addSelection({
        title: {
          en: 'hello world',
          ar: undefined,
        },
        calories: 1234,
        price: 2000,
        relatedOptions: [123],
        code: 'text',
      });
      pm.addSelection({
        title: {
          en: undefined,
          ar: undefined,
        },
        calories: undefined,
        price: undefined,
        relatedOptions: undefined,
        code: undefined,
      });

      assert.isFalse(pm.validators().selections());
    });
  });

  it('should disable submit if any validator is not valid', async function () {
    const pm = new EditItemOptionPM({
      catalogueId: 123,
      itemId: 457,
      optionId: 789,
    });

    assert.isFalse(pm.canSubmit);
  });

  it('should disable submit if updatedOption is not changed', async function () {
    const pm = new EditItemOptionPM({
      catalogueId: 123,
      itemId: 456,
      optionId: 789,
    });

    $sb
      .stub(VendorProfileDetailsRepoImpl.prototype, 'getCatalogueLanguage')
      .resolves({
        catalogueLanguage: {
          en: true,
          ar: true,
        },
      });

    $sb
      .stub(CatalogueItemDetailsRepoImpl.prototype, 'getCatalogueItemDetails')
      .resolves({
        any: 'Object',
        options: [
          {
            optionId: 12345,
          },
          {
            optionId: 789,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            description: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            mandatory: false,
            multiSelection: false,
            minAllowed: 5,
            maxAllowed: 6,
            selections: [
              {
                title: {
                  en: 'Main Menu',
                  ar: 'القائمة الرئيسية',
                },
                calories: 200,
                price: new Money({ amount: 75.5, currency: 'EGP' }),
                relatedOptions: [23456],
                code: 'text',
              },
            ],
            template: false,
            creationDate: '2018-09-05T19:04:53.178Z',
          },
        ],
      });

    await pm.init();

    pm.updatedOption.title.en = 'title';
    pm.updatedOption.description.en = 'description';
    pm.updatedOption.mandatory = true;
    pm.updatedOption.multiSelection = true;
    pm.updatedOption.minAllowed = 2;
    pm.updatedOption.maxAllowed = 4;
    pm.addSelection({
      title: {
        en: 'title',
        ar: 'title',
      },
      price: 8,
    });

    assert.isTrue(pm.canSubmit);

    pm.reset();

    assert.isFalse(pm.canSubmit);
  });

  it('should call EditItemOptionProcessor with correct params and success on successful submission', async function () {
    const pm = new EditItemOptionPM({
      catalogueId: 123,
      itemId: 456,
      optionId: 789,
    });

    $sb
      .stub(VendorProfileDetailsRepoImpl.prototype, 'getCatalogueLanguage')
      .resolves({
        catalogueLanguage: {
          en: true,
          ar: true,
        },
      });

    $sb
      .stub(CatalogueItemDetailsRepoImpl.prototype, 'getCatalogueItemDetails')
      .resolves({
        any: 'Object',
        options: [
          {
            optionId: 12345,
          },
          {
            optionId: 789,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            description: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            mandatory: false,
            multiSelection: false,
            minAllowed: 5,
            maxAllowed: 5,
            selections: [
              {
                title: {
                  en: 'Main Menu',
                  ar: 'القائمة الرئيسية',
                },
                calories: 200,
                price: new Money({ amount: 75.5, currency: 'EGP' }),
                relatedOptions: [23456],
                code: 'text',
              },
            ],
            template: false,
            creationDate: '2018-09-05T19:04:53.178Z',
          },
        ],
      });

    await pm.init();

    pm.updatedOption.title.en = 'title';
    pm.updatedOption.description.en = 'description';
    pm.updatedOption.mandatory = true;
    pm.updatedOption.multiSelection = true;
    pm.updatedOption.minAllowed = 2;
    pm.updatedOption.maxAllowed = 4;
    pm.addSelection({
      title: {
        en: 'title',
        ar: 'title',
      },
      price: 8,
    });

    $sb
      .stub(EditItemOptionRepoImpl.prototype, 'EditItemOption')
      .withArgs({
        catalogueId: 123,
        itemId: 456,
        optionId: 789,
        payload: {
          title: {
            en: 'title',
            ar: 'القائمة الرئيسية',
          },
          description: {
            en: 'description',
            ar: 'القائمة الرئيسية',
          },
          mandatory: true,
          multiSelection: true,
          minAllowed: 2,
          maxAllowed: 4,
          selections: [
            {
              title: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              calories: 200,
              price: 75.5,
              relatedOptions: [23456],
              code: 'text',
            },
            {
              title: {
                en: 'title',
                ar: 'title',
              },
              price: 8,
              calories: undefined,
              relatedOptions: undefined,
              code: 'text',
            },
          ],
        },
      })
      .returns({});

    await pm.submit();

    assert.deepEqual(notificationService.notification, successfulOperation());
  });

  it('should display errors of submit failed', async function () {
    const pm = new EditItemOptionPM({
      catalogueId: 123,
      itemId: 457,
      optionId: 789,
    });

    pm.updatedOption.title.en = 'title';
    pm.updatedOption.description.en = 'description';
    pm.updatedOption.mandatory = true;
    pm.updatedOption.multiSelection = true;
    pm.updatedOption.minAllowed = 2;
    pm.updatedOption.maxAllowed = 4;
    pm.addSelection({
      title: {
        en: 'title',
      },
      price: 8,
    });

    const error = new LocalError({
      message: 'Form submit failed',
      code: 'BAD_OPERATION',
    });

    $sb.stub(EditItemOptionRepoImpl.prototype, 'EditItemOption').rejects(error);

    await pm.submit();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });

  it('should not submit and display errors.invalidFormError if attempted to submit invalid form', async function () {
    const pm = new EditItemOptionPM({
      catalogueId: 123,
      itemId: 457,
      optionId: 789,
    });

    await pm.submit();

    assert.deepEqual(notificationService.notification, badOperation());
  });

  it('should be able to reset the form', async function () {
    const pm = new EditItemOptionPM({
      catalogueId: 123,
      itemId: 457,
      optionId: 789,
    });

    $sb
      .stub(VendorProfileDetailsRepoImpl.prototype, 'getCatalogueLanguage')
      .resolves({
        catalogueLanguage: {
          en: true,
          ar: true,
        },
      });

    $sb
      .stub(CatalogueItemDetailsRepoImpl.prototype, 'getCatalogueItemDetails')
      .resolves({
        any: 'Object',
        options: [
          {
            optionId: 12345,
          },
          {
            optionId: 789,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            description: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            mandatory: false,
            multiSelection: false,
            minAllowed: 5,
            maxAllowed: 5,
            selections: [
              {
                title: {
                  en: 'Main Menu',
                  ar: 'القائمة الرئيسية',
                },
                calories: 200,
                price: new Money({ amount: 75.5, currency: 'EGP' }),
                relatedOptions: [23456],
                code: 'text',
              },
            ],
            template: false,
            creationDate: '2018-09-05T19:04:53.178Z',
          },
        ],
      });

    await pm.init();

    pm.updatedOption.title.en = 'title';
    pm.updatedOption.title.ar = 'title';
    pm.updatedOption.description.en = 'description';
    pm.updatedOption.description.ar = 'description';
    pm.updatedOption.mandatory = true;
    pm.updatedOption.multiSelection = true;
    pm.updatedOption.minAllowed = 2;
    pm.updatedOption.maxAllowed = 4;
    pm.addSelection({
      title: {
        en: 'title',
      },
      price: 8,
    });

    pm.reset();

    assert.deepEqual(pm.updatedOption, {
      title: {
        en: 'Main Menu',
        ar: 'القائمة الرئيسية',
      },
      description: {
        en: 'Main Menu',
        ar: 'القائمة الرئيسية',
      },
      mandatory: false,
      multiSelection: false,
      minAllowed: 5,
      maxAllowed: 5,
      selections: [
        {
          title: {
            en: 'Main Menu',
            ar: 'القائمة الرئيسية',
          },
          calories: 200,
          price: 75.5,
          relatedOptions: [23456],
          code: 'text',
        },
      ],
    });
  });

  it('should have selectionValidators methods', function () {
    const pm = new EditItemOptionPM({
      catalogueId: 123,
      itemId: 457,
      optionId: 789,
    });

    assert.isFunction(pm.selectionValidators.title);
    assert.isFunction(pm.selectionValidators.calories);
  });

  it('should reset minAllowed and maxAllowed on multiSelectionChange to false with undefined', function () {
    const pm = new EditItemOptionPM({
      catalogueId: 123,
      itemId: 457,
      optionId: 789,
    });

    pm.updatedOption.multiSelection = true;

    pm.updatedOption.minAllowed = 1;
    pm.updatedOption.maxAllowed = 7;

    pm.onMultiSelectionChange(false);

    assert.isUndefined(pm.updatedOption.minAllowed);
    assert.isUndefined(pm.updatedOption.maxAllowed);
  });

  it('should reset minAllowed and maxAllowed on multiSelectionChange from false to true with defaultOption values', async function () {
    const pm = new EditItemOptionPM({
      catalogueId: 123,
      itemId: 457,
      optionId: 789,
    });

    $sb
      .stub(VendorProfileDetailsRepoImpl.prototype, 'getCatalogueLanguage')
      .resolves({
        catalogueLanguage: {
          en: true,
          ar: true,
        },
      });

    $sb
      .stub(CatalogueItemDetailsRepoImpl.prototype, 'getCatalogueItemDetails')
      .resolves({
        any: 'Object',
        options: [
          {
            optionId: 12345,
          },
          {
            optionId: 789,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            description: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            mandatory: false,
            multiSelection: false,
            minAllowed: 5,
            maxAllowed: 6,
            selections: [
              {
                title: {
                  en: 'Main Menu',
                  ar: 'القائمة الرئيسية',
                },
                calories: 200,
                price: new Money({ amount: 75.5, currency: 'EGP' }),
                relatedOptions: [23456],
                code: 'text',
              },
            ],
            template: false,
            creationDate: '2018-09-05T19:04:53.178Z',
          },
        ],
      });

    await pm.init();

    pm.updatedOption.multiSelection = true;

    pm.updatedOption.minAllowed = 1;
    pm.updatedOption.maxAllowed = 7;

    pm.onMultiSelectionChange(false);

    assert.isUndefined(pm.updatedOption.minAllowed);
    assert.isUndefined(pm.updatedOption.maxAllowed);

    pm.onMultiSelectionChange(true);

    assert.equal(pm.updatedOption.minAllowed, 5);
    assert.equal(pm.updatedOption.maxAllowed, 6);
  });

  it('should set maxAllowed, minAllowed, selections calories and price to undefined if their value was zero', async function () {
    const pm = new EditItemOptionPM({
      catalogueId: 123,
      itemId: 457,
      optionId: 789,
    });

    $sb
      .stub(VendorProfileDetailsRepoImpl.prototype, 'getCatalogueLanguage')
      .resolves({
        catalogueLanguage: {
          en: true,
          ar: true,
        },
      });

    $sb
      .stub(CatalogueItemDetailsRepoImpl.prototype, 'getCatalogueItemDetails')
      .resolves({
        any: 'Object',
        options: [
          {
            optionId: 12345,
          },
          {
            optionId: 789,
            title: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            description: {
              en: 'Main Menu',
              ar: 'القائمة الرئيسية',
            },
            mandatory: false,
            multiSelection: false,
            minAllowed: 0,
            maxAllowed: 0,
            selections: [
              {
                title: {
                  en: 'Main Menu',
                  ar: 'القائمة الرئيسية',
                },
                calories: 0,
                price: new Money({ amount: 0, currency: 'EGP' }),
                relatedOptions: [23456],
                code: 'text',
              },
            ],
            template: false,
            creationDate: '2018-09-05T19:04:53.178Z',
          },
        ],
      });

    await pm.init();
    assert.deepEqual(pm.updatedOption, {
      title: {
        en: 'Main Menu',
        ar: 'القائمة الرئيسية',
      },
      description: {
        en: 'Main Menu',
        ar: 'القائمة الرئيسية',
      },
      mandatory: false,
      multiSelection: false,
      minAllowed: undefined,
      maxAllowed: undefined,
      selections: [
        {
          title: {
            en: 'Main Menu',
            ar: 'القائمة الرئيسية',
          },
          calories: undefined,
          price: undefined,
          relatedOptions: [23456],
          code: 'text',
        },
      ],
    });
  });
});
