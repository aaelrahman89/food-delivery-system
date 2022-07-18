import nodeAssert from 'assert';
import { $sb } from '../../../utils/sandbox';
import { BasePM } from '../../../../core/base/BasePM';
import { assert } from 'chai';
import { errorCodes, errorModel } from '../../../../core/errors/errors';

let validationStubs;

class FakeImplementation extends BasePM {
  async fakeSuccessfulPublicLongProcess() {
    return this._longProcess(() => {});
  }

  async fakeResolvePublicLongProcess(data) {
    return this._longProcess(() => data);
  }

  async fakeFailingPublicLongProcess() {
    return this._longProcess(() =>
      Promise.reject(new Error('failed public long process'))
    );
  }

  publicNotify(notification) {
    this._notify(notification);
  }

  publicRepeatEvery(fn, timeout) {
    this._repeatEvery(fn, timeout);
    return [...this._intervals];
  }

  validators() {
    return validationStubs;
  }
}

describe('BasePM unit', function () {
  beforeEach('reset stubs', function () {
    validationStubs = {
      validator1: $sb.stub(),
      validator2: $sb.stub(),
    };
  });
  it('should not be loading at construction', function () {
    const pm = new BasePM();

    assert.isFalse(pm.loading);
  });

  it('should not be initialized at construction', function () {
    const pm = new BasePM();

    assert.isFalse(pm.initialized);
  });

  it('should not be initializing on construction', function () {
    const pm = new BasePM();

    assert.isFalse(pm.initializing);
  });

  it('should not have any notifications on construction', function () {
    const pm = new BasePM();

    assert.isUndefined(pm.notification);
  });

  describe('init method', function () {
    context('unimplemented hydration', function () {
      it('should reject with an internal error communicating that hydration is not implemented', async function () {
        const pm = new BasePM();

        await nodeAssert.rejects(
          () => pm.init(),
          errorModel({
            message: 'hydration is not implemented',
            code: errorCodes.APPLICATION_ERROR,
          })
        );
      });
    });

    context('before hydrating', function () {
      it('should mark the presentation model as loading', function () {
        const pm = new BasePM();

        pm.init().catch(() => {});

        assert.isTrue(pm.loading, 'loading');
      });
      it('should mark the presentation model as initializing', function () {
        const pm = new BasePM();

        pm.init().catch(() => {});

        assert.isTrue(pm.initializing, 'initializing');
      });

      it('should not mark the presentation model as initialized', function () {
        const pm = new BasePM();

        pm.init().catch(() => {});

        assert.isFalse(pm.initialized, 'not yet initialized');
      });
    });

    context('after hydration', function () {
      it('should mark the presentation model as not loading', async function () {
        const pm = new BasePM();

        await pm.init().catch(() => {});

        assert.isFalse(pm.loading, 'not loading');
      });
      it('should mark the presentation model as initializing', async function () {
        const pm = new BasePM();

        await pm.init().catch(() => {});

        assert.isFalse(pm.initializing, 'not initializing');
      });

      it('should mark the presentation model as initialized', async function () {
        const pm = new BasePM();

        await pm.init().catch(() => {});

        assert.isTrue(pm.initialized, 'initialized');
      });
    });
  });

  describe('private longProcess method', function () {
    context('before processing', function () {
      it('should mark the presentation model as loading', function () {
        const fakePM = new FakeImplementation();

        fakePM.fakeSuccessfulPublicLongProcess();

        assert.isTrue(fakePM.loading, 'loading');
      });

      it('should be able to resolve data', async function () {
        const fakePM = new FakeImplementation();

        const returnedData = await fakePM.fakeResolvePublicLongProcess({
          fake: 'data',
        });

        assert.deepEqual(returnedData, {
          fake: 'data',
        });
      });
    });

    context('after processing', function () {
      it('should mark the presentation model as not loading after successful long process', async function () {
        const fakePM = new FakeImplementation();

        await fakePM.fakeSuccessfulPublicLongProcess();

        assert.isFalse(fakePM.loading, 'not loading');
      });

      it('should should mark the presentation model as not loading after failed long process', async function () {
        const fakePM = new FakeImplementation();

        await fakePM.fakeFailingPublicLongProcess().catch(() => {});

        assert.isFalse(fakePM.loading, 'not loading');
      });
    });

    describe('private notify method', function () {
      it('should set the notification on the presentation model with whatever it was given', function () {
        const fakePM = new FakeImplementation();

        fakePM.publicNotify({ an: 'object' });

        assert.deepEqual(fakePM.notification, { an: 'object' });
      });
    });
  });

  describe('refresh method', function () {
    context('unimplemented refresh', function () {
      it('should reject with an internal error communicating that it is not implemented', async function () {
        const pm = new BasePM();

        await nodeAssert.rejects(
          () => pm.refresh(),
          errorModel({
            message: 'refresh is not implemented',
            code: errorCodes.APPLICATION_ERROR,
          })
        );
      });
    });
  });

  describe('_repeatEvery()', function () {
    it('sets intervals and keep references to them', function () {
      const pm = new FakeImplementation();

      const dummyFn = function () {};
      const dummyReference = {};

      const setIntervalMock = $sb
        .mock(global)
        .expects('setInterval')
        .exactly(3)
        .withExactArgs(dummyFn, 10)
        .returns(dummyReference);

      pm.publicRepeatEvery(dummyFn, 10);
      pm.publicRepeatEvery(dummyFn, 10);
      const intervals = pm.publicRepeatEvery(dummyFn, 10);

      setIntervalMock.verify();

      assert.equal(intervals.length, 3);
      assert.equal(intervals[0], dummyReference, 'object reference is saved');
      assert.equal(intervals[1], dummyReference, 'object reference is saved');
      assert.equal(intervals[2], dummyReference, 'object reference is saved');
    });
  });

  describe('onViewDestroyed()', function () {
    it('clears all saved interval references', function () {
      const pm = new FakeImplementation();

      const dummyReference = {};

      $sb.stub(global, 'setInterval').returns(dummyReference);

      pm.publicRepeatEvery(() => {}, 10);
      pm.publicRepeatEvery(() => {}, 10);
      pm.publicRepeatEvery(() => {}, 10);

      const clearIntervalMock = $sb
        .mock(global)
        .expects('clearInterval')
        .exactly(3)
        .withExactArgs(dummyReference);

      pm.onViewDestroyed();

      clearIntervalMock.verify();
    });
  });

  describe('validators()', function () {
    it('throws an error when not overridden', function () {
      const pm = new BasePM();

      nodeAssert.throws(
        () => pm.validators(),
        errorModel({
          message: 'validators is not implemented',
          code: errorCodes.APPLICATION_ERROR,
        })
      );
    });
  });

  describe('isValid()', function () {
    it('should return false immediately if any validator returns a string', function () {
      const pm = new FakeImplementation();

      validationStubs.validator1.returns('a validation error');
      validationStubs.validator1.returns(true);

      assert.isFalse(pm.isValid());
      assert.isTrue(validationStubs.validator1.calledOnce);
      assert.isFalse(validationStubs.validator2.notCalled);
    });
    it('should return true if all validators return true', function () {
      const pm = new FakeImplementation();

      validationStubs.validator1.returns(true);
      validationStubs.validator2.returns(true);

      assert.isTrue(pm.isValid());
    });
  });
});
