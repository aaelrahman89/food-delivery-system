import VueI18n from 'vue-i18n';
import { $sb } from '../../../utils/sandbox';
import { LocalizationServiceImpl } from '../../../../shell/services/LocalizationServiceImpl';
import { MultilingualString } from '../../../../core/models/MultilingualString';
import { expect } from 'chai';
import { userPreferenceRepo } from '../../../../shell/repositories/UserPreferenceRepoImpl';

describe('LocalizationServiceImpl Unit', function () {
  it('throws error if LocalizationServiceImpl was not configured', function (done) {
    const localizationServiceImpl = LocalizationServiceImpl.getInstance();

    try {
      localizationServiceImpl.localize('value');
      done(new Error('localize() should have thrown an error'));
    } catch (err) {
      expect(err.message).to.equal(
        'LocalizationServiceImpl has not been configured'
      );
      done();
    }
  });

  it('throws error if getting language failed', async function () {
    $sb.stub(userPreferenceRepo, 'getLanguage').rejects(new Error('an error'));
    const localizationServiceImpl = LocalizationServiceImpl.getInstance();

    try {
      await localizationServiceImpl.configure({
        t: (val: string) => `LOCALIZED_${val}`,
      } as VueI18n);
      return Promise.reject(
        new Error('getInstance() should have thrown an error')
      );
    } catch (err) {
      return Promise.resolve(expect(err.message).to.equal('an error'));
    }
  });

  it('localizes MultilingualString correctly in case local was "en"', async function () {
    $sb.stub(userPreferenceRepo, 'getLanguage').resolves('en');
    const localizationServiceImpl = LocalizationServiceImpl.getInstance();

    await localizationServiceImpl.configure({
      t: (val: string) => `LOCALIZED_${val}`,
    } as VueI18n);

    expect(
      localizationServiceImpl.localize(
        new MultilingualString({ en: 'en val', ar: 'ar val' })
      )
    ).to.equal('en val');

    expect(
      localizationServiceImpl.localize(
        new MultilingualString({ en: '', ar: 'ar val' })
      )
    ).to.equal('ar val');
  });

  it('localizes MultilingualString correctly in case local was "ar"', async function () {
    $sb.stub(userPreferenceRepo, 'getLanguage').resolves('ar');
    const localizationServiceImpl = LocalizationServiceImpl.getInstance();

    await localizationServiceImpl.configure({
      t: (val: string) => `LOCALIZED_${val}`,
    } as VueI18n);

    expect(
      localizationServiceImpl.localize(
        new MultilingualString({ en: 'en val', ar: 'ar val' })
      )
    ).to.equal('ar val');

    expect(
      localizationServiceImpl.localize(
        new MultilingualString({ en: 'en val', ar: '' })
      )
    ).to.equal('en val');
  });

  it('localizes objects implementing toString() successfully', async function () {
    $sb.stub(userPreferenceRepo, 'getLanguage').resolves('ar');
    const localizationServiceImpl = LocalizationServiceImpl.getInstance();

    await localizationServiceImpl.configure({
      t: (val: string) => `LOCALIZED_${val}`,
    } as VueI18n);

    expect(
      localizationServiceImpl.localize({
        toString() {
          return 'object_value';
        },
      })
    ).to.equal('LOCALIZED_object_value');
  });

  it('localizes given string values successfully', async function () {
    $sb.stub(userPreferenceRepo, 'getLanguage').resolves('ar');
    const localizationServiceImpl = LocalizationServiceImpl.getInstance();

    await localizationServiceImpl.configure({
      t: (val: string) => `LOCALIZED_${val}`,
    } as VueI18n);

    expect(localizationServiceImpl.localize('value')).to.equal(
      'LOCALIZED_value'
    );
  });
});
