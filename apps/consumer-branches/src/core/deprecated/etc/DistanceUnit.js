class DistanceUnit {
  constructor({ value = 'km' } = {}) {
    this.value = value;
    this.hasLookupValue = false;

    const lookupValue = DistanceUnit.lookup[value];

    if (lookupValue) {
      Object.assign(this, lookupValue);
      this.hasLookupValue = true;
    }
  }

  get string() {
    if (this.hasLookupValue) {
      return `lookups.distance_unit.${this.value}`;
    }
    return this.value;
  }

  static get lookup() {
    return {
      km: {
        value: 'km',
      },
    };
  }
}

export default DistanceUnit;
