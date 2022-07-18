export type OperationStatusRequest = void;
export interface OperationStatusResponse {
  saturation: number;
  utilization: {
    serviceName: string;
    percentage: number;
  }[];
  fulfilment: {
    serviceName: string;
    percentage: number;
  }[];
}
