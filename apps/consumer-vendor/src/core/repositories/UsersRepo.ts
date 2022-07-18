import { EntityId } from '@survv/commons/core/types';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { ListingQuery } from '@survv/commons/core/models/Query';
import { User } from '../models/User';

export interface UsersRepo {
  listUsers(query?: ListingQuery): Promise<ItemsList<User>>;
  activateUser(userId: EntityId): Promise<void>;
  deactivateUser(userId: EntityId): Promise<void>;
  updateUser(user: {
    id: number;
    name: string;
    email: string;
    mobileNo: string;
    role: string;
  }): Promise<void>;
  createUser(user: {
    name: string;
    email: string;
    mobileNo: string;
    role: string;
  }): Promise<void>;
}
