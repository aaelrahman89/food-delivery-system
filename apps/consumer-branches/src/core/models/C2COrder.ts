import { BaseForm } from '@survv/commons/core/models/Forms';
import { CustomerOrderId } from '@survv/commons/core/models/CustomerOrderId';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { EntityId } from '@survv/commons/core/types';
import {
  FormValidationResult,
  required,
  validationMessages,
} from '@survv/commons/core/validations/form-validators';
import { ImageUrlString } from '@survv/commons/core/models/Images';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { OrderType } from '@survv/commons/core/models/OrderType';
import { Validators } from '@survv/commons/core/base/BasePM';

export class C2COrderItem implements C2COrderItemOptions {
  itemId = 0;
  orderItemId = 0;
  title = {
    en: '',
    ar: '',
  };

  voiceNoteUrl = '';
  icon = '';
  gallery: ImageUrlString[] = [];

  notes = '';

  constructor(options?: C2COrderItemOptions) {
    Object.assign(this, options);
  }
}

export class C2CStructuredOrder implements C2CStructuredOrderOptions {
  id = 0;
  items = [
    {
      orderItemId: 0,
      itemId: 0,
      title: new MultilingualString(),
      icon: '',
      selections: [
        {
          title: new MultilingualString(),
          quantity: 0,
        },
      ],
    },
  ];

  constructor(options?: C2CStructuredOrderOptions) {
    Object.assign(this, options);
  }
}

export class C2COrder implements C2COrderOptions {
  id = 0;
  customerName = '';
  customerPhoneNumber = '';
  customerOrderId = new CustomerOrderId('');
  creationTime = new Datetime('2018-09-05T19:04:53.178Z');
  paymentMethod = '';
  items = [new C2COrderItem()];
  type = OrderType.B2C;

  constructor(options?: C2COrderOptions) {
    Object.assign(this, options);
  }
}

export class C2CStructuredOrderItemForm
  extends BaseForm
  implements C2CStructuredOrderItemFormInputs
{
  name = '';
  brand = '';
  quantity = 0;

  protected _initialValues = {
    name: '',
    brand: '',
    quantity: 0,
  };

  constructor(options?: C2CStructuredOrderItemFormOptions) {
    super();
    this._init(options);
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

export class C2CStructuredOrderForm
  extends BaseForm
  implements C2CStructuredOrderFormInputs
{
  items: C2CStructuredOrderItem[] = [
    {
      orderItemId: 0,
      itemId: 0,
      title: new MultilingualString(),
      selections: [
        {
          title: new MultilingualString(),
          quantity: 0,
        },
      ],
    },
  ];

  protected _initialValues = {
    items: [],
  };

  constructor(options?: C2CStructuredOrderFormOptions) {
    super();
    this._init(options);
  }

  get validators(): Validators {
    return {
      items: (): FormValidationResult => {
        const valid = this.items.some((item) => item.selections.length > 0);
        if (!valid) {
          return validationMessages.FORM_REQUIRED_AT_LEAST_ONE;
        }
        return valid;
      },
    };
  }
}

interface C2COrderOptions {
  id: EntityId;
  customerName: string;
  customerPhoneNumber: string;
  customerOrderId: CustomerOrderId;
  items: C2COrderItem[];
  paymentMethod: string;
  type: OrderType;
  creationTime: Datetime;
}

interface C2COrderItemSelection {
  title: MultilingualString;
  quantity: number;
}

interface C2COrderItemOptions {
  itemId: EntityId;
  orderItemId: EntityId;
  title: MultilingualString;
  voiceNoteUrl: string;
  icon: ImageUrlString;
  gallery: ImageUrlString[];
  notes: string;
}

interface C2CStructuredOrderOptions {
  id: EntityId;
  items: {
    orderItemId: EntityId;
    itemId: EntityId;
    title: MultilingualString;
    icon: ImageUrlString;
    selections: C2COrderItemSelection[];
  }[];
}

interface C2CStructuredOrderItem {
  orderItemId: EntityId;
  itemId: EntityId;
  title: MultilingualString;
  selections: C2COrderItemSelection[];
}

interface C2CStructuredOrderItemFormInputs {
  name: string;
  brand: string;
  quantity: number;
}

interface C2CStructuredOrderItemFormOptions {
  formInputs?: C2CStructuredOrderItemFormInputs;
}

interface C2CStructuredOrderFormInputs {
  items: C2CStructuredOrderItem[];
}

interface C2CStructuredOrderFormOptions {
  formInputs?: C2CStructuredOrderFormInputs;
}
