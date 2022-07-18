class Currency {
  constructor({ value = 'egp' } = {}) {
    this.value = value;
    this.hasLookupValue = false;

    const lookupValue = Currency.lookup[value];

    if (lookupValue) {
      Object.assign(this, lookupValue);
      this.hasLookupValue = true;
    }
  }

  get string() {
    if (this.hasLookupValue) {
      return `lookups.currency.${this.value}`;
    }
    return this.value;
  }

  static get lookup() {
    return {
      egp: {
        value: 'egp',
      },
    };
  }
}

export default Currency;
