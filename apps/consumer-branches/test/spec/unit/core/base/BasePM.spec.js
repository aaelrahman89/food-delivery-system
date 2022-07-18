import BasePM from '../../../../../src/core/deprecated/base/BasePM';
import { assert } from 'chai';

describe('BasePM Unit', function () {
  it('should implement BasePM interface', function () {
    const bpm = new BasePM();
    assert.isFunction(bpm.init);
    assert.isFunction(bpm.validators);
    assert.isFunction(bpm.isValid);
    assert.isFunction(bpm.hydrate);
    assert.isBoolean(bpm.loading);
  });

  it('should throw "validators is not implemented"', function () {
    const bpm = new BasePM();
    try {
      bpm.validators();
    } catch (err) {
      assert.equal(err.message, 'validators is not implemented');
    }
  });

  describe('hydrate method', function () {
    it('should throw "hydrate is not implemented"', async function () {
      const bpm = new BasePM();
      try {
        await bpm.hydrate();
        return Promise.reject(new Error('Should not get here'));
      } catch (err) {
        return assert.equal(err.message, 'hydrate is not implemented');
      }
    });
  });

  describe('init method', function () {
    it('should call hydrate method ', async function () {
      const bpm = new BasePM();
      let mockStore = 0;
      bpm.hydrate = () => {
        mockStore = 123;
      };

      await bpm.init();

      assert.equal(mockStore, 123);
    });
    it('should set loading = true before hydration', function () {
      const bpm = new BasePM();

      bpm.loading = false;
      bpm.hydrate = () => true;
      bpm.init();
      assert.isTrue(bpm.loading);
    });
    it('should set loading = false after hydration success', async function () {
      const bpm = new BasePM();

      bpm.loading = true;
      bpm.hydrate = () => true;
      await bpm.init();
      assert.isFalse(bpm.loading);
    });
    it('should loading = false after hydration failure', async function () {
      const bpm = new BasePM();

      try {
        bpm.loading = true;
        await bpm.init();
        return Promise.reject(new Error('Should not get here'));
      } catch (err) {
        return assert.isFalse(bpm.loading);
      }
    });
  });
  describe('longProcess method', function () {
    it('should set toggle loading before and after running', async function () {
      const bpm = new BasePM();

      try {
        const init = bpm.init();
        assert.isTrue(bpm.loading);
        await init;
        return Promise.reject(new Error('Should not succeed'));
      } catch (err) {
        return assert.isFalse(bpm.loading);
      }
    });
    it('should toggle loading before and after running', async function () {
      const bpm = new BasePM();

      bpm.hydrate = () => true;

      const init = bpm.init();
      assert.isTrue(bpm.loading);

      await init;
      assert.isFalse(bpm.loading);
    });
  });
  describe('isValid method', function () {
    it('should return false immediately if any validator fails', function () {
      const callArray = {
        fn1: {
          called: false,
        },
        fn2: {
          called: false,
        },
      };
      const extendedBpm = {
        validators() {
          return {
            fn1() {
              callArray.fn1.called = true;
              return false;
            },
            fn2() {
              callArray.fn2.called = true;
              return true;
            },
          };
        },
      };

      Object.setPrototypeOf(extendedBpm, BasePM.prototype);

      assert.isFalse(extendedBpm.isValid());
      assert.isTrue(callArray.fn1.called);
      assert.isFalse(callArray.fn2.called);
    });

    it('should return false if any validator fails', function () {
      const extendedBpm = {
        validators() {
          return {
            passValidator() {
              return true;
            },
            failValidator() {
              return true;
            },
          };
        },
      };

      Object.setPrototypeOf(extendedBpm, BasePM.prototype);

      assert.isTrue(extendedBpm.isValid());
    });
  });
});
