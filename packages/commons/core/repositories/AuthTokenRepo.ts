import { AuthToken } from '../models/AuthToken';
import { EntityId } from '../types';
import { UserRole } from '../models/UserRole';

export interface AuthTokenRepo {
  getParsedToken(): Promise<AuthToken | undefined>;
  getToken(): Promise<string | undefined>;
  getUserId(): Promise<EntityId>;
  getUserRoles(): Promise<UserRole[]>;
  saveToken(authToken: string, scopes?: string[]): Promise<void>;
  clearToken(scopes?: string[]): Promise<void>;
}
