import { Base64EncodedFile } from '@survv/commons/core/models/Files';
import { Time } from '@survv/commons/core/models/Time';
import { VendorOnlineProfileForm } from '../../../../src/core/models/VendorOnlineProfile';
import { assert } from 'chai';
import {
  isValidMoney,
  requireAtLeastOne,
  required,
} from '@survv/commons/core/validations/form-validators/formValidators';

describe('VendorOnlineProfile', function () {
  describe('VendorOnlineProfileForm', function () {
    it('requires a logo', function () {
      const form = new VendorOnlineProfileForm();

      assert.isString(form.validators.logo());
      assert.equal(form.validators.logo(), required(form.logo));

      form.logo = new Base64EncodedFile({
        dataUrl: 'data:image/jpeg;base64,RIGEpsrCGMzYmyikYr/EwQ==',
        type: 'image/jpeg',
        name: 'albumImage1',
      });

      assert.isTrue(form.validators.logo());
    });
    it('requires at least one language support', function () {
      const form = new VendorOnlineProfileForm();

      assert.isString(form.validators.languageSupport());
      assert.equal(
        form.validators.languageSupport(),
        requireAtLeastOne([form.languageSupport.en, form.languageSupport.ar])
      );

      form.languageSupport.en = true;

      assert.isTrue(form.validators.languageSupport());

      form.languageSupport.en = true;
      form.languageSupport.ar = true;
      assert.isTrue(form.validators.languageSupport());
    });
    it('requires the english name', function () {
      const form = new VendorOnlineProfileForm();

      form.languageSupport.en = true;

      assert.isString(form.validators['name.en']());
      assert.equal(form.validators['name.en'](), required(form.name.en));

      form.name = { en: 'en', ar: '' };

      assert.isTrue(form.validators['name.en']());
    });
    it('requires the arabic name', function () {
      const form = new VendorOnlineProfileForm();

      form.languageSupport.ar = true;

      assert.isString(form.validators['name.ar']());
      assert.equal(form.validators['name.ar'](), required(form.name.ar));

      form.name = { en: '', ar: 'ar' };

      assert.isTrue(form.validators['name.ar']());
    });
    it('requires ordering hours "from"', function () {
      const form = new VendorOnlineProfileForm();

      form.orderingHours.from = new Time('12:00');
      assert.isTrue(form.validators['orderingHours.from']());
    });
    it('requires ordering hours "to"', function () {
      const form = new VendorOnlineProfileForm();

      form.orderingHours.to = new Time('12:00');
      assert.isTrue(form.validators['orderingHours.to']());
    });
    it('requires the gallery', function () {
      const form = new VendorOnlineProfileForm();

      assert.isString(form.validators.gallery());
      assert.equal(form.validators.gallery(), required(form.gallery));

      form.gallery = [
        new Base64EncodedFile({
          dataUrl: 'data:image/jpeg;base64,RIGEpsrCGMzYmyikYr/EwQ==',
          type: 'image/jpeg',
          name: 'albumImage1',
        }),
      ];

      assert.isTrue(form.validators.gallery());
    });
    it('requires the cover photo ', function () {
      const form = new VendorOnlineProfileForm();

      assert.isString(form.validators.coverPhoto());
      assert.equal(form.validators.coverPhoto(), required(form.coverPhoto));

      form.coverPhoto = new Base64EncodedFile({
        dataUrl: 'data:image/jpeg;base64,RIGEpsrCGMzYmyikYr/EwQ==',
        type: 'image/jpeg',
        name: 'albumImage1',
      });

      assert.isTrue(form.validators.coverPhoto());
    });
    it('validates minimum order value as money', function () {
      const form = new VendorOnlineProfileForm();

      assert.isTrue(form.validators.minimumOrderValue());

      form.minimumOrderValue = 0.4551;
      assert.isString(form.validators.minimumOrderValue());
      assert.equal(
        form.validators.minimumOrderValue(),
        isValidMoney(form.minimumOrderValue)
      );

      form.minimumOrderValue = -10;
      assert.isString(form.validators.minimumOrderValue());
      assert.equal(
        form.validators.minimumOrderValue(),
        isValidMoney(form.minimumOrderValue)
      );

      form.minimumOrderValue = 100.99;
      assert.isTrue(form.validators.minimumOrderValue());
    });
  });
});
