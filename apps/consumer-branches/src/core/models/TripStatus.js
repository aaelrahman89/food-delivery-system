class TripStatus {
  constructor({ value = 'NONE' } = {}) {
    this.value = value;
    this.isCancellable = false;
    this.canEditTasksPerTrip = false;
    this.endState = false;
    this.hasLookupValue = false;

    const lookupValue = TripStatus.lookup[value];
    if (lookupValue) {
      Object.assign(this, lookupValue);
      this.hasLookupValue = true;
    }
  }

  get string() {
    if (this.hasLookupValue) {
      return `lookups.trip_status.${this.value}`;
    }
    return this.value;
  }

  static get lookup() {
    return {
      REQUESTED: {
        value: 'REQUESTED',
        isCancellable: true,
        canEditTasksPerTrip: true,
      },
      PENDING: {
        value: 'PENDING',
        isCancellable: true,
        canEditTasksPerTrip: true,
      },
      REJECTED: {
        value: 'REJECTED',
        isCancellable: true,
        canEditTasksPerTrip: true,
      },
      ASSIGNED: {
        value: 'ASSIGNED',
        isCancellable: true,
        canEditTasksPerTrip: true,
      },
      OPENED: {
        value: 'OPENED',
      },
      NOT_FULFILLED: {
        value: 'NOT_FULFILLED',
      },
      CANCELLED: {
        value: 'CANCELLED',
        endState: true,
      },
      CLOSED: {
        value: 'CLOSED',
        endState: true,
      },
    };
  }

  static get lookupArray() {
    const lookupKeys = Object.keys(TripStatus.lookup);
    return lookupKeys.map((key) => new TripStatus({ value: key }));
  }
}

export default TripStatus;
