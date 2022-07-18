import { CatalogueItemForm } from '../../../../src/core/models/CatalogueItem';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { assert } from 'chai';
import { required } from '@survv/commons/core/validations/form-validators/formValidators';

describe('CatalogueItem models', function () {
  describe('CatalogueItemForm', function () {
    it('requires the english display name when the forms language support requires it', function () {
      const form = new CatalogueItemForm({
        languageSupport: {
          en: true,
          ar: false,
        },
      });

      assert.isString(form.validators['displayName.en']());
      assert.equal(
        form.validators['displayName.en'](),
        required(form.displayName.en)
      );

      form.displayName = { en: 'en', ar: '' };

      assert.isTrue(form.validators['displayName.en']());
    });
    it('requires the arabic display name when the forms language support requires it', function () {
      const form = new CatalogueItemForm({
        languageSupport: {
          en: false,
          ar: true,
        },
      });

      assert.isString(form.validators['displayName.ar']());
      assert.equal(
        form.validators['displayName.ar'](),
        required(form.displayName.ar)
      );

      form.displayName = { en: '', ar: 'ar' };

      assert.isTrue(form.validators['displayName.ar']());
    });
    it('requires a catalogue section', function () {
      const form = new CatalogueItemForm();

      assert.isString(form.validators.catalogueSections());
      assert.equal(
        form.validators.catalogueSections(),
        required(form.catalogueSections)
      );

      form.catalogueSections = [
        {
          id: 0,
          displayName: {
            en: 'en',
            ar: 'ar',
          },
          creationDate: new Datetime('2018-09-05T19:04:53.178Z'),
        },
      ];

      assert.isTrue(form.validators.catalogueSections());
    });
  });
});
