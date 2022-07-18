import { Base64EncodedFile } from '@survv/commons/core/models/Files';
import { BaseForm } from '@survv/commons/core/models/Forms';
import { EntityId } from '@survv/commons/core/types';
import {
  FormValidationResult,
  required,
} from '@survv/commons/core/validations/form-validators/formValidators';
import { ImageUrlString } from '@survv/commons/core/models/Images';
import { SimplifiedCatalogueSection } from './Catalogue';

import { CatalogueItemOption } from './CatalogueItemOption';
import { LanguageSupport } from './VendorOnlineProfile';
import { Money } from '@survv/commons/core/models/money';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { Tag } from './Tag';
import { UnifiedTag } from './UnifiedTag';
import { Validators } from '@survv/commons/core/base/BasePM';

export class CatalogueItemForm
  extends BaseForm
  implements CatalogueItemFormInputs
{
  displayName = {
    en: '',
    ar: '',
  };

  description = {
    en: '',
    ar: '',
  };

  price = 0;
  prepTime = 0;
  calories = 0;

  catalogueSections: SimplifiedCatalogueSection[] = [];
  tags: UnifiedTag[] = [];
  allergies: Tag[] = [];
  gallery: (Base64EncodedFile | ImageUrlString)[] = [];
  coverPhoto: Base64EncodedFile | ImageUrlString = '';

  private _languageSupport = {
    en: true,
    ar: false,
  };

  protected _initialValues = {
    displayName: {
      en: '',
      ar: '',
    },

    description: {
      en: '',
      ar: '',
    },

    price: 0,
    prepTime: 0,
    calories: 0,

    catalogueSections: [],
    tags: [],
    allergies: [],
    gallery: [],
    coverPhoto: '',
  };

  constructor(options?: CatalogueItemFormOptions) {
    super();
    this._init(options);
    Object.assign(this._languageSupport, options?.languageSupport);
  }

  static fromCatalogueItem(
    item: CatalogueItem,
    languageSupport: LanguageSupport
  ): CatalogueItemForm {
    const {
      displayName,
      description,
      calories,
      prepTime,
      price,
      catalogueSections,
      tags,
      allergies,
      gallery,
      coverPhoto,
    } = item;
    return new CatalogueItemForm({
      formInputs: {
        displayName,
        description,
        calories,
        prepTime,
        price: price.valueOf(),
        catalogueSections,
        tags,
        allergies,
        gallery: coverPhoto ? [coverPhoto, ...gallery] : gallery,
        coverPhoto,
      },
      languageSupport,
    });
  }

  get validators(): Validators {
    return {
      'displayName.en': (): FormValidationResult => {
        if (this._languageSupport.en) {
          return required(this.displayName.en);
        }
        return true;
      },
      'displayName.ar': (): FormValidationResult => {
        if (this._languageSupport.ar) {
          return required(this.displayName.ar);
        }
        return true;
      },
      'catalogueSections': (): FormValidationResult => {
        return required(this.catalogueSections);
      },
    };
  }
}

export class CatalogueItem implements CatalogueItemOptions {
  id = 0;
  displayName = new MultilingualString();
  description = new MultilingualString();
  archived = false;
  calories = 0;
  prepTime = 0;
  price = new Money();
  tags: UnifiedTag[] = [];
  allergies: Tag[] = [];
  options: CatalogueItemOption[] = [];
  catalogueId = 0;
  catalogueSections: SimplifiedCatalogueSection[] = [];
  coverPhoto = '';
  gallery: ImageUrlString[] = [];
  popular = false;

  constructor(options?: CatalogueItemOptions) {
    Object.assign(this, options);
  }
}

export class CatalogueItemsListItem implements CatalogueItemsListItemArgs {
  id = 0;
  displayName = new MultilingualString();
  coverPhoto = '';
  description = new MultilingualString();
  price = new Money();
  constructor(args?: CatalogueItemsListItemArgs) {
    Object.assign(this, args);
  }
}

interface CatalogueItemsListItemArgs {
  id: EntityId;
  displayName: MultilingualString;
  description: MultilingualString;
  coverPhoto: ImageUrlString;
  price: Money;
}

interface CatalogueItemFormInputs {
  displayName: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  calories: number;
  prepTime: number;
  price: number;
  catalogueSections: SimplifiedCatalogueSection[];
  tags: UnifiedTag[];
  allergies: Tag[];
  gallery: (Base64EncodedFile | ImageUrlString)[];
  coverPhoto: Base64EncodedFile | ImageUrlString;
}

interface CatalogueItemFormOptions {
  formInputs?: CatalogueItemFormInputs;

  languageSupport: {
    en: boolean;
    ar: boolean;
  };
}

interface CatalogueItemOptions {
  id: EntityId;
  displayName: MultilingualString;
  description: MultilingualString;
  archived: boolean;
  calories: number;
  prepTime: number;
  price: Money;
  tags: UnifiedTag[];
  allergies: Tag[];
  options: CatalogueItemOption[];
  catalogueId: EntityId;
  catalogueSections: SimplifiedCatalogueSection[];
  coverPhoto: ImageUrlString;
  popular: boolean;
  gallery: ImageUrlString[];
}
