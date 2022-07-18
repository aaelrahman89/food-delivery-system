import fastDeepEqual from 'fast-deep-equal';
import { Primitive } from '../types';

export function deepEqual<T, K>(obj1: T, obj2: K): boolean {
  return fastDeepEqual(obj1, obj2);
}

export function notDeepEqual<T, K>(obj1: T, obj2: K): boolean {
  return !deepEqual(obj1, obj2);
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value == 'object' && !Array.isArray(value);
}

export function isArray<T>(value: unknown): value is Array<T> {
  return Array.isArray(value);
}

export function isNumber(value: unknown): value is number {
  return typeof value == 'number' && !Number.isNaN(value);
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value == 'boolean';
}

export function isString(value: unknown): value is string {
  return typeof value == 'string';
}

export function isFunction(
  value: unknown
): value is (args: unknown) => unknown {
  return typeof value == 'function';
}

export function isNotEmpty<T>(value: unknown): value is NonNullable<T> {
  if (value == null) {
    return false;
  }

  if (isArray(value)) {
    return value.length > 0;
  }

  if (isObject(value)) {
    return Object.keys(value).length > 0;
  }

  if (isString(value)) {
    return value.trim() != '' && value != 'null' && value != 'undefined';
  }
  if (isNumber(value)) {
    return value !== 0;
  }

  return true;
}

export function isEmpty(value: unknown): boolean {
  return !isNotEmpty(value);
}

export function isNotPrimitive<T>(
  value: unknown
): value is Record<string, unknown> | Array<T> {
  return isObject(value) || isArray(value);
}

export function isPrimitive(value: unknown): value is Primitive {
  return !isNotPrimitive(value);
}

export function hasOwnProperty(
  object: Record<string, unknown>,
  key: string
): boolean {
  return Object.keys(object).includes(key);
}
