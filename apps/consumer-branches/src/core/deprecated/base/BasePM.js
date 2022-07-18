class BasePM {
  constructor() {
    this.loading = false;
    this.initialized = false;
    this.notification = undefined;
  }

  async init() {
    this.loading = true;
    try {
      return await this.hydrate();
    } finally {
      this.loading = false;
      this.initialized = true;
    }
  }

  _displayError(err, options) {
    this.notification = {
      ...options,
      type: 'error',
      message: err.message,
    };
  }

  validators() {
    throw new Error('validators is not implemented');
  }

  isValid() {
    return Object.entries(this.validators()).every(([, fn]) => fn() === true);
  }

  hydrate() {
    return Promise.reject(new Error('hydrate is not implemented'));
  }
}

export default BasePM;
