import DistanceUnit from './DistanceUnit';

class Distance {
  constructor({ value = 0 } = {}) {
    this.value = value;
  }

  toKm(fixed = 1) {
    const distance = {
      unit: new DistanceUnit({ value: 'km' }),
      value: (0).toFixed(fixed),
    };
    if (this.value) {
      distance.value = (Number(this.value) / 1000).toFixed(fixed);
    }

    return distance;
  }
}

export default Distance;
