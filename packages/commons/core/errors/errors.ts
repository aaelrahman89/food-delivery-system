import { Primitive } from '../types';

export const errorCodes: Readonly<Record<string, string>> = Object.freeze({
  CONNECTION_TIMEOUT_ERROR: 'CONNECTION_TIMEOUT_ERROR',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
  TECHNICAL_ERROR: 'TECHNICAL_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  WRONG_SERVER_PATH_ERROR: 'WRONG_SERVER_PATH_ERROR',
  BAD_OPERATION: 'BAD_OPERATION',
  APPLICATION_ERROR: 'APPLICATION_ERROR',
  FILE_LIMIT_EXCEEDED: 'FILE_LIMIT_EXCEEDED',
  BAD_FILE_TYPE: 'BAD_FILE_TYPE',
  NETWORK_CLIENT_ERROR: 'NETWORK_CLIENT_ERROR',
});

interface LocalErrorOptions {
  message: string;
  code: string;
  args?: Record<string, string | number>;
}

export class LocalError extends Error {
  type: 'error';
  name: 'localError';
  code: string;
  args?: Record<string, Primitive>;

  constructor({ message, code, args }: LocalErrorOptions) {
    super(message);
    this.name = 'localError';
    this.type = 'error';
    this.code = code;
    this.args = args;
  }
}

export function errorModel(options: LocalErrorOptions): LocalError {
  const { message, code, args } = options;
  return new LocalError({
    message,
    code,
    args,
  });
}
