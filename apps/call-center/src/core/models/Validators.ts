export interface Validators {
  [validator: string]: FormValidator;
}

export interface FormValidator {
  (value?: unknown): FormValidationResult | boolean;
}

export type FormValidationResult = string | true;
