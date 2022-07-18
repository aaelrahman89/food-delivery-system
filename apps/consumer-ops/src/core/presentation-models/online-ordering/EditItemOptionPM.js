import ObjectUtils from '../../etc/ObjectUtils';
import { BasePM } from '@survv/commons/core/base/BasePM';
import { CatalogueItemDetailsRepoImpl } from '../../../shell/repositories/online-ordering/CatalogueItemDetailsRepoImpl';
import { EditItemOptionRepoImpl } from '../../../shell/repositories/online-ordering/EditItemOptionRepoImpl';
import { VendorProfileDetailsRepoImpl } from '../../../shell/repositories/online-ordering/VendorProfileDetailsRepoImpl';
import {
  badOperation,
  successfulOperation,
} from '@survv/commons/core/notification/notification';
import { createNotification } from '../../notification';
import { errors } from '../../errors';
import { notificationService } from '@survv/commons/shell/services/notificationService';

class EditItemOptionPM extends BasePM {
  constructor({ catalogueId, itemId, optionId, vendorId }) {
    super();
    this._notificationService = notificationService;
    this._catalogueId = catalogueId;
    this._itemId = itemId;
    this._optionId = optionId;
    this._vendor = undefined;
    this._vendorId = vendorId;
    this.item = {
      options: [],
      title: {},
      categories: [],
      tags: [],
    };
    this._defaultOption = undefined;
    this.updatedOption = {
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
      this.updatedOption.maxAllowed = undefined;
      this.updatedOption.minAllowed = undefined;
    } else {
      this.updatedOption.maxAllowed = this._defaultOption.maxAllowed;
      this.updatedOption.minAllowed = this._defaultOption.minAllowed;
    }
  }

  addSelection({ title, calories, price, relatedOptions, code }) {
    this.updatedOption.selections.push({
      title,
      calories,
      price,
      relatedOptions,
      code,
    });
  }

  deleteSelection(selectionIndex) {
    this.updatedOption.selections = this.updatedOption.selections.filter(
      (_, index) => selectionIndex != index
    );
  }

  updateSelection({ index, title, calories, price, relatedOptions, code }) {
    if (index < this.updatedOption.selections.length) {
      this.updatedOption.selections[index] = {
        title,
        calories,
        price,
        relatedOptions,
        code,
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

      if (this.item.options) {
        this._setDefaultOption();

        this._cloneDefaultOption();
      }
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  get selectionValidators() {
    return {
      title: ({ selection, locale }) => {
        return this._validateTitle({
          locale,
          value: selection.title,
        });
      },
      calories: ({ selection }) => {
        if (typeof selection.calories != 'number') {
          return true;
        }
        return this._validatePositiveNumber(selection.calories);
      },
    };
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

  validators() {
    return {
      titleAr: () =>
        this._validateTitle({ locale: 'ar', value: this.updatedOption.title }),
      titleEn: () =>
        this._validateTitle({ locale: 'en', value: this.updatedOption.title }),
      minAllowed: () => {
        if (!this.updatedOption.multiSelection) {
          return true;
        }
        return this._validatePositiveNumber(this.updatedOption.minAllowed);
      },
      maxAllowed: () => {
        if (!this.updatedOption.multiSelection) {
          return true;
        }
        if (
          this._validatePositiveNumber(this.updatedOption.maxAllowed) !== true
        ) {
          return this._validatePositiveNumber(this.updatedOption.maxAllowed);
        }

        if (this.updatedOption.maxAllowed <= this.updatedOption.minAllowed) {
          return errors.invalidMinMaxError;
        }

        return true;
      },
      selections: ({ single, index, field, locale } = {}) => {
        if (!this.updatedOption.selections.length) {
          return errors.missingFieldError;
        }

        if (single) {
          return this.selectionValidators[field]({
            locale,
            selection: this.updatedOption.selections[index],
          });
        }

        return this.updatedOption.selections.every((selection) => {
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
    return (
      this.isValid() &&
      !ObjectUtils.deepEqual(this._defaultOption, this.updatedOption)
    );
  }

  async submit() {
    return this._longProcess(async () => {
      try {
        if (!this.canSubmit) {
          this._notificationService.notify(badOperation());
          return false;
        }
        await new EditItemOptionRepoImpl().EditItemOption({
          catalogueId: this._catalogueId,
          itemId: this._itemId,
          optionId: this._optionId,
          payload: this.updatedOption,
        });
        this._notificationService.notify(successfulOperation());
        return true;
      } catch (err) {
        this._notificationService.notify(createNotification(err));
        return false;
      }
    });
  }

  _setDefaultOption() {
    const [filteredOption] = this.item.options.filter(
      (option) => option.optionId == this._optionId
    );

    this._defaultOption = {
      title: filteredOption.title,
      description: filteredOption.description,
      mandatory: filteredOption.mandatory,
      multiSelection: filteredOption.multiSelection,
      minAllowed: filteredOption.minAllowed || undefined,
      maxAllowed: filteredOption.maxAllowed || undefined,
      selections: filteredOption.selections.map((selection) => ({
        ...selection,
        price: selection.price.value || undefined,
        calories: selection.calories || undefined,
        code: selection.code || undefined,
      })),
    };
  }

  _cloneDefaultOption() {
    this.updatedOption = ObjectUtils.deepClone(this._defaultOption);
  }

  reset() {
    this._cloneDefaultOption();
  }
}

export default EditItemOptionPM;
