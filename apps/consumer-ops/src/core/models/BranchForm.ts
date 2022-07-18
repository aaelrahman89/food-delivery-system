import { BaseForm } from '@survv/commons/core/models/Forms';
import { Branch } from './Branch';
import { ContactPerson } from './ContactPerson';
import {
  FormValidationResult,
  required,
} from '@survv/commons/core/validations/form-validators';
import { GeojsonCoordinates } from '@survv/api/definitions/common';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { Time } from '@survv/commons/core/models/Time';
import { UnifiedTag } from './UnifiedTag';
import { Validators } from '@survv/commons/core/base/BasePM';

export class BranchForm extends BaseForm implements BranchFormInputs {
  protected _initialValues = {
    label: '',
    displayName: {
      en: '',
      ar: '',
    },
    opensAt: new Time('12:00:00'),
    closesAt: new Time('12:00:00'),
    active: false,
    minimumOrderValue: 0,
    averageBasketSize: 0,
    deliveryFees: 0,
    tags: [] as UnifiedTag[],
    contactPersons: [] as ContactPerson[],
    address: {
      countryId: 0,
      cityId: 0,
      areaId: 0,
      street: '',
      building: '',
      coordinates: [],
    },
    posIntegrated: false,
    posIntegrationType: 'NONE',
  };

  label = '';
  displayName = {
    en: '',
    ar: '',
  };

  opensAt = new Time('12:00:00');
  closesAt = new Time('12:00:00');
  active = false;
  minimumOrderValue = 0;
  averageBasketSize = 0;
  deliveryFees = 0;
  tags = [] as UnifiedTag[];
  address = {
    countryId: 0,
    cityId: 0,
    areaId: 0,
    street: '',
    building: '',
    coordinates: [] as GeojsonCoordinates,
  };

  contactPersons = [] as ContactPerson[];

  posIntegrated = false;
  posIntegrationType = 'NONE';

  constructor(options?: BranchFormOptions) {
    super();
    this._init(options);
  }

  static from(branch: Branch): BranchForm {
    return new BranchForm({
      formInputs: {
        label: branch.label,
        displayName: {
          en: branch.displayName.en,
          ar: branch.displayName.ar,
        },
        opensAt: branch.orderingHours.from,
        closesAt: branch.orderingHours.to,
        active: branch.active,
        minimumOrderValue: branch.minimumOrderValue,
        averageBasketSize: branch.avgBasketSize,
        deliveryFees: branch.deliveryFees.valueOf(),
        tags: [
          ...branch.tags.map((tag) => {
            return {
              id: tag.id,
              name: tag.name,
              vendorType: tag.vendorType,
              type: tag.type,
              status: tag.status,
              creationDate: tag.creationDate,
              icon: tag.icon,
            } as UnifiedTag;
          }),
          ...branch.hashTags.map((hashTag) => {
            return {
              id: hashTag.id,
              name: hashTag.name,
              vendorType: hashTag.vendorType,
              type: hashTag.type,
              status: hashTag.status,
              creationDate: hashTag.creationDate,
              icon: hashTag.icon,
            } as UnifiedTag;
          }),
        ],
        address: {
          countryId: branch.address.countryId,
          cityId: branch.address.cityId,
          areaId: branch.address.areaId,
          street: branch.address.street,
          building: branch.address.building,
          coordinates: branch.address.coordinates as GeojsonCoordinates,
        },
        contactPersons: branch.contactPersons,
        posIntegrated: branch.posIntegrated,
        posIntegrationType: branch.posIntegrationType,
      },
    });
  }

  get validators(): Validators {
    return {
      'label': (): FormValidationResult => {
        return required(this.label);
      },
      'displayName.en': (): FormValidationResult => {
        return required(this.displayName.en);
      },
      'displayName.ar': (): FormValidationResult => {
        return required(this.displayName.ar);
      },
      'opensAt': (): FormValidationResult => {
        return required(this.opensAt.toString());
      },
      'closesAt': (): FormValidationResult => {
        return required(this.closesAt.toString());
      },
      'minimumOrderValue': (): FormValidationResult => {
        return required(this.minimumOrderValue);
      },
      'averageBasketSize': (): FormValidationResult => {
        return required(this.averageBasketSize);
      },
      'deliveryFees': (): FormValidationResult => {
        return required(this.deliveryFees);
      },
      'address.countryId': (): FormValidationResult => {
        return required(this.address.countryId);
      },
      'address.cityId': (): FormValidationResult => {
        return required(this.address.cityId);
      },
      'address.areaId': (): FormValidationResult => {
        return required(this.address.areaId);
      },
      'address.coordinates': (): FormValidationResult => {
        return required(this.address.coordinates);
      },
      'contactPersons': (): FormValidationResult => {
        return required(this.contactPersons);
      },
    };
  }
}

interface BranchFormInputs {
  label: string;
  displayName: MultilingualString;
  opensAt: Time;
  closesAt: Time;
  active: boolean;
  minimumOrderValue: number;
  averageBasketSize: number;
  deliveryFees: number;
  tags: UnifiedTag[];
  address: {
    countryId: number;
    cityId: number;
    areaId: number;
    street: string;
    building: string;
    coordinates: GeojsonCoordinates;
  };
  contactPersons: ContactPerson[];
  posIntegrated: boolean;
  posIntegrationType: string;
}

interface BranchFormOptions {
  formInputs: BranchFormInputs;
}
