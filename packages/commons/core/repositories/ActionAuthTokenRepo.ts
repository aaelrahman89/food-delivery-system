import { ActionAuthToken } from '../models/ActionAuthToken';

export interface ActionAuthTokenRepo {
  getParsedToken(): Promise<ActionAuthToken | undefined>;
  getToken(): Promise<string | undefined>;
  saveToken(authToken: string): Promise<void>;
  clearToken(): Promise<void>;
}
