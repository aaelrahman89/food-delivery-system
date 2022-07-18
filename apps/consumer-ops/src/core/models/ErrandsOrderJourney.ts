import { Datetime } from '@survv/commons/core/utils/datetime';
import { EntityId } from '@survv/commons/core/types';
import { EnumClass } from '@survv/commons/core/models/EnumClass';

export class ErrandsOrderJourneyStepStatus extends EnumClass {
  protected readonly _prefix: string;
  static REQUESTED = new ErrandsOrderJourneyStepStatus('REQUESTED');
  static CONFIRMED = new ErrandsOrderJourneyStepStatus('CONFIRMED');
  static REJECTED = new ErrandsOrderJourneyStepStatus('REJECTED');
  static CANCELLED = new ErrandsOrderJourneyStepStatus('CANCELLED');
  static PILOT_REQUESTED = new ErrandsOrderJourneyStepStatus('PILOT_REQUESTED');
  static PILOT_ASSIGNED = new ErrandsOrderJourneyStepStatus('PILOT_ASSIGNED');
  static PICKUP = new ErrandsOrderJourneyStepStatus('PICKUP');
  static COLLECTED = new ErrandsOrderJourneyStepStatus('COLLECTED');
  static DELIVERED = new ErrandsOrderJourneyStepStatus('DELIVERED');

  constructor(value: string) {
    super(value);
    this._prefix = 'ORDER_STATUS';
  }
}
export class ErrandsOrderJourney {
  orderId = 0;
  orderJourney = [] as ErrandsOrderJourneyStep[];
  constructor(options?: ErrandsOrderJourneyOptions) {
    Object.assign(this, options);
  }

  build(): StructuredErrandsOrderStep[] {
    return this.orderJourney.map((step) => this._constructStep(step));
  }

  _constructStep(step: ErrandsOrderJourneyStep): StructuredErrandsOrderStep {
    const baseData = {
      stepTitle: step.stepStatus.value,
      stepTimeStamp: step.stepTimeStamp.toDatetimeString(),
      clickable: false,
    };

    switch (step.stepStatus.valueOf()) {
      case ErrandsOrderJourneyStepStatus.REQUESTED.valueOf(): {
        return {
          ...baseData,
          extraData: [
            {
              name: 'PLATFORM',
              value: step.data.platform,
            },
          ],
        };
      }
      case ErrandsOrderJourneyStepStatus.CONFIRMED.valueOf(): {
        return {
          ...baseData,
          extraData: [
            {
              name: 'ACCEPTED_BY',
              value: step.actionBy.email,
            },
          ],
        };
      }
      case ErrandsOrderJourneyStepStatus.REJECTED.valueOf(): {
        return {
          ...baseData,
          extraData: [
            {
              name: 'REJECTED_BY',
              value: step.actionBy.email,
            },
            {
              name: 'REJECTION_REASON',
              value: step.data.rejectionReason,
            },
          ],
        };
      }
      case ErrandsOrderJourneyStepStatus.PILOT_REQUESTED.valueOf(): {
        return {
          ...baseData,
          clickable: false,
          extraData: [
            {
              name: 'TRIP_ID',
              value: step.linkedEntity.entityId?.toString(),
            },
          ],
        };
      }
      case ErrandsOrderJourneyStepStatus.PILOT_ASSIGNED.valueOf(): {
        return {
          ...baseData,
          clickable: true,
          extraData: [],
        };
      }
      case ErrandsOrderJourneyStepStatus.PICKUP.valueOf(): {
        const extraStepData = [];

        if (step.data.COLLECTING) {
          extraStepData.push({
            name: 'COLLECTING',
            value: new Datetime(step.data.COLLECTING).toDatetimeString(),
          });
        }
        if (step.data.COLLECTED) {
          extraStepData.push({
            name: 'COLLECTED',
            value: new Datetime(step.data.COLLECTED).toDatetimeString(),
          });
        }
        return {
          ...baseData,
          pointLabel: step.data?.name,
          pickupsCount: parseInt(step.data.pickupsCount, 10),
          pickupIndex: this._pickupIndex(step.linkedEntity.entityId),
          extraData: extraStepData,
        };
      }
      case ErrandsOrderJourneyStepStatus.CANCELLED.valueOf(): {
        return {
          ...baseData,
          extraData: [
            { name: 'CANCELLED_BY', value: step.actionBy.email },
            {
              name: 'CANCELLATION_REASON',
              value: step.data.cancellationReason,
            },
            {
              name: 'CANCELLATION_REASON_CATEGORY',
              value: step.data.cancellationReasonCategory,
            },
            { name: 'REFUNDED', value: step.data.refunded },
          ],
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

  _pickupIndex(stepId: number | unknown): number {
    const pickups = this.orderJourney.filter(
      (journeyStep) =>
        journeyStep.stepStatus.value ===
        ErrandsOrderJourneyStepStatus.PICKUP.value
    );
    for (let i = 0; i < pickups.length; i += 1) {
      if (pickups[i].linkedEntity.entityId === stepId) {
        return i + 1;
      }
    }
    return 0;
  }
}

export interface ErrandsOrderJourneyStep {
  stepStatus: ErrandsOrderJourneyStepStatus;
  stepTimeStamp: Datetime;
  actionBy: ActionBy;
  linkedEntity: LinkedEntity;
  data: Record<string, string>;
}
export interface StructuredErrandsOrderStep {
  stepTitle: string;
  stepTimeStamp: string;
  extraData: stepData[];
  clickable: boolean;
  [key: string]: unknown;
}
interface ErrandsOrderJourneyOptions {
  orderId: EntityId;
  orderJourney: ErrandsOrderJourneyStep[];
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
