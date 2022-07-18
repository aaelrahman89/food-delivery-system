import AddItemOptionPM from '../../../../../src/core/presentation-models/online-ordering/AddItemOptionPM';

import { AddItemOptionRepoImpl } from '../../../../../src/shell/repositories/online-ordering/AddItemOptionRepoImpl';
import { CatalogueItemDetailsRepoImpl } from '../../../../../src/shell/repositories/online-ordering/CatalogueItemDetailsRepoImpl';
import { VendorProfileDetailsRepoImpl } from '../../../../../src/shell/repositories/online-ordering/VendorProfileDetailsRepoImpl';

import { $sb } from '@survv/commons/test/utils/sandbox';
import { Duration, TimeUnits } from '@survv/commons/core/models/Duration';
import { LocalError } from '@survv/commons/core/errors/errors';
import { Money } from '@survv/commons/core/models/money';
import { assert } from 'chai';
import {
  consumerVendorProfileResponseStub,
  vendorProfileResponseStub,
} from '@survv/api/stubs/vendors';
import { createBackendUrl } from '@survv/commons/shell/backend/backend';
import { createNotification } from '../../../../../src/core/notification';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { stubGetCatalogueDetails } from '@survv/commons/test/api-stubs/catalogues';
import { successfulOperation } from '@survv/commons/core/notification/notification';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('AddItemOptionPM Integration', function () {
  it('should init and hydrate successfully', async function () {
    const pm = new AddItemOptionPM({
      catalogueId: 123,
      itemId: 456,
      vendorId: 555,
    });

    await stubGetCatalogueDetails({ catalogueId: 123 });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/items/:itemId',
        params: { itemId: 456 },
      })
      .response({
        status: 200,
        body: {
          itemId: 456,
          displayName: {
            en: 'Main Menu',
            ar: 'القائمة الرئيسية',
          },
          description: {
            en: 'Main Menu',
            ar: 'القائمة الرئيسية',
          },
          archived: false,
          calories: 200,
          prepTime: 5,
          popular: false,
          unavailableBranches: [2165529378315486700],
          price: {
            amount: 31.01,
            currency: 'EGP',
          },
          tags: [
            {
              id: 2165529378315486700,
              title: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              vendorType: 'FOOD',
              type: 'NONE',
              status: 'VISIBLE',
              creationDate: '2018-09-05T19:04:53.178Z',
            },
          ],
          hashTags: [
            {
              id: 2165529378315486700,
              title: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              vendorType: 'FOOD',
              status: 'VISIBLE',
              creationDate: '2018-09-05T19:04:53.178Z',
            },
          ],
          options: [
            {
              optionId: 2165529378315486700,
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
                  id: 2165529378315486700,
                  title: {
                    en: 'Main Menu',
                    ar: 'القائمة الرئيسية',
                  },
                  calories: 200,
                  price: {
                    amount: 31.01,
                    currency: 'EGP',
                  },
                  relatedOptions: [2165529378315486700],
                },
              ],
              template: true,
              creationDate: '2018-09-05T19:04:53.178Z',
              related: true,
            },
          ],
          catalogueId: 2165529378315486700,
          defaultCoverPhotoId: 2165529378315486700,
          catalogueSections: [
            {
              catalogueSectionId: 2165529378315486700,
              displayName: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              creationDate: '2018-09-05T19:04:53.178Z',
            },
          ],
          coverPhotosIds: [2165529378315486700],
          creationDate: '2018-09-05T19:04:53.178Z',
        },
      });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/vendors/:vendorId',
        params: { vendorId: 555 },
      })
      .response({ status: 200, body: consumerVendorProfileResponseStub() });

    await pm.init();

    assert.deepEqual(pm.item, {
      itemId: 456,
      title: {
        en: 'Main Menu',
        ar: 'القائمة الرئيسية',
      },
      description: {
        en: 'Main Menu',
        ar: 'القائمة الرئيسية',
      },
      archived: false,
      calories: 200,
      prepTime: new Duration({
        value: 5,
        timeUnit: TimeUnits.MINUTES,
      }),
      price: new Money({
        amount: 31.01,
        currency: 'EGP',
      }),
      tags: [
        {
          id: 2165529378315486700,
          tagId: 2165529378315486700,
          title: {
            en: 'Main Menu',
            ar: 'القائمة الرئيسية',
          },
          vendorType: 'FOOD',
          status: 'VISIBLE',
          creationDate: '2018-09-05T19:04:53.178Z',
        },
        {
          id: 2165529378315486700,
          tagId: 2165529378315486700,
          title: {
            en: 'Main Menu',
            ar: 'القائمة الرئيسية',
          },
          vendorType: 'FOOD',
          type: 'NONE',
          status: 'VISIBLE',
          creationDate: '2018-09-05T19:04:53.178Z',
        },
      ],
      options: [
        {
          optionId: 2165529378315486700,
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
              id: 2165529378315486700,
              title: {
                en: 'Main Menu',
                ar: 'القائمة الرئيسية',
              },
              calories: 200,
              price: new Money({
                amount: 31.01,
                currency: 'EGP',
              }),
              relatedOptions: [2165529378315486700],
            },
          ],
          template: true,
          creationDate: '2018-09-05T19:04:53.178Z',
          related: true,
        },
      ],
      catalogueId: 2165529378315486700,
      categories: [
        {
          catalogueSectionId: 2165529378315486700,
          categoryId: 2165529378315486700,
          displayName: {
            en: 'Main Menu',
            ar: 'القائمة الرئيسية',
          },
          title: {
            en: 'Main Menu',
            ar: 'القائمة الرئيسية',
          },
          creationDate: '2018-09-05T19:04:53.178Z',
        },
      ],
      coverPhotosIds: [2165529378315486700],
      creationDate: '2018-09-05T19:04:53.178Z',
      coverPhotos: [2165529378315486700].map((id) => {
        return {
          id,
          url: createBackendUrl('images/:imageId', { imageId: id }),
        };
      }),
    });
    assert.isUndefined(notificationService.notification);
  });

  it('should submit successfully', async function () {
    const pm = new AddItemOptionPM({
      catalogueId: 123,
      itemId: 456,
      vendorId: 555,
    });

    const vendorStub = vendorProfileResponseStub();
    vendorStub.languageSupport = { en: true, ar: true };
    await stubGetCatalogueDetails({ catalogueId: 123 });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/vendors/:vendorId/profile',
        params: { vendorId: 555 },
      })
      .response({ status: 200, body: vendorStub });

    await pm.init();

    pm.option.title.en = 'title';
    pm.option.title.ar = 'title';
    pm.option.mandatory = true;
    pm.option.multiSelection = true;
    pm.option.minAllowed = 2;
    pm.option.maxAllowed = 4;
    pm.addSelection({
      title: {
        en: 'title',
        ar: 'title',
      },
      price: 8,
    });
    pm.option.description.en = 'helloWorld';
    pm.option.description.ar = 'helloWorld';

    await wiremock
      .stub()
      .request({
        requestLine:
          'post /consumer/api/v1/catalogues/:catalogueId/items/:itemId/options',
        params: {
          catalogueId: 123,
          itemId: 456,
        },
        body: {
          title: {
            en: 'title',
            ar: 'title',
          },
          description: {
            en: 'helloWorld',
            ar: 'helloWorld',
          },
          mandatory: true,
          multiSelection: true,
          minAllowed: 2,
          maxAllowed: 4,
          selections: [
            {
              title: {
                en: 'title',
                ar: 'title',
              },
              price: {
                amount: 8,
                currency: 'EGP',
              },
            },
          ],
        },
      })
      .response({
        status: 200,
        body: {
          optionId: 123124,
          creationDate: '2018-09-05T19:04:53.178Z',
        },
      });

    await pm.submit();

    assert.deepEqual(notificationService.notification, successfulOperation());
  });
});
describe('AddItemOptionPM Unit', function () {
  it('should initialize items props correctly', function () {
    const pm = new AddItemOptionPM({ catalogueId: 123, itemId: 456 });

    assert.deepEqual(pm.item, {
      options: [],
      title: {},
      categories: [],
      tags: [],
    });
  });

  it('should determine enabled ui input languages based on catalogue language', async function () {
    const pm = new AddItemOptionPM({ catalogueId: 123, itemId: 457 });

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
    const pm = new AddItemOptionPM({ catalogueId: 123, itemId: 457 });

    assert.deepEqual(pm.inputLanguage, {
      en: true,
      ar: false,
    });
  });

  it('should display error if init failed', async function () {
    const pm = new AddItemOptionPM({ catalogueId: 123, itemId: 457 });

    const error = new LocalError({
      message: 'Hydration Failed',
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
    const pm = new AddItemOptionPM({ catalogueId: 123, itemId: 457 });

    pm.addSelection({
      title: {
        en: 'selection 1',
        ar: undefined,
      },
      calories: 1,
      price: 1,
      relatedOptions: [123],
    });
    pm.addSelection({
      title: {
        en: 'selection 2',
        ar: undefined,
      },
      calories: 2,
      price: 2,
      relatedOptions: [456],
    });

    assert.deepEqual(pm.option.selections, [
      {
        title: {
          en: 'selection 1',
          ar: undefined,
        },
        calories: 1,
        price: 1,
        relatedOptions: [123],
      },
      {
        title: {
          en: 'selection 2',
          ar: undefined,
        },
        calories: 2,
        price: 2,
        relatedOptions: [456],
      },
    ]);
  });

  it('should be able to delete selections', function () {
    const pm = new AddItemOptionPM({ catalogueId: 123, itemId: 457 });

    pm.addSelection({
      title: {
        en: 'selection 1',
        ar: undefined,
      },
      calories: 1,
      price: 1,
      relatedOptions: [123],
    });
    pm.addSelection({
      title: {
        en: 'selection 2',
        ar: undefined,
      },
      calories: 2,
      price: 2,
      relatedOptions: [456],
    });
    pm.addSelection({
      title: {
        en: 'selection 3',
        ar: undefined,
      },
      calories: 3,
      price: 3,
      relatedOptions: [789],
    });

    pm.deleteSelection(2);
    pm.deleteSelection(0);

    assert.deepEqual(pm.option.selections, [
      {
        title: {
          en: 'selection 2',
          ar: undefined,
        },
        calories: 2,
        price: 2,
        relatedOptions: [456],
      },
    ]);
  });

  it('should be able to update selections', function () {
    const pm = new AddItemOptionPM({ catalogueId: 123, itemId: 457 });

    pm.addSelection({
      title: {
        en: 'selection 1',
        ar: undefined,
      },
      calories: 1,
      price: 1,
      relatedOptions: [123],
    });
    pm.addSelection({
      title: {
        en: 'selection 2',
        ar: undefined,
      },
      calories: 2,
      price: 2,
      relatedOptions: [456],
    });
    pm.addSelection({
      title: {
        en: 'selection 3',
        ar: undefined,
      },
      calories: 3,
      price: 3,
      relatedOptions: [789],
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
    });
    pm.updateSelection({
      index: 0,
      title: {
        en: 'selection 1 modified',
        ar: undefined,
      },
      calories: 1,
      price: 1,
      relatedOptions: [123, 567],
    });

    assert.deepEqual(pm.option.selections, [
      {
        title: {
          en: 'selection 1 modified',
          ar: undefined,
        },
        calories: 1,
        price: 1,
        relatedOptions: [123, 567],
      },
      {
        title: {
          en: 'selection 2 modified',
          ar: undefined,
        },
        calories: 22,
        price: 2,
        relatedOptions: [456],
      },
      {
        title: {
          en: 'selection 3',
          ar: undefined,
        },
        calories: 3,
        price: 3,
        relatedOptions: [789],
      },
    ]);
  });

  it('should ignore updating selections with index >= selections.length', function () {
    const pm = new AddItemOptionPM({ catalogueId: 123, itemId: 457 });

    pm.addSelection({
      title: {
        en: 'selection 1',
        ar: undefined,
      },
      calories: 1,
      price: 1,
      relatedOptions: [123],
    });
    pm.addSelection({
      title: {
        en: 'selection 2',
        ar: undefined,
      },
      calories: 2,
      price: 2,
      relatedOptions: [456],
    });
    pm.addSelection({
      title: {
        en: 'selection 3',
        ar: undefined,
      },
      calories: 3,
      price: 3,
      relatedOptions: [789],
    });

    pm.updateSelection({ index: 6 });
    pm.updateSelection({ index: 10 });

    assert.deepEqual(pm.option.selections, [
      {
        title: {
          en: 'selection 1',
          ar: undefined,
        },
        calories: 1,
        price: 1,
        relatedOptions: [123],
      },
      {
        title: {
          en: 'selection 2',
          ar: undefined,
        },
        calories: 2,
        price: 2,
        relatedOptions: [456],
      },
      {
        title: {
          en: 'selection 3',
          ar: undefined,
        },
        calories: 3,
        price: 3,
        relatedOptions: [789],
      },
    ]);
  });

  context('validators', function () {
    it('should return errors.missingFieldError if required title locale does not exist', async function () {
      const pm = new AddItemOptionPM({ catalogueId: 123, itemId: 457 });

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
      const pm = new AddItemOptionPM({ catalogueId: 123, itemId: 457 });

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
      const pm = new AddItemOptionPM({ catalogueId: 123, itemId: 457 });

      pm.option.multiSelection = true;

      assert.equal(pm.validators().minAllowed(), 'validation.invalid.positive');

      assert.equal(pm.validators().maxAllowed(), 'validation.invalid.positive');
    });

    it('should return errors.invalidMinMaxError on if maxAllowed <= maxAllowed if multiSelection was enabled', function () {
      const pm = new AddItemOptionPM({ catalogueId: 123, itemId: 457 });

      pm.option.multiSelection = true;

      pm.option.minAllowed = 2;

      pm.option.maxAllowed = 1;

      assert.equal(
        pm.validators().maxAllowed(),
        'validation.invalid.min_max',
        'asserting less than minAllowed'
      );

      pm.option.minAllowed = 7;

      pm.option.maxAllowed = 7;

      assert.equal(
        pm.validators().maxAllowed(),
        'validation.invalid.min_max',
        'asserting equals minAllowed'
      );
    });

    it('should return true if minAllowed and maxAllowed are not required', function () {
      const pm = new AddItemOptionPM({ catalogueId: 123, itemId: 457 });

      pm.option.multiSelection = false;

      assert.isTrue(pm.validators().minAllowed());

      assert.isTrue(pm.validators().maxAllowed());
    });

    it('should be able to validate the title for a single selection', function () {
      const pm = new AddItemOptionPM({ catalogueId: 123, itemId: 457 });

      pm.addSelection({
        title: {
          en: '',
          ar: undefined,
        },
        calories: 1,
        price: 1,
        relatedOptions: [123],
      });
      pm.addSelection({
        title: {
          en: 'selection 2',
          ar: undefined,
        },
        calories: 2,
        price: 2,
        relatedOptions: [456],
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
      const pm = new AddItemOptionPM({ catalogueId: 123, itemId: 457 });

      pm.addSelection({
        title: {
          en: '',
          ar: undefined,
        },
        calories: undefined,
        price: 0,
        relatedOptions: [123],
      });
      pm.addSelection({
        title: {
          en: 'selection 2',
          ar: undefined,
        },
        calories: 200,
        price: -1,
        relatedOptions: [456],
      });
      pm.addSelection({
        title: {
          en: 'selection 2',
          ar: undefined,
        },
        calories: -1,
        price: -1,
        relatedOptions: [456],
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
      const pm = new AddItemOptionPM({ catalogueId: 123, itemId: 457 });

      assert.equal(pm.validators().selections(), 'validation.missing.field');
    });

    it('should return true for selections validation if all selections are valid', function () {
      const pm = new AddItemOptionPM({ catalogueId: 123, itemId: 457 });

      pm.addSelection({
        title: {
          en: 'hello world',
          ar: undefined,
        },
        calories: 1234,
        price: 2000,
        relatedOptions: [123],
      });
      pm.addSelection({
        title: {
          en: 'selection 2',
          ar: undefined,
        },
        calories: 200,
        price: 1234,
        relatedOptions: [456],
      });
      pm.addSelection({
        title: {
          en: 'selection 2',
          ar: undefined,
        },
        calories: 11,
        price: 11,
        relatedOptions: [456],
      });

      assert.isTrue(pm.validators().selections());
    });

    it('should return false for selections validation if any selection is valid', function () {
      const pm = new AddItemOptionPM({ catalogueId: 123, itemId: 457 });

      pm.addSelection({
        title: {
          en: 'hello world',
          ar: undefined,
        },
        calories: 1234,
        price: 2000,
        relatedOptions: [123],
      });
      pm.addSelection({
        title: {
          en: undefined,
          ar: undefined,
        },
        calories: undefined,
        price: undefined,
        relatedOptions: undefined,
      });

      assert.isFalse(pm.validators().selections());
    });
  });

  it('should disable submit if any validator is not valid', async function () {
    const pm = new AddItemOptionPM({ catalogueId: 123, itemId: 456 });

    assert.isFalse(pm.canSubmit);
  });

  it('should display errors of submit failed', async function () {
    const pm = new AddItemOptionPM({ catalogueId: 123, itemId: 456 });

    const error = new LocalError({
      message: 'Submission failed',
      code: 'ERR_TECHNICAL_ERROR',
    });

    pm.option.title.en = 'title';
    pm.option.description.en = 'description';
    pm.option.mandatory = true;
    pm.option.multiSelection = true;
    pm.option.minAllowed = 2;
    pm.option.maxAllowed = 4;
    pm.addSelection({
      title: {
        en: 'title',
      },
      price: 8,
    });

    $sb.stub(AddItemOptionRepoImpl.prototype, 'addItemOption').rejects(error);

    await pm.submit();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });

  it('should not submit and display errors.invalidFormError if attempted to submit invalid form', async function () {
    const pm = new AddItemOptionPM({ catalogueId: 123, itemId: 456 });

    const error = new LocalError({
      message: 'Invalid Form',
      code: 'ERR_TECHNICAL_ERROR',
    });

    $sb.stub(AddItemOptionRepoImpl.prototype, 'addItemOption').rejects(error);

    await pm.submit();

    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });

  it('should be able to clear the form', async function () {
    const pm = new AddItemOptionPM({ catalogueId: 123, itemId: 457 });

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

    pm.option.title.en = 'title';
    pm.option.title.ar = 'title';
    pm.option.description.en = 'description';
    pm.option.description.ar = 'description';
    pm.option.mandatory = true;
    pm.option.multiSelection = true;
    pm.option.minAllowed = 2;
    pm.option.maxAllowed = 4;
    pm.addSelection({
      title: {
        en: 'title',
      },
      price: 8,
    });

    pm.clear();

    assert.deepEqual(pm.option.title, { en: undefined, ar: undefined });
    assert.deepEqual(pm.option.description, { en: undefined, ar: undefined });
    assert.isFalse(pm.option.mandatory);
    assert.isFalse(pm.option.multiSelection);
    assert.isUndefined(pm.option.minAllowed);
    assert.isUndefined(pm.option.maxAllowed);
    assert.deepEqual(pm.option.selections, []);
  });

  it('should submit, clear and re-init on submitAndReset', async function () {
    const pm = new AddItemOptionPM({
      catalogueId: 123,
      itemId: 456,
      vendorId: 555,
    });

    $sb
      .stub(VendorProfileDetailsRepoImpl.prototype, 'getCatalogueLanguage')
      .resolves({
        catalogueLanguage: {
          en: true,
          ar: false,
        },
      });

    $sb
      .stub(CatalogueItemDetailsRepoImpl.prototype, 'getCatalogueItemDetails')
      .resolves({
        any: 'Object',
      });

    await pm.init();

    $sb.restore();

    $sb
      .stub(CatalogueItemDetailsRepoImpl.prototype, 'getCatalogueItemDetails')
      .withArgs({ itemId: 456 })
      .returns({
        returned: 'object',
      });

    $sb
      .stub(VendorProfileDetailsRepoImpl.prototype, 'getCatalogueLanguage')
      .withArgs({ vendorId: 555 })
      .returns({});

    $sb
      .stub(AddItemOptionRepoImpl.prototype, 'addItemOption')
      .withArgs({
        catalogueId: 123,
        itemId: 456,
        payload: {
          title: {
            en: 'title',
            ar: undefined,
          },
          description: {
            en: 'description',
            ar: undefined,
          },
          mandatory: true,
          multiSelection: true,
          minAllowed: 2,
          maxAllowed: 4,
          selections: [
            {
              title: {
                en: 'title',
              },
              price: 8,
              calories: undefined,
              relatedOptions: undefined,
            },
          ],
        },
      })
      .returns({});

    pm.option.title.en = 'title';
    pm.option.description.en = 'description';
    pm.option.mandatory = true;
    pm.option.multiSelection = true;
    pm.option.minAllowed = 2;
    pm.option.maxAllowed = 4;
    pm.addSelection({
      title: {
        en: 'title',
      },
      price: 8,
    });

    await pm.submitAndReset();

    assert.deepEqual(notificationService.notification, successfulOperation());

    assert.deepEqual(pm.option.title, { en: undefined, ar: undefined });
    assert.deepEqual(pm.option.description, { en: undefined, ar: undefined });
    assert.isFalse(pm.option.mandatory);
    assert.isFalse(pm.option.multiSelection);
    assert.isUndefined(pm.option.minAllowed);
    assert.isUndefined(pm.option.maxAllowed);
    assert.deepEqual(pm.option.selections, []);
  });
  it('should have selectionValidators methods', function () {
    const pm = new AddItemOptionPM({ catalogueId: 123, itemId: 456 });

    assert.isFunction(pm.selectionValidators.title);
    assert.isFunction(pm.selectionValidators.calories);
  });

  it('should reset minAllowed and maxAllowed on multiSelectionChange to false with undefined', function () {
    const pm = new AddItemOptionPM({ catalogueId: 123, itemId: 456 });

    pm.option.multiSelection = true;

    pm.option.minAllowed = 1;
    pm.option.maxAllowed = 7;

    pm.onMultiSelectionChange(false);

    assert.isUndefined(pm.option.minAllowed);
    assert.isUndefined(pm.option.maxAllowed);

    pm.onMultiSelectionChange(true);

    assert.isUndefined(pm.option.minAllowed);
    assert.isUndefined(pm.option.maxAllowed);
  });
});
