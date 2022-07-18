import Clock from '../etc/Clock';
import Duration from '../etc/Duration';
import OrderStatus from './OrderStatus';

class OrderJourney {
  constructor({ journeyInfo }) {
    this._baseTimeline = [
      this._constructStep({
        status: 'REQUESTED',
        date: journeyInfo.creationDate,
        duration: journeyInfo.tillAcceptanceDuration,
      }),
      this._constructStep({
        status: 'CONFIRMED',
        date: journeyInfo.acceptanceDate,
        duration: journeyInfo.tillRequestingPilotDuration,
      }),
      this._constructStep({
        status: 'PILOT_REQUESTED',
        date: journeyInfo.pilotRequestDate,
        duration: journeyInfo.tillCollectionDuration,
      }),
      this._constructStep({
        status: 'COLLECTED',
        date: journeyInfo.collectionDate,
        duration: journeyInfo.tillDeliveryDuration,
      }),
      this._constructStep({
        status: 'DELIVERED',
        date: journeyInfo.deliveryDate,
      }),
    ];
    this._journeyInfo = journeyInfo;
  }

  build() {
    if (this._journeyInfo.status === 'REJECTED') {
      return this._injectTerminationStep(this._journeyInfo.rejectionDate);
    }

    if (this._journeyInfo.status === 'CANCELLED') {
      return this._injectTerminationStep(this._journeyInfo.cancellationDate);
    }

    return this._baseTimeline;
  }

  _injectTerminationStep(date) {
    const unFulfilledSteps = this._baseTimeline.filter(
      (step) => !step.occurred
    );
    const occurredSteps = this._baseTimeline.filter((step) => step.occurred);

    const lastOccurredStep = occurredSteps.pop();

    lastOccurredStep.duration = new Duration({
      value: Clock.subtract(date, lastOccurredStep.date),
      timeUnit: Duration.timeUnits.MILLISECONDS,
    });

    return [
      ...occurredSteps,
      lastOccurredStep,
      this._constructStep({
        date,
        status: this._journeyInfo.status,
      }),
      ...unFulfilledSteps,
    ];
  }

  _constructStep({ status, date, duration }) {
    return {
      date,
      status: new OrderStatus({ value: status }),
      formattedDate: Clock.format(date),
      duration: duration ? new Duration({ value: duration }) : undefined,
      occurred: Clock.notEmpty(date),
    };
  }
}

export default OrderJourney;
