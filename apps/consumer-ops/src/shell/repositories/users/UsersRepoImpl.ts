import {
  AuthActionRequest,
  AuthActionResponse,
  DeactivateUserRequest,
  DeactivateUserResponse,
  ListUsersRequest,
  ListUsersResponse,
  UserCreationRequest,
  UserCreationResponse,
  UserDetailsRequest,
  UserDetailsResponse,
  UserUpdateRequest,
  UserUpdateResponse,
} from '@survv/api/definitions/users';

import {
  NetworkService,
  networkService,
} from '@survv/commons/shell/backend/networkService';

import { Base64EncodedFile } from '@survv/commons/core/models/Files';
import { EntityId } from '@survv/commons/core/types';
import {
  ImageCreationRequest,
  ImageCreationResponse,
  ImageMimeType,
  ImageReferenceType,
} from '@survv/api/definitions/images';
import { ImageRefType } from '@survv/commons/core/models/Images';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { QuerySpec } from '@survv/commons/core/models/Query';
import { User, UserForm } from '../../../core/models/User';
import { UsersRepo } from '../../../core/repositories/UsersRepo';
import { actionAuthTokenRepo } from '@survv/commons/shell/repositories/ActionAuthTokenRepoImpl';
import {
  mapGetUserResponseToUser,
  mapListUsersResponseToItemsList,
} from './mappers/responses';
import {
  mapUserFormToUserCreationRequest,
  mapUserFormToUserUpdateRequest,
} from './mappers/requests';

export class UsersRepoImpl implements UsersRepo {
  private readonly _networkService: NetworkService = networkService;
  private readonly _actionAuthTokenRepo = actionAuthTokenRepo;

  async authorizeUpdateOrder(userPassword: string): Promise<void> {
    const response = await this._networkService.request<
      AuthActionRequest,
      AuthActionResponse
    >({
      requestLine: 'post /api/v1/users/authorize-action',
      body: {
        password: userPassword,
        action: 'UPDATE_ORDER',
      },
    });

    await this._actionAuthTokenRepo.saveToken(response.token);
  }

  async listUsers(query?: QuerySpec): Promise<ItemsList<User>> {
    return mapListUsersResponseToItemsList(
      await this._networkService.request<ListUsersRequest, ListUsersResponse>({
        requestLine: 'get /api/v1/users',
        query: query ? { querySpec: query } : undefined,
      })
    );
  }

  async getUser(userId: EntityId): Promise<User> {
    return mapGetUserResponseToUser(
      await this._networkService.request<
        UserDetailsRequest,
        UserDetailsResponse
      >({
        requestLine: 'get /api/v1/users/:userId',
        params: { userId },
      })
    );
  }

  async updateUser(userId: EntityId, form: UserForm): Promise<void> {
    await this._networkService.request<UserUpdateRequest, UserUpdateResponse>({
      requestLine: 'put /api/v1/users/:userId',
      params: { userId },
      body: mapUserFormToUserUpdateRequest(form),
    });

    if (form.profileImage instanceof Base64EncodedFile) {
      await this._networkService.request<
        ImageCreationRequest,
        ImageCreationResponse
      >({
        requestLine: 'post /api/v1/files',
        body: {
          referenceId: userId,
          referenceType:
            ImageRefType.OPS_USER_PROFILE_IMAGE.valueOf() as ImageReferenceType,
          payload: (form.profileImage as Base64EncodedFile).base64String,
          mimeType: (form.profileImage as Base64EncodedFile)
            .type as ImageMimeType,
          append: false,
        },
      });
    }
  }

  async deactivateUser(userId: EntityId): Promise<void> {
    await this._networkService.request<
      DeactivateUserRequest,
      DeactivateUserResponse
    >({
      requestLine: 'post /api/v1/users/:userId/deactivate',
      params: { userId },
    });
  }

  async createUser(form: UserForm): Promise<void> {
    const response = await this._networkService.request<
      UserCreationRequest,
      UserCreationResponse
    >({
      requestLine: 'post /api/v1/users',
      body: mapUserFormToUserCreationRequest(form),
    });

    if (form.profileImage instanceof Base64EncodedFile) {
      await this._networkService.request<
        ImageCreationRequest,
        ImageCreationResponse
      >({
        requestLine: 'post /api/v1/files',
        body: {
          referenceId: response.id,
          referenceType:
            ImageRefType.OPS_USER_PROFILE_IMAGE.valueOf() as ImageReferenceType,
          payload: (form.profileImage as Base64EncodedFile).base64String,
          mimeType: (form.profileImage as Base64EncodedFile)
            .type as ImageMimeType,
          append: false,
        },
      });
    }
  }

  async activateUser(password: string, activationToken: string): Promise<void> {
    await this._networkService.request({
      requestLine: 'post /api/v1/users/user-activation',
      body: {
        password,
        activationToken,
      },
    });
  }

  async activationTokenExists(activationToken: string): Promise<boolean> {
    try {
      await this._networkService.request({
        requestLine: 'get /api/v1/users/activation-token/:activationToken',
        params: { activationToken },
      });
      return true;
    } catch (err) {
      return false;
    }
  }
}
