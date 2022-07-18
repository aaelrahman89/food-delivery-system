import { BaseForm } from '@survv/commons/core/models/Forms';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { EntityId } from '@survv/commons/core/types';
import { EnumClass } from '@survv/commons/core/models/EnumClass';
import {
  FormValidationResult,
  FormValidator,
  required,
} from '@survv/commons/core/validations/form-validators';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { ListingQuery } from '@survv/commons/core/models/Query';
import { Money } from '@survv/commons/core/models/money';
import { Validators } from '@survv/commons/core/base/BasePM';

export class DebitCreditNoteType extends EnumClass {
  _prefix: string;
  static DEBIT = new DebitCreditNoteType('DEBIT_BALANCE');
  static CREDIT = new DebitCreditNoteType('CREDIT_BALANCE');

  constructor(value: string) {
    super(value);
    this._prefix = 'DEBIT_CREDIT_NOTE_TYPE';
  }
}

export class DebitCreditNoteListItem implements DebitCreditNoteListItemOptions {
  id: EntityId = 0;
  serialNumber = 0;
  description = '';
  amount = new Money();
  creationDate = new Datetime();
  type = DebitCreditNoteType.CREDIT;
  pdfGenerated = false;
  createdBy = {
    id: 0 as EntityId,
    email: '',
  };

  constructor(options?: DebitCreditNoteListItemOptions) {
    Object.assign(this, options);
  }
}

export class DebitNoteForm
  extends BaseForm
  implements DebitCreditNoteFormInputs
{
  protected _initialValues = {
    description: '',
    amount: 0,
  };

  description = '';
  amount = 0;

  constructor(options?: DebitCreditNoteFormOptions) {
    super();
    this._init(options);
  }

  get validators(): DebitCreditNoteFormValidators {
    return {
      description: (): FormValidationResult => {
        return required(this.description);
      },
      amount: (): FormValidationResult => {
        return required(this.amount);
      },
    };
  }
}

export class CreditNoteForm
  extends BaseForm
  implements DebitCreditNoteFormInputs
{
  protected _initialValues = {
    description: '',
    amount: 0,
  };

  description = '';
  amount = 0;

  constructor(options?: DebitCreditNoteFormOptions) {
    super();
    this._init(options);
  }

  get validators(): DebitCreditNoteFormValidators {
    return {
      description: (): FormValidationResult => {
        return required(this.description);
      },
      amount: (): FormValidationResult => {
        return required(this.amount);
      },
    };
  }
}

export type DebitCreditNoteList = ItemsList<DebitCreditNoteListItem>;

export interface DebitCreditNotesQuery extends ListingQuery {
  filter?: {
    from?: string;
    to?: string;
    createdBy?: string;
    serialNumber?: string;
  };
}

interface DebitCreditNoteListItemOptions {
  id: EntityId;
  serialNumber: number;
  description: string;
  amount: Money;
  creationDate: Datetime;
  type: DebitCreditNoteType;
  createdBy: {
    id: number;
    email: string;
  };
  pdfGenerated: boolean;
}

interface DebitCreditNoteFormInputs {
  description: string;
  amount: number;
}

interface DebitCreditNoteFormOptions {
  formInputs: DebitCreditNoteFormInputs;
}

interface DebitCreditNoteFormValidators extends Validators {
  description: FormValidator;
  amount: FormValidator;
}
