import {
  CreateVendorUserRequest,
  CreateVendorUserResponse,
  ListVendorUsersRequest,
  ListVendorUsersResponse,
  UpdateVendorUserRequest,
  UpdateVendorUserResponse,
} from '@survv/api/definitions/vendors';
import { EntityId } from '@survv/commons/core/types';
import {
  FilterSpecElement,
  ListingQuery,
  backendQueryMapper,
  fieldMapper,
  filterOperators,
} from '@survv/commons/core/models/Query';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { User } from '../../../core/models/User';
import { UsersRepo } from '../../../core/repositories/UsersRepo';
import { kvStorage } from '@survv/pwa/shell/kv-storage-impl';
import { mapVendorUsersListResponseToUsers } from './mappers/responses';
import { networkService } from '@survv/commons/shell/backend/networkService';

const USERS_FILTERS_MAP = {
  vendorId: (val: string): FilterSpecElement[] => [
    fieldMapper({
      fieldName: 'vendorId',
      operator: filterOperators.EQUAL,
      value: val,
    }),
  ],
} as Record<string, (value: unknown) => FilterSpecElement[]>;

const USERS_SORT_MAP = {
  name: 'name',
  email: 'email',
  mobileNo: 'mobileNo',
  role: 'roles',
  status: 'active',
  creationDate: 'creationDate',
};

export class UsersRepoImpl implements UsersRepo {
  private _networkService = networkService;

  async listUsers(query?: ListingQuery): Promise<ItemsList<User>> {
    const vendorId = Number(await kvStorage.getItem('vendor-id'));
    const beQuery = backendQueryMapper({
      ...query,
      filterMap: USERS_FILTERS_MAP,
      sortMap: USERS_SORT_MAP,
      filter: { vendorId },
    });

    return mapVendorUsersListResponseToUsers(
      await this._networkService.request<
        ListVendorUsersRequest,
        ListVendorUsersResponse
      >({
        requestLine: 'get /consumer/api/v1/vendor-users',
        query: { query: beQuery },
      })
    );
  }

  async activateUser(userId: EntityId): Promise<void> {
    await this._networkService.request({
      requestLine: 'put /consumer/api/v1/vendor-users/:userId/activate',
      params: { userId },
    });
  }

  async deactivateUser(userId: EntityId): Promise<void> {
    await this._networkService.request({
      requestLine: 'put /consumer/api/v1/vendor-users/:userId/deactivate',
      params: { userId },
    });
  }

  async updateUser(user: {
    id: number;
    name: string;
    email: string;
    mobileNo: string;
    role: string;
  }): Promise<void> {
    const vendorId = Number(await kvStorage.getItem('vendor-id'));

    await this._networkService.request<
      UpdateVendorUserRequest,
      UpdateVendorUserResponse
    >({
      requestLine: 'put /consumer/api/v1/vendor-users/:userId',
      params: { userId: user.id },
      body: {
        name: user.name,
        mobileNo: user.mobileNo,
        roles: [user.role],
        vendorId,
      },
    });
  }

  async createUser(user: {
    name: string;
    email: string;
    mobileNo: string;
    role: string;
  }): Promise<void> {
    const vendorId = Number(await kvStorage.getItem('vendor-id'));

    await this._networkService.request<
      CreateVendorUserRequest,
      CreateVendorUserResponse
    >({
      requestLine: 'post /consumer/api/v1/vendor-users',
      body: {
        name: user.name,
        email: user.email,
        mobileNo: user.mobileNo,
        roles: [user.role],
        vendorId,
      },
    });
  }
}
