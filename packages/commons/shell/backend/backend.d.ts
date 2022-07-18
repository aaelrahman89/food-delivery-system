import { AuthTokenRepo } from '../../core/repositories/AuthTokenRepo';
import { Primitive, UrlString } from '../../core/types';
import { Query } from '../../core/models/Query';

type UrlPathParams = Record<string, Primitive>;
export type HttpHeaders = Record<string, Primitive | Record<string, string>>;

interface UrlCreationOptions {
  url: UrlString;
  params?: UrlPathParams;
  query?: Query;
}

export interface RequestOptions<T> {
  requestLine: string;
  params?: UrlPathParams;
  query?: Query;
  body?: T;
  headers?: HttpHeaders;
}

export function createBackendUrl(options: UrlCreationOptions): string;
export function request<RequestBody, Response>(
  options: RequestOptions<RequestBody>
): Promise<Response>;
export function configure(options: { authTokenRepo: AuthTokenRepo }): void;
export function addBaseUrlOverride(url: UrlString): string;
export function removeBaseUrlOverride(url: UrlString): string;
