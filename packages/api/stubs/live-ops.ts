import { OperationStatusResponse } from '../definitions/live-ops';

export function operationStatusResponseStub(): OperationStatusResponse {
  return {
    saturation: 14,
    utilization: [
      {
        serviceName: 'string',
        percentage: 14,
      },
    ],
    fulfilment: [
      {
        serviceName: 'string',
        percentage: 14,
      },
    ],
  };
}
