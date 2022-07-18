import { Primitive } from '../types';
import { isArray, isObject } from '../utils/checks';

export abstract class BaseMessage {
  private deepClone(value: unknown): unknown {
    if (!isObject(value) && !isArray(value)) {
      return value;
    }

    let clone:
      | Primitive[]
      | Record<string, unknown>
      | Record<string, unknown>[];

    if (isArray(value)) {
      clone = [];
      value.forEach((v: unknown) => {
        (clone as unknown[]).push(this.deepClone(v));
      });
    } else {
      clone = {};
      Object.keys(value).forEach((key) => {
        (clone as { [key: string]: unknown })[key] = this.deepClone(value[key]);
      });
    }

    return clone;
  }

  clone(): this {
    const newInstance = Object.create(Object.getPrototypeOf(this));
    Object.entries(this).forEach(([key, value]) => {
      newInstance[key] = this.deepClone(value);
    });
    return newInstance;
  }
}
