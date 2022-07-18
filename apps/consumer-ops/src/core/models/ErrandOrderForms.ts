import { BaseForm } from '@survv/commons/core/models/Forms';
import {
  ErrandOrder,
  ErrandOrderPickup,
  ErrandOrderPickupItem,
  PickupStatus,
} from './ErrandOrder';
import {
  FormValidationResult,
  required,
} from '@survv/commons/core/validations/form-validators';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { Validators } from '@survv/commons/core/base/BasePM';

export class ErrandItemForm extends BaseForm implements ErrandItemFormInput {
  name = '';
  brand = '';
  quantity = '';
  notes = '';

  protected _initialValues = {
    name: '',
    brand: '',
    quantity: '',
    notes: '',
  };

  constructor(options?: ErrandItemFormOptions) {
    super();
    this._init(options);
  }

  static from(item: ErrandOrderPickupItem): ErrandItemForm {
    return new ErrandItemForm({
      formInputs: {
        name: item.name,
        brand: item.brand,
        quantity: item.quantity,
        notes: item.notes,
      },
    });
  }

  get validators(): Validators {
    return {
      name: (): FormValidationResult => {
        return required(this.name);
      },
      quantity: (): FormValidationResult => {
        return required(this.quantity);
      },
    };
  }
}

export class ErrandPickupForm
  extends BaseForm
  implements ErrandPickupFormInput
{
  pickupId = 0;
  category = new MultilingualString();
  categoryId = 0;
  locationName = '';
  coordinates: number[] = [];
  items: ErrandItemForm[] = [];
  includePictures = false;
  includeVoiceNote = false;
  canEdit = true;

  canIncludePictures = false;
  canIncludeVoiceNote = false;

  protected _initialValues = {
    pickupId: 0,
    category: new MultilingualString(),
    categoryId: 0,
    locationName: '',
    coordinates: [] as number[],
    items: [] as ErrandItemForm[],
    includePictures: false,
    includeVoiceNote: false,
    canEdit: true,
    canIncludePictures: false,
    canIncludeVoiceNote: false,
  };

  constructor(options?: ErrandPickupFormOptions) {
    super();
    this._init(options);
  }

  static from(pickup: ErrandOrderPickup): ErrandPickupForm {
    return new ErrandPickupForm({
      formInputs: {
        category: pickup.categoryDisplayName,
        pickupId: pickup.pickupId,
        categoryId: pickup.categoryId,
        locationName: pickup.location.locationDescription,
        coordinates:
          pickup.location.pickupLocation.features[0]?.geometry.coordinates,
        items: pickup.items.map((item) => {
          return ErrandItemForm.from(item);
        }),
        includePictures: pickup.includePictures,
        includeVoiceNote: pickup.includeVoiceNote,
        canEdit: !PickupStatus.COLLECTED.equals(pickup.pickupStatus),
        canIncludePictures: pickup.uploadedImages.length > 0,
        canIncludeVoiceNote: pickup.voiceNote.length > 0,
      },
    });
  }

  get validators(): Validators {
    return {
      categoryId: (): FormValidationResult => {
        return required(this.categoryId);
      },
      locationName: (): FormValidationResult => {
        return required(this.locationName);
      },
      coordinates: (): FormValidationResult => {
        return required(this.coordinates);
      },
      items: (): FormValidationResult => {
        return required(this.items);
      },
      valid: (): boolean => {
        return this.items.every((item) => item.isValid());
      },
    };
  }
}

export class ErrandStructureForm
  extends BaseForm
  implements ErrandStructureFormInput
{
  zoneName = '';
  pickups: ErrandPickupForm[] = [];

  protected _initialValues = {
    pickups: [],
  };

  constructor(options?: ErrandStructureFormOptions) {
    super();
    this._init(options);
  }

  static from(order: ErrandOrder, zoneName: string): ErrandStructureForm {
    const pickups = order.orderPickups
      .filter((pickup) => {
        return !pickup.deleted;
      })
      .map((pickup) => {
        return ErrandPickupForm.from(pickup);
      });
    return new ErrandStructureForm({
      formInputs: {
        pickups,
        zoneName,
      },
    });
  }

  get validators(): Validators {
    return {
      pickups: (): FormValidationResult => {
        return required(this.pickups);
      },
      valid: (): boolean => {
        return this.pickups.every((pickup) => pickup.isValid());
      },
    };
  }
}

export class RejectionReasonForm
  extends BaseForm
  implements RejectionReasonFormInputs
{
  reasonId = 0;
  protected _initialValues = {
    reasonId: 0,
  };

  constructor(options?: RejectionReasonFormOptions) {
    super();
    this._init(options);
  }

  get validators(): Validators {
    return {
      reasonId: (): FormValidationResult => {
        return required(this.reasonId);
      },
    };
  }
}

export class CancellationReasonsForm
  extends BaseForm
  implements CancellationReasonsFormInputs
{
  cancellationReasonId = 0;
  requestRefund = false;

  protected _initialValues = {
    cancellationReasonId: 0,
    requestRefund: false,
  };

  constructor(options?: CancellationReasonsFormOptions) {
    super();
    this._init(options);
  }

  get validators(): Validators {
    return {
      cancellationReasonId: (): FormValidationResult => {
        return required(this.cancellationReasonId);
      },
    };
  }
}

interface RejectionReasonFormInputs {
  reasonId: number;
}

interface RejectionReasonFormOptions {
  formInputs: RejectionReasonFormInputs;
}

interface ErrandStructureFormOptions {
  formInputs: ErrandStructureFormInput;
}

interface ErrandStructureFormInput {
  zoneName: string;
  pickups: ErrandPickupForm[];
}

interface ErrandItemFormOptions {
  formInputs: ErrandItemFormInput;
}

interface ErrandItemFormInput {
  name: string;
  brand: string;
  quantity: string;
  notes: string;
}

interface ErrandPickupFormOptions {
  formInputs: ErrandPickupFormInput;
}

interface ErrandPickupFormInput {
  pickupId: number;
  categoryId: number;
  category: MultilingualString;
  locationName: string;
  coordinates: number[];
  items: ErrandItemForm[];
  includePictures: boolean;
  includeVoiceNote: boolean;
  canEdit: boolean;
  canIncludePictures: boolean;
  canIncludeVoiceNote: boolean;
}

interface CancellationReasonsFormInputs {
  cancellationReasonId: number;
  requestRefund: boolean;
}

interface CancellationReasonsFormOptions {
  formInputs: CancellationReasonsFormInputs;
}
