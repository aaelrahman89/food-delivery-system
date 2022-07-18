import { FormValidator } from '../validations/form-validators/formValidators';
import { LocalError } from '../errors/errors';

export function cloneInitialValues(
  value: FormInitialValues
): FormInitialValues {
  if (value.constructor != Object && value.constructor != Array) {
    return value;
  }

  let clone: FormInitialValues;

  if (value.constructor == Array) {
    clone = [];
  } else {
    clone = {};
  }

  Object.keys(value).forEach((key) => {
    clone[key] = cloneInitialValues(value[key]);
  });

  return clone;
}

export abstract class BaseForm {
  abstract get validators(): Record<string, FormValidator>;
  protected _submitHandler: FormSubmitHandler<this> = async () => true;

  protected _successHandler: FormSuccessHandler<this> = async () => true;

  protected _errorHandler: FormErrorHandler<this> = async () => false;

  protected abstract readonly _initialValues: FormInitialValues;
  protected _state: FormState;
  protected _states: FormStates;

  constructor() {
    const boundIsValidFn = (): boolean => this.isValid();

    this._states = {
      default: {
        get submittable(): boolean {
          return boundIsValidFn();
        },
        submitting: false,
      },
      submitting: {
        submittable: false,
        submitting: true,
      },
    };

    this._state = this._states.default;
  }

  protected _init(options?: { formInputs?: FormInitialValues }): this {
    Object.assign(this._initialValues, options?.formInputs);
    Object.assign(this, cloneInitialValues(this._initialValues));
    return this;
  }

  isValid(): boolean {
    return Object.entries(this.validators).every(([, fn]) => fn() === true);
  }

  assignSubmitHandler(fn: FormSubmitHandler<this>): this {
    this._submitHandler = fn;
    return this;
  }

  assignSuccessHandler(fn: FormSuccessHandler<this>): this {
    this._successHandler = fn;
    return this;
  }

  assignErrorHandler(fn: FormErrorHandler<this>): this {
    this._errorHandler = fn;
    return this;
  }

  async submit(): Promise<boolean> {
    try {
      if (!this.submittable) {
        throw new LocalError({
          message: 'cannot submit invalid form',
          code: 'BAD_OPERATION',
        });
      }
      this._state = this._states.submitting;
      await this._submitHandler(this);
      this._successHandler(this);
      this._state = this._states.default;
      return true;
    } catch (err) {
      this._state = this._states.default;
      this._errorHandler(err, this);
      return false;
    }
  }

  get submittable(): boolean {
    return this._state.submittable;
  }

  get submitting(): boolean {
    return this._state.submitting;
  }

  get defaults(): FormInitialValues {
    return cloneInitialValues(this._initialValues);
  }

  reset(): this {
    Object.assign(this, cloneInitialValues(this._initialValues));
    this._state = this._states.default;
    return this;
  }
}

interface FormSubmitHandler<T extends BaseForm> {
  (form: T): Promise<unknown>;
}
interface FormSuccessHandler<T extends BaseForm> {
  (form: T): unknown;
}
interface FormErrorHandler<T extends BaseForm> {
  (error: LocalError, form: T): unknown;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormInitialValues = Record<string | number, any>;

interface FormState {
  submittable: boolean;
  submitting: boolean;
}

interface FormStates {
  default: FormState;
  submitting: FormState;
}
