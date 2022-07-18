import Currency from './Currency';

class Money {
  constructor({ value = 0, currency = 'egp' } = {}) {
    this.currency = new Currency({ value: currency });
    this.value = value;
  }

  get string() {
    return this.value.toFixed(2);
  }
}

export default Money;
