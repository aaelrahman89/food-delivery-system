import { AddItemOptionRepoImpl } from '../../../shell/repositories/online-ordering/AddItemOptionRepoImpl';
import { BasePM } from '@survv/commons/core/base/BasePM';
import { CatalogueItemDetailsRepoImpl } from '../../../shell/repositories/online-ordering/CatalogueItemDetailsRepoImpl';
import { VendorProfileDetailsRepoImpl } from '../../../shell/repositories/online-ordering/VendorProfileDetailsRepoImpl';
import { createNotification } from '../../notification';
import { errors } from '../../errors';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { successfulOperation } from '@survv/commons/core/notification/notification';

class AddItemOptionPM extends BasePM {
  constructor({ catalogueId, itemId, vendorId }) {
    super();
    this._notificationService = notificationService;
    this._catalogueId = catalogueId;
    this._itemId = itemId;
    this._vendor = undefined;
    this._vendorId = vendorId;
    this.item = {
      options: [],
      title: {},
      categories: [],
      tags: [],
    };
    this.option = {
      title: {
        en: undefined,
        ar: undefined,
      },
      description: {
        en: undefined,
        ar: undefined,
      },
      mandatory: false,
      multiSelection: false,
      minAllowed: undefined,
      maxAllowed: undefined,
      selections: [],
    };
  }

  onMultiSelectionChange(value) {
    if (value === false) {
      this.option.maxAllowed = undefined;
      this.option.minAllowed = undefined;
    }
  }

  addSelection({ title, calories, price, relatedOptions }) {
    this.option.selections.push({
      title,
      calories,
      price,
      relatedOptions,
    });
  }

  deleteSelection(selectionIndex) {
    this.option.selections = this.option.selections.filter(
      (_, index) => selectionIndex != index
    );
  }

  updateSelection({ index, title, calories, price, relatedOptions }) {
    if (index < this.option.selections.length) {
      this.option.selections[index] = {
        title,
        calories,
        price,
        relatedOptions,
      };
    }
  }

  async _hydrate() {
    try {
      this._vendor =
        await new VendorProfileDetailsRepoImpl().getCatalogueLanguage({
          vendorId: this._vendorId,
        });

      this.item =
        await new CatalogueItemDetailsRepoImpl().getCatalogueItemDetails({
          itemId: this._itemId,
        });
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  get inputLanguage() {
    if (!this._vendor) {
      return {
        en: true,
        ar: false,
      };
    }
    return this._vendor.catalogueLanguage;
  }

  _isRequiredLocale(locale) {
    return this.inputLanguage[locale];
  }

  _validateTitle({ locale, value }) {
    if (!this._isRequiredLocale(locale)) {
      return true;
    }

    if (!value[locale]) {
      return errors.missingFieldError;
    }

    return true;
  }

  _validatePositiveNumber(value) {
    if (!value || value <= 0) {
      return errors.invalidPositiveError;
    }
    return true;
  }

  get selectionValidators() {
    return {
      calories: ({ selection }) => {
        if (typeof selection.calories != 'number') {
          return true;
        }
        return this._validatePositiveNumber(selection.calories);
      },
      title: ({ selection, locale }) => {
        return this._validateTitle({
          locale,
          value: selection.title,
        });
      },
    };
  }

  validators() {
    return {
      titleAr: () =>
        this._validateTitle({ locale: 'ar', value: this.option.title }),
      titleEn: () =>
        this._validateTitle({ locale: 'en', value: this.option.title }),
      minAllowed: () => {
        if (!this.option.multiSelection) {
          return true;
        }
        return this._validatePositiveNumber(this.option.minAllowed);
      },
      maxAllowed: () => {
        if (!this.option.multiSelection) {
          return true;
        }
        if (this._validatePositiveNumber(this.option.maxAllowed) !== true) {
          return this._validatePositiveNumber(this.option.maxAllowed);
        }

        if (this.option.maxAllowed <= this.option.minAllowed) {
          return errors.invalidMinMaxError;
        }

        return true;
      },
      selections: ({ single, index, field, locale } = {}) => {
        if (!this.option.selections.length) {
          return errors.missingFieldError;
        }

        if (single) {
          return this.selectionValidators[field]({
            locale,
            selection: this.option.selections[index],
          });
        }

        return this.option.selections.every((selection) => {
          const { title, calories } = this.selectionValidators;
          return (
            title({
              selection,
              locale: 'en',
            }) === true &&
            title({
              selection,
              locale: 'ar',
            }) === true &&
            calories({ selection }) === true
          );
        });
      },
    };
  }

  get canSubmit() {
    return this.isValid();
  }

  async submit() {
    return this._longProcess(async () => {
      try {
        if (!this.canSubmit) {
          this._displayError(Error(errors.invalidFormError));
          return;
        }
        await new AddItemOptionRepoImpl().addItemOption({
          catalogueId: this._catalogueId,
          itemId: this._itemId,
          payload: this.option,
        });

        this._notificationService.notify(successfulOperation());
      } catch (err) {
        this._notificationService.notify(createNotification(err));
      }
    });
  }

  clear() {
    this.option = {
      title: {
        en: undefined,
        ar: undefined,
      },
      description: {
        en: undefined,
        ar: undefined,
      },
      mandatory: false,
      multiSelection: false,
      minAllowed: undefined,
      maxAllowed: undefined,
      selections: [],
    };
  }

  async submitAndReset() {
    await this.submit();
    this.clear();
    await this.init();
  }
}

export default AddItemOptionPM;
