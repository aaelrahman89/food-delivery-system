class PilotStatus {
  constructor({ value = 'NONE' } = {}) {
    this.value = value;
    this.busyState = true;
    this.color = '#000000';
    this.dark = true;
    this.hasLookupValue = false;

    const lookupValue = PilotStatus.lookup[value];

    if (lookupValue) {
      Object.assign(this, lookupValue);
      this.hasLookupValue = true;
    }
  }

  get string() {
    if (this.hasLookupValue) {
      return `lookups.pilot_status.${this.value}`;
    }
    return this.value;
  }

  static get lookup() {
    return {
      UNAVAILABLE: {
        value: 'UNAVAILABLE',
        busyState: false,
      },
      AVAILABLE: {
        value: 'AVAILABLE',
        busyState: false,
      },
      LOADED: {
        value: 'LOADED',
        busyState: true,
        color: '#AD1457',
        dark: true,
      },
      IN_HUB: {
        value: 'IN_HUB',
        busyState: false,
      },
      ASSIGNED: {
        value: 'ASSIGNED',
        busyState: true,
        color: '#F9A825',
        dark: true,
      },
      CANDIDATE: {
        value: 'CANDIDATE',
        busyState: true,
      },
      WAITING: {
        value: 'WAITING',
        busyState: true,
        color: '#EF6C00',
        dark: true,
      },
      COLLECTING: {
        value: 'COLLECTING',
        busyState: true,
        color: '#ad6b8a',
        dark: true,
      },
      NONE: {
        value: 'NONE',
        busyState: false,
      },
    };
  }
}

export default PilotStatus;
