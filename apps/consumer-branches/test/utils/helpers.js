const helpers = {
  randString(length = 20) {
    let string = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i += 1) {
      string += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return string;
  },
  randMobileNo() {
    const possibleOperators = '0125';
    const possible = '0123456789';

    let mobileNo = `01${possibleOperators.charAt(
      Math.floor(Math.random() * possibleOperators.length)
    )}`;

    for (let i = 0; i < 8; i += 1) {
      mobileNo += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return mobileNo;
  },
  fakeJwt(payload) {
    const token = {
      header: helpers.randString(),
      payload:
        typeof payload == 'object' && payload != null
          ? JSON.stringify(payload)
          : payload,
      hmac: helpers.randString(),
    };
    return `${btoa(token.header)}.${btoa(token.payload)}.${btoa(token.hmac)}`;
  },
  randNumber(min, max) {
    return Math.random() * (max - min) + min;
  },
  randId(min = 1, max = Number.MAX_SAFE_INTEGER) {
    return Math.floor(this.randNumber(min, max));
  },
  randInt(min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
    return Math.floor(this.randNumber(min, max));
  },
  randFloat(min = -10e12, max = 10e12) {
    return this.randNumber(min, max);
  },
  randLng(min = -180, max = 180) {
    return this.randNumber(min, max);
  },
  randLat(min = -90, max = 90) {
    return this.randNumber(min, max);
  },
  randAddress() {
    return {
      countryId: this.randId(),
      cityId: this.randId(),
      areaId: this.randId(),
      street: `street${this.randString(5)}`,
      building: `building${this.randString(5)}`,
      floor: this.randInt(),
      apartment: this.randInt(),
      apartmentNo: this.randString(2),
      companyName: `companyName${this.randString(5)}`,
      landmark: `landMark${this.randString(5)}`,
      geoLocation: {
        longitude: this.randLng(),
        latitude: this.randLat(),
      },
    };
  },
  randArrayItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  },
  asyncWait(time) {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  },
};

export default helpers;
