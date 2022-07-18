class OrderStatus {
  constructor({ value = 'NONE' }) {
    this.color = '#ffffff';
    this.dark = false;
    this.value = value;
    this.hasLookupValue = false;

    const lookupValue = OrderStatus.lookup[value];

    if (lookupValue) {
      Object.assign(this, lookupValue);
      this.hasLookupValue = true;
    }
  }

  get string() {
    if (this.hasLookupValue) {
      return `lookups.order_status.${this.value}`;
    }
    return this.value;
  }

  static get lookupArray() {
    return Object.entries(OrderStatus.lookup).map(
      ([, status]) => new OrderStatus(status)
    );
  }

  static get lookup() {
    return {
      UNKNOWN: {
        color: '#000000',
        dark: true,
        value: 'UNKNOWN',
      },
      REQUESTED: {
        color: '#455A64',
        dark: true,
        value: 'REQUESTED',
      },
      CONFIRMED: {
        color: '#039BE5',
        dark: true,
        value: 'CONFIRMED',
      },
      SCHEDULED: {
        color: '#2f6d7b',
        dark: true,
        value: 'SCHEDULED',
      },
      REJECTED: {
        color: '#AD1457',
        dark: true,
        value: 'REJECTED',
      },
      CANCELLED: {
        color: '#C62828',
        dark: true,
        value: 'CANCELLED',
      },
      PILOT_REQUESTED: {
        color: '#F9A825',
        dark: true,
        value: 'PILOT_REQUESTED',
      },
      COLLECTED: {
        color: '#283593',
        dark: true,
        value: 'COLLECTED',
      },
      DELIVERED: {
        color: '#7CB342',
        dark: true,
        value: 'DELIVERED',
      },
    };
  }
}

export default OrderStatus;
