import { Datetime } from '@survv/commons/core/utils/datetime';
import { Duration } from '@survv/commons/core/models/Duration';
import { EntityId } from '@survv/commons/core/types';
import { EnumClass } from '@survv/commons/core/models/EnumClass';

export class OrderJourneyStepStatus extends EnumClass {
  protected readonly _prefix: string;
  static REQUESTED = new OrderJourneyStepStatus('REQUESTED');
  static CONFIRMED = new OrderJourneyStepStatus('CONFIRMED');
  static SCHEDULED = new OrderJourneyStepStatus('SCHEDULED');
  static REJECTED = new OrderJourneyStepStatus('REJECTED');
  static CANCELLED = new OrderJourneyStepStatus('CANCELLED');
  static PILOT_REQUESTED = new OrderJourneyStepStatus('PILOT_REQUESTED');
  static PILOT_ASSIGNED = new OrderJourneyStepStatus('PILOT_ASSIGNED');
  static PICKUP = new OrderJourneyStepStatus('PICKUP');
  static COLLECTED = new OrderJourneyStepStatus('COLLECTED');
  static DELIVERED = new OrderJourneyStepStatus('DELIVERED');

  constructor(value: string) {
    super(value);
    this._prefix = 'ORDER_STATUS';
  }
}

export class OrderJourney {
  orderId = 0;
  orderJourney = [] as OrderJourneyStep[];
  constructor(options?: OrderJourneyOptions) {
    Object.assign(this, options);
  }

  build(): StructuredOrderStep[] {
    return this.orderJourney.map((step) => this._constructStep(step));
  }

  _constructStep(step: OrderJourneyStep): StructuredOrderStep {
    const baseData = {
      stepTitle: step.stepStatus.value,
      stepTimeStamp: step.stepTimeStamp.toDatetimeString(),
      stepDuration: new Duration({
        value: step.stepDuration,
        timeUnit: 'SECONDS',
      })
        .humanize()
        .toString(),
      clickable: false,
    };

    switch (step.stepStatus.valueOf()) {
      case OrderJourneyStepStatus.REJECTED.valueOf(): {
        const extraStepData = [];
        extraStepData.push(
          {
            name: 'REJECTED_BY',
            value: step.actionBy.email,
          },
          {
            name: 'REJECTION_REASON',
            value: step.data.rejectionReason,
          }
        );
        if (step.data.notes) {
          extraStepData.push({
            name: 'REJECTION_NOTES',
            value: step.data?.notes,
          });
        }
        if (step.data.busyFor) {
          extraStepData.push({
            name: 'REJECTION_BUSY_FOR',
            value: step.data?.busyFor,
          });
        }

        return {
          ...baseData,
          extraData: extraStepData,
        };
      }

      default: {
        return {
          ...baseData,
          clickable: false,
          extraData: [],
        };
      }
    }
  }
}

export interface OrderJourneyStep {
  stepStatus: OrderJourneyStepStatus;
  stepTimeStamp: Datetime;
  stepDuration: number;
  actionBy: ActionBy;
  linkedEntity: LinkedEntity;
  data: Record<string, string>;
}
export interface StructuredOrderStep {
  stepTitle: string;
  stepTimeStamp: string;
  stepDuration: string;
  extraData: stepData[];
  clickable: boolean;
  [key: string]: unknown;
}
interface OrderJourneyOptions {
  orderId: EntityId;
  orderJourney: OrderJourneyStep[];
}
interface ActionBy {
  id?: number;
  email?: string;
}
interface LinkedEntity {
  entityId?: number;
  entityName?: string;
}
interface stepData {
  name: string;
  value?: string;
  route?: { name: string; params: { [key: string]: unknown } };
}
