export type StringId = string;
export type UrlString = string;
export type EntityId = number;
export type Translatable =
  | StringId
  | { en: string; ar: string }
  | { toString(): string };
export type Primitive = string | number | boolean;
export type DataUrl = string;
