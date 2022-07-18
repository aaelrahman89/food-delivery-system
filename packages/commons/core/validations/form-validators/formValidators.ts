import { isEmpty, isNumber } from '../../utils/checks';

export interface FormValidator {
  (value?: unknown): FormValidationResult | boolean;
}

export type FormValidationResult = string | true;

export const validationMessages = {
  FORM_REQUIRED_INPUT: 'FORM_REQUIRED_INPUT',
  FORM_INVALID_MONEY: 'FORM_INVALID_MONEY',
  FORM_REQUIRED_AT_LEAST_ONE: 'FORM_REQUIRED_AT_LEAST_ONE',
  FORM_INVALID_CHAR_COUNT: 'FORM_INVALID_CHAR_COUNT',
  FORM_INVALID_PERCENTAGE: 'FORM_INVALID_PERCENTAGE',
  FORM_INVALID_EMAIL: 'FORM_INVALID_EMAIL',
};

export function required(value: unknown): FormValidationResult {
  return isEmpty(value) || value === false
    ? validationMessages.FORM_REQUIRED_INPUT
    : true;
}

export function isValidMoney(value: string | number): FormValidationResult {
  return RegExp('^[0-9]+(\\.[0-9]{1,2})?$').test(String(value))
    ? true
    : validationMessages.FORM_INVALID_MONEY;
}
export function requireAtLeastOne(values: unknown[]): FormValidationResult {
  return values.some((val) => required(val) === true)
    ? true
    : validationMessages.FORM_REQUIRED_AT_LEAST_ONE;
}

export function hasValidCharCount(
  value: string,
  count: number
): FormValidationResult {
  return count >= value.length
    ? true
    : validationMessages.FORM_INVALID_CHAR_COUNT;
}

export function isValidPercentage(value: number): FormValidationResult {
  return value >= 0 && value <= 100 && isNumber(value)
    ? true
    : validationMessages.FORM_INVALID_PERCENTAGE;
}

export function isValidEmail(value: string): FormValidationResult {
  return RegExp('^\\S+@\\S+\\.\\S+$').test(String(value))
    ? true
    : validationMessages.FORM_INVALID_EMAIL;
}
