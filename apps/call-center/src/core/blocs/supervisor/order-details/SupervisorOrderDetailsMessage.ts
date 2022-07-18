import { BaseMessage } from '@survv/commons/core/base/BaseMessage';
import { EntityId } from '@survv/commons/core/types';
import {
  FormValidationResult,
  FormValidator,
  required,
} from '@survv/commons/core/validations/form-validators';
import { RejectionReason } from '../../../models/RejectionReason';
import { Validators } from '../../../models/Validators';

export class SupervisorOrderDetailsAction {
  type: SupervisorOrderDetailsActionType = 'NONE';
  payload?: SupervisorOrderDetailsActionPayload = {};

  constructor({
    type,
    payload,
  }: {
    type: SupervisorOrderDetailsActionType;
    payload?: SupervisorOrderDetailsActionPayload;
  }) {
    this.type = type;
    this.payload = payload;
  }
}

export class SupervisorOrderDetailsMessage extends BaseMessage {
  orderStatus: SupervisorOrderDetailsStatus = 'IDLE';
  journeyStatus: SupervisorOrderDetailsStatus = 'IDLE';
  acceptButtonStatus: SupervisorOrderDetailsButtonStatus = 'DISABLED';
  rejectButtonStatus: SupervisorOrderDetailsButtonStatus = 'DISABLED';
  acceptFormStatus: SupervisorOrderDetailsFormStatus = 'CLOSED';
  rejectFormStatus: SupervisorOrderDetailsFormStatus = 'CLOSED';
  unavailableItemsFormStatus: SupervisorOrderDetailsFormStatus = 'CLOSED';
  branchBusyFormStatus: SupervisorOrderDetailsFormStatus = 'CLOSED';
  state: SupervisorOrderDetailsState = {
    order: {
      id: 0,
      branchId: 0,
      branchLabel: '',
      branchArea: '',
      customerOrderId: '',
      customerName: '',
      customerMobileNo: '',
      customerAddress: '',
      scheduled: false,
      scheduledTo: '',
      von: '',
      status: '',
      items: [],
      assignedAgent: {
        id: 0,
        email: '',
      },
      paymentMethod: '',
      subtotal: '',
      tax: '',
      deliveryFee: '',
      total: '',
      creationDate: '',
      lastUpdateDate: '',
      deliverBy: '',
      actionDisplay: true,
    },
    journey: [],
    acceptOrderForm: {
      vendorOrderId: '',
    },
    rejectOrderForm: {
      reasonId: 0,
      b2cBranchStatus: '',
      unavailableItems: [],
      unavailableSelections: [],
      notes: '',
    },
    rejectionReasons: [],
    clonedRejectionReasons: [],
    rejectOrderSearchToken: '',
    b2cBranchStatusList: [],
  };

  action: SupervisorOrderDetailsAction = { type: 'NONE' };
  acceptOrderFormValidators(): SupervisorOrderDetailsFormValidators {
    return {
      vendorOrderId: (): FormValidationResult => {
        return required(this.state.acceptOrderForm.vendorOrderId);
      },
    };
  }

  rejectOrderFormValidators(): RejectOrderFormValidators {
    return {
      reasonId: (): FormValidationResult => {
        return required(this.state.rejectOrderForm.reasonId);
      },
    };
  }
}

interface SupervisorOrderDetailsActionPayload {
  acceptOrderForm?: {
    vendorOrderId: string;
  };
  rejectOrderForm?: {
    reasonId?: number;
    b2cBranchStatus?: string;
    unavailableItems?: EntityId[];
    unavailableSelections?: EntityId[];
    notes?: string;
  };
  searchToken?: string;
}

interface SupervisorOrderDetailsState {
  order: {
    id: number;
    branchId: number;
    branchLabel: string;
    branchArea: string;
    customerOrderId: string;
    customerName: string;
    customerMobileNo: string;
    customerAddress: string;
    scheduled: boolean;
    scheduledTo: string;
    von: string;
    status: string;
    items: {
      itemId: number;
      title: string;
      quantity: string;
      price: string;
      options: {
        optionId: number;
        title: string;
        selections: {
          selectionId: number;
          title: string;
          quantity: string;
          price: string;
          isAvailable: boolean;
        }[];
      }[];
      isAvailable: boolean;
    }[];
    actionDisplay: boolean;
    assignedAgent: {
      id: number;
      email: string;
    };
    paymentMethod: string;
    subtotal: string;
    tax: string;
    deliveryFee: string;
    total: string;
    creationDate: string;
    lastUpdateDate: string;
    deliverBy: string;
  };
  journey: {
    stepTitle: string;
    stepTimeStamp: string;
    stepDuration: string;
    extraData: {
      name: string;
      value?: string;
      route?: { name: string; params: { [key: string]: unknown } };
    }[];
    clickable: boolean;
    [key: string]: unknown;
  }[];
  acceptOrderForm: {
    vendorOrderId: string;
  };
  rejectOrderForm: RejectOrderFormArgs;
  rejectionReasons: RejectionReason[];
  clonedRejectionReasons: RejectionReason[];
  rejectOrderSearchToken: string;
  b2cBranchStatusList: { label: string; value: string }[];
}

interface SupervisorOrderDetailsFormValidators extends Validators {
  vendorOrderId: FormValidator;
}
interface RejectOrderFormValidators extends Validators {
  reasonId: FormValidator;
}
export interface RejectOrderFormArgs {
  reasonId: number;
  b2cBranchStatus?: string;
  unavailableItems?: EntityId[];
  unavailableSelections?: EntityId[];
  notes?: string;
}

type SupervisorOrderDetailsStatus = string & ('IDLE' | 'LOADING' | 'ERROR');

type SupervisorOrderDetailsButtonStatus = string & ('DISABLED' | 'ENABLED');

type SupervisorOrderDetailsFormStatus = string & ('OPENED' | 'CLOSED');

type SupervisorOrderDetailsActionType = string &
  (
    | 'INITIALIZE'
    | 'VALIDATE_ACCEPT_FORM'
    | 'VALIDATE_REJECT_FORM'
    | 'OPEN_ACCEPT_FORM'
    | 'CLOSE_ACCEPT_FORM'
    | 'OPEN_REJECT_FORM'
    | 'CLOSE_REJECT_FORM'
    | 'OPEN_BRANCH_BUSY_FORM'
    | 'CLOSE_BRANCH_BUSY_FORM'
    | 'OPEN_UNAVAILABLE_ITEMS_FORM'
    | 'CLOSE_UNAVAILABLE_ITEMS_FORM'
    | 'ACCEPT_ORDER'
    | 'ASSIGN_ORDER'
    | 'REJECT_ORDER'
    | 'SEARCH_REJECTION_REASONS'
    | 'UPDATE_UNAVAILABLE_ITEMS'
    | 'UPDATE_UNAVAILABLE_SELECTIONS'
    | 'UPDATE_NOTES'
    | 'NONE'
  );
