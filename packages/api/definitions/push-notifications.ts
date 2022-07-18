import { ListingMetadata } from './common';

export type PushNotificationsListRequest = void;
export interface PushNotificationsListResponse {
  metadata: ListingMetadata;
  notifications: Array<{
    id: number;
    title: string;
    body: string;
    createdBy: {
      id: number;
      email: string;
    };
    creationDate: string;
  }>;
}

export interface PushNotificationCreationRequest {
  title: string;
  body: string;
  audience: string[];
}

export type PushNotificationCreationResponse = void;
