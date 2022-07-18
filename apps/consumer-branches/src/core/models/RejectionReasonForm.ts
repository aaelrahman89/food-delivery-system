import { BaseForm } from '@survv/commons/core/models/Forms';
import { BranchB2CStatus } from '@survv/commons/core/models/BranchB2CStatus';
import { EntityId } from '@survv/commons/core/types';
import {
  FormValidationResult,
  required,
} from '@survv/commons/core/validations/form-validators';
import { Validators } from '@survv/commons/core/base/BasePM';

export class RejectionReasonForm
  extends BaseForm
  implements RejectionReasonFormInputs
{
  reasonId = 0;
  b2cBranchStatus = new BranchB2CStatus('');
  unavailableItems: EntityId[] = [];
  unavailableSelections: EntityId[] = [];
  notes = '';
  protected _initialValues = {
    reasonId: 0,
    b2cBranchStatus: new BranchB2CStatus(''),
    unavailableItems: [],
    unavailableSelections: [],
    notes: '',
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

interface RejectionReasonFormInputs {
  reasonId: number;
  b2cBranchStatus: BranchB2CStatus;
  unavailableItems: EntityId[];
  unavailableSelections: EntityId[];
  notes: string;
}

interface RejectionReasonFormOptions {
  formInputs: RejectionReasonFormInputs;
}
