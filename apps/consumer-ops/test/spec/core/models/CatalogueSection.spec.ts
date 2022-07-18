import { $sb } from '@survv/commons/test/utils/sandbox';
import { CatalogueSectionForm } from '../../../../src/core/models/CatalogueSection';
import { assert } from 'chai';
import { required } from '@survv/commons/core/validations/form-validators/formValidators';

describe('CatalogueSection', function () {
  describe('CatalogueSectionForm', function () {
    it('initializes the form inputs with default values correctly', function () {
      const catalogueSectionForm = new CatalogueSectionForm();
      assert.deepEqual(
        catalogueSectionForm.displayName,
        {
          en: '',
          ar: '',
        },
        'display name form input initialized correctly'
      );
    });
    it('initializes the form inputs with values if given', function () {
      const catalogueSectionForm = new CatalogueSectionForm({
        formInputs: {
          displayName: { en: 'en text', ar: 'ar text' },
          taxTierId: 123,
          vendorTaxStatus: 'NOT_APPLICABLE',
        },
      });
      assert.deepEqual(
        catalogueSectionForm.displayName,
        { en: 'en text', ar: 'ar text' },
        'display name form input initialized with given input correctly'
      );
    });
    it('disables displayName.en if EN lang. was not supported', function () {
      let catalogueSectionForm = new CatalogueSectionForm({
        languageSupport: { en: false, ar: false },
      });

      assert.isTrue(
        catalogueSectionForm.disableEnDisplayName,
        'should disable EN display name if EN lang. was not supported'
      );

      catalogueSectionForm = new CatalogueSectionForm({
        languageSupport: { en: true, ar: false },
      });

      assert.isFalse(
        catalogueSectionForm.disableEnDisplayName,
        'should not disable EN display name if EN lang. was supported'
      );
    });
    it('disables displayName.ar if AR lang. was not supported', function () {
      let catalogueSectionForm = new CatalogueSectionForm({
        languageSupport: { en: false, ar: false },
      });

      assert.isTrue(
        catalogueSectionForm.disableArDisplayName,
        'should disable AR display name if AR lang. was not supported'
      );

      catalogueSectionForm = new CatalogueSectionForm({
        languageSupport: { en: false, ar: true },
      });

      assert.isFalse(
        catalogueSectionForm.disableArDisplayName,
        'should not disable AR display name if AR lang. was supported'
      );
    });
    describe('validators', function () {
      it('displayName.en is required if EN lang. was supported', function () {
        const catalogueSectionForm = new CatalogueSectionForm({
          languageSupport: { en: true, ar: false },
        });

        assert.equal(
          catalogueSectionForm.validators['displayName.en'](),
          required(''),
          'validation result should equal to the result of passing empty value to required form validator'
        );

        catalogueSectionForm.displayName.en = 'en text';

        assert.equal(
          catalogueSectionForm.validators['displayName.en'](),
          required('en text'),
          'validation result should equal to the result of passing valid value to required form validator'
        );
      });

      it('displayName.en is not required if EN lang. was not supported', function () {
        const catalogueSectionForm = new CatalogueSectionForm({
          languageSupport: { en: false, ar: false },
        });

        assert.isTrue(
          catalogueSectionForm.validators['displayName.en'](),
          'validation result will be true even if displayName.en has no value since EN lang. was not supported'
        );
      });

      it('displayName.ar is required if AR lang. was supported', function () {
        const catalogueSectionForm = new CatalogueSectionForm({
          languageSupport: { en: false, ar: true },
        });

        assert.equal(
          catalogueSectionForm.validators['displayName.ar'](),
          required(''),
          'validation result should equal to the result of passing empty value to required form validator'
        );

        catalogueSectionForm.displayName.ar = 'ar text';

        assert.equal(
          catalogueSectionForm.validators['displayName.ar'](),
          required('ar text'),
          'validation result should equal to the result of passing valid value to required form validator'
        );
      });

      it('displayName.ar is not required if AR lang. was not supported', function () {
        const catalogueSectionForm = new CatalogueSectionForm({
          languageSupport: { en: false, ar: false },
        });

        assert.isTrue(
          catalogueSectionForm.validators['displayName.ar'](),
          'validation result will be true even if displayName.ar has no value since AR lang. was not supported'
        );
      });
    });
    describe('submit()', function () {
      it('executes assigned submitFn and if succeeded executes submitHandler', async function () {
        const submitHandler = $sb.stub().resolves();
        const successHandler = $sb.stub().resolves();
        const errorHandler = $sb.stub().resolves();
        const catalogueSectionForm = new CatalogueSectionForm({
          languageSupport: { en: true, ar: true },
        });
        catalogueSectionForm
          .assignSubmitHandler(submitHandler)
          .assignErrorHandler(errorHandler)
          .assignSuccessHandler(successHandler);

        catalogueSectionForm.displayName = { en: 'en', ar: 'ar' };
        catalogueSectionForm.taxTierId = 1;

        await catalogueSectionForm.submit();

        assert.isTrue(submitHandler.calledOnce);
        assert.isTrue(successHandler.calledOnce);
        assert.isTrue(errorHandler.notCalled);
      });

      it('executes errorHandler if submitFn failed', async function () {
        const submitHandler = $sb.stub().rejects();
        const successHandler = $sb.stub().resolves();
        const errorHandler = $sb.stub().resolves();
        const catalogueSectionForm = new CatalogueSectionForm({
          languageSupport: { en: true, ar: true },
        });
        catalogueSectionForm
          .assignSubmitHandler(submitHandler)
          .assignErrorHandler(errorHandler)
          .assignSuccessHandler(successHandler);

        catalogueSectionForm.displayName = { en: 'en', ar: 'ar' };
        catalogueSectionForm.taxTierId = 1;

        await catalogueSectionForm.submit();

        assert.isTrue(submitHandler.calledOnce);
        assert.isTrue(errorHandler.calledOnce);
        assert.isTrue(successHandler.notCalled);
      });
    });
  });
});
