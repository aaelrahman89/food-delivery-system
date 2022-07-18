import { BaseMessage } from '@survv/commons/core/base/BaseMessage';
import { EntityId } from '@survv/commons/core/types';
import {
  FormValidationResult,
  FormValidator,
  required,
} from '@survv/commons/core/validations/form-validators';
import { RejectionReason } from '../../models/RejectionReason';
import { Validators } from '../../models/Validators';

export class AgentOrderDetailsAction {
  type: AgentOrderDetailsActionType = 'NONE';
  payload?: AgentOrderDetailsActionPayload = {};

  constructor({
    type,
    payload,
  }: {
    type: AgentOrderDetailsActionType;
    payload?: AgentOrderDetailsActionPayload;
  }) {
    this.type = type;
    this.payload = payload;
  }
}

export class AgentOrderDetailsMessage extends BaseMessage {
  orderStatus: AgentOrderDetailsStatus = 'IDLE';
  journeyStatus: AgentOrderDetailsStatus = 'IDLE';
  acceptButtonStatus: AgentOrderDetailsButtonStatus = 'DISABLED';
  rejectButtonStatus: AgentOrderDetailsButtonStatus = 'DISABLED';
  acceptFormStatus: AgentOrderDetailsFormStatus = 'CLOSED';
  rejectFormStatus: AgentOrderDetailsFormStatus = 'CLOSED';
  unavailableItemsFormStatus: AgentOrderDetailsFormStatus = 'CLOSED';
  branchBusyFormStatus: AgentOrderDetailsFormStatus = 'CLOSED';
  assignedStatus: AgentOrderDetailsAssignedStatus = 'ASSIGNED_TO_ME';
  state: AgentOrderDetailsState = {
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

  action: AgentOrderDetailsAction = { type: 'NONE' };
  acceptOrderFormValidators(): AgentOrderDetailsFormValidators {
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

interface AgentOrderDetailsActionPayload {
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

interface AgentOrderDetailsState {
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

interface AgentOrderDetailsFormValidators extends Validators {
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

type AgentOrderDetailsStatus = string & ('IDLE' | 'LOADING' | 'ERROR');

type AgentOrderDetailsButtonStatus = string & ('DISABLED' | 'ENABLED');

type AgentOrderDetailsFormStatus = string & ('OPENED' | 'CLOSED');

type AgentOrderDetailsAssignedStatus = string &
  ('ASSIGNED_TO_ME' | 'NOT_ASSIGNED_TO_ME');

type AgentOrderDetailsActionType = string &
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
