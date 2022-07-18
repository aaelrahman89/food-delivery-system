// eslint-disable-next-line no-undef

const globalObject = globalThis || global || window;

const originalSetInterval = globalObject.setInterval;

let registeredIntervals: intervalMock[] = [];

export const intervals = {
  replace(): void {
    globalObject.setInterval = function immediateSetInterval(
      callback: TimerHandler,
      timeout: number | undefined
    ): number {
      registeredIntervals.push({
        callback,
        timeout,
      });
      return registeredIntervals.length;
    } as typeof globalObject['setInterval'];
  },

  async execute(): Promise<void> {
    await Promise.all(
      registeredIntervals.map((interval) =>
        (interval.callback as () => unknown)()
      )
    );
  },

  clear(): void {
    registeredIntervals = [];
  },

  restore(): void {
    globalObject.setInterval = originalSetInterval;
    registeredIntervals = [];
  },
};

interface intervalMock {
  callback: TimerHandler;
  timeout: number | undefined;
}
