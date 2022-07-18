import { EntityId } from '@survv/commons/core/types';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { QuerySpec } from '@survv/commons/core/models/Query';
import { User, UserForm } from '../models/User';

export interface UsersRepo {
  authorizeUpdateOrder(password: string): Promise<void>;
  listUsers(query?: QuerySpec): Promise<ItemsList<User>>;
  getUser(userId: EntityId): Promise<User>;
  updateUser(userId: EntityId, form: UserForm): Promise<void>;
  deactivateUser(userId: EntityId): Promise<void>;
  createUser(form: UserForm): Promise<void>;
  activateUser(password: string, activationToken: string): Promise<void>;
  activationTokenExists(activationToken: string): Promise<boolean>;
}
