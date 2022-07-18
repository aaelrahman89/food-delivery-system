import {
  CompensationType,
  ComplaintCategory,
  ListingMetadata,
  MoneyWithCurrency,
} from './common';

export type ListTasksComplaintsRequest = void;
export interface ListTasksComplaintsResponse {
  metadata: ListingMetadata;
  complaints: {
    taskId: number;
    branchId: number;
    branchLabel: string;
    compensation: {
      compensationType: CompensationType;
      amount: MoneyWithCurrency;
      compensationDate: string;
      compensatorId: number;
      compensatorEmail: string;
    };
    complaint: {
      category: ComplaintCategory;
      crmLink: string;
      createdBy: string;
      creationDate: string;
    };
  }[];
}
