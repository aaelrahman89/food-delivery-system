export class Enum {
  constructor(value) {
    this.value = value;
    this._constructorName = 'Enum';
  }

  overrideProps() {
    Object.assign(this, this.constructor.enumValues[this.value]);
  }

  setConstructorName(value) {
    this._constructorName = value;
  }

  toString() {
    const prefix = this._constructorName
      .replace(/([A-Z])/g, '_$1')
      .substr(1)
      .toUpperCase();

    return `${prefix}_${this.value}`;
  }
}
