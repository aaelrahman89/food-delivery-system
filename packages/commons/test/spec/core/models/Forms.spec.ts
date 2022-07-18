import nodeAssert from 'assert';
import { $sb } from '../../../utils/sandbox';
import { BaseForm } from '../../../../core/models/Forms';
import {
  FormValidator,
  required,
} from '../../../../core/validations/form-validators/formValidators';
import { LocalError } from '../../../../core/errors/errors';
import { Time } from '../../../../core/models/Time';
import { assert } from 'chai';

describe('Forms', function () {
  class FakeForm extends BaseForm implements FakeFormInputValues {
    _initialValues: FakeFormInputValues = {
      shallowPrimitiveValue: '',
      deep: {
        primitive: {
          value: '',
        },
        valueObject: new Time('22:00:00'),
        array: [],
      },
    };

    shallowPrimitiveValue = '';
    deep = {
      primitive: {
        value: '',
      },
      valueObject: new Time('22:00:00'),
      array: [] as string[],
    };

    constructor(options?: FakeFormOptions) {
      super();
      super._init(options);
    }

    get validators(): Record<string, FormValidator> {
      return {
        shallowPrimitiveValue: () => required(this.shallowPrimitiveValue),
      };
    }
  }
  describe('BaseForm', function () {
    it('submits when the form is valid', async function () {
      const submitHandler = $sb.stub().resolves(true);
      const successHandler = $sb.stub().resolves(true);
      const form = new FakeForm()
        .assignSubmitHandler(submitHandler)
        .assignSuccessHandler(successHandler);

      form.shallowPrimitiveValue = 'test value';

      assert.isTrue(form.isValid());
      const submitted = await form.submit();

      assert.isTrue(submitted);
      $sb.assert.calledOnce(successHandler);
      $sb.assert.calledOnce(submitHandler);
    });

    it('executes the error handler with a bad operation error when submitting invalid inputs', async function () {
      let thrownError: LocalError = new LocalError({
        message: 'message',
        code: 'any',
      });

      function errorHandler(err: LocalError) {
        thrownError = err;
      }

      const form = new FakeForm().assignErrorHandler(errorHandler);

      const submitted = await form.submit();

      assert.isFalse(submitted);
      nodeAssert.deepEqual(
        thrownError,
        new LocalError({
          message: 'cannot submit invalid form',
          code: 'BAD_OPERATION',
        })
      );
    });

    it('does not fail when submitting without attaching a submit handler', async function () {
      const form = new FakeForm();

      await nodeAssert.doesNotReject(() => form.submit());
    });
    it('does not throw an error if no error handler is assigned', function () {
      const form = new FakeForm();

      nodeAssert.doesNotThrow(() => form.submit());
    });
    it('cannot submit again while submitting', async function () {
      const form = new FakeForm();

      form.shallowPrimitiveValue = 'test value';
      const submitPromise = form.submit();

      assert.isTrue(form.submitting);
      assert.isFalse(form.submittable);

      return submitPromise;
    });
    it('can be submitted again after a successful submit', async function () {
      const form = new FakeForm();

      form.shallowPrimitiveValue = 'test value';
      await form.submit();

      form.shallowPrimitiveValue = 'test value new';

      assert.isTrue(form.submittable);
    });
    it('can be submitted again after a failed submit', async function () {
      const submitHandler = $sb
        .stub()
        .rejects(new LocalError({ message: 'submit error', code: 'any' }));
      const form = new FakeForm();

      form.assignSubmitHandler(submitHandler);

      form.shallowPrimitiveValue = 'test value new';

      assert.isTrue(form.submittable);
    });
    it('accepts defaults inputs and resets to them without deep copying value objects', async function () {
      const formInputs: FakeFormInputValues = {
        shallowPrimitiveValue: 'default string',
        deep: {
          primitive: {
            value: 'a default deep string',
          },
          array: ['el 1', 'el 2', 'el 3'],
          valueObject: new Time('12:00:00'),
        },
      };

      const form = new FakeForm({
        formInputs,
      });

      form.shallowPrimitiveValue = 'a string';
      form.deep.array.push('el 4');
      form.deep.valueObject = new Time('15:00:21');

      assert.notEqual(
        form.shallowPrimitiveValue,
        formInputs.shallowPrimitiveValue
      );
      assert.notDeepEqual(form.deep, formInputs.deep);

      form.reset();

      assert.equal(
        form.shallowPrimitiveValue,
        formInputs.shallowPrimitiveValue
      );
      assert.deepEqual(form.deep, formInputs.deep);

      form.shallowPrimitiveValue = 'a string';
      form.deep.array.push('el 4');
      form.deep.valueObject = new Time('15:00:21');
      assert.notEqual(
        form.shallowPrimitiveValue,
        formInputs.shallowPrimitiveValue
      );
      assert.notDeepEqual(form.deep, formInputs.deep);
    });
    it('exposes a copy of the default inputs', function () {
      const formInputs: FakeFormInputValues = {
        shallowPrimitiveValue: 'default string',
        deep: {
          primitive: {
            value: 'a default deep string',
          },
          array: ['el 1', 'el 2', 'el 3'],
          valueObject: new Time('12:00:00'),
        },
      };

      const form = new FakeForm({
        formInputs,
      });

      assert.notEqual(form.defaults.deep, formInputs.deep);
      assert.deepEqual(form.defaults, formInputs);
    });
  });
});

interface FakeFormInputValues {
  shallowPrimitiveValue: string;
  deep: {
    primitive: {
      value: string;
    };
    valueObject: Time;
    array: string[];
  };
}

interface FakeFormOptions {
  formInputs: FakeFormInputValues;
}
