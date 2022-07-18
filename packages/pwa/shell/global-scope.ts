// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getGlobalObject(this: unknown): any {
  if (typeof globalThis !== 'undefined') {
    return globalThis;
  }
  if (typeof global !== 'undefined') {
    return global;
  }
  if (typeof window !== 'undefined') {
    return window;
  }
  // eslint-disable-next-line no-restricted-globals
  if (typeof self !== 'undefined') {
    // eslint-disable-next-line no-restricted-globals
    return self;
  }
  return this;
}

export const globalObject = getGlobalObject();
