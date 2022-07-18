import { Datetime } from '@survv/commons/core/utils/datetime';
import {
  ImageRefType,
  createImageUrl,
} from '@survv/commons/core/models/Images';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import {
  ListUsersResponse,
  UserDetailsResponse,
} from '@survv/api/definitions/users';

import { User } from '../../../../core/models/User';
import { UserRole } from '@survv/commons/core/models/UserRole';

export function mapListUsersResponseToItemsList(
  response: ListUsersResponse
): ItemsList<User> {
  return {
    totalItemsCount: response.metadata.totalCount,
    items: response.users.map(
      (user) =>
        new User({
          id: user.id,
          name: user.fullName,
          mobileNo: user.mobileNo,
          email: user.email,
          active: user.active,
          userRoles: user.userRoles.map((userRole) => new UserRole(userRole)),
          profileImage: createImageUrl({
            refId: user.id,
            refType: ImageRefType.OPS_USER_PROFILE_IMAGE,
          }),
          lastUpdateDate: new Datetime(user.lastUpdateDate),
          creationDate: new Datetime(user.creationDate),
        })
    ),
  };
}

export function mapGetUserResponseToUser(response: UserDetailsResponse): User {
  return new User({
    id: response.id,
    name: response.fullName,
    email: response.email,
    mobileNo: response.mobileNo,
    active: response.active,
    userRoles: response.userRoles.map((userRole) => new UserRole(userRole)),
    profileImage: createImageUrl({
      refType: ImageRefType.OPS_USER_PROFILE_IMAGE,
      refId: response.id,
    }),
    lastUpdateDate: new Datetime(response.lastUpdateDate),
    creationDate: new Datetime(response.creationDate),
  });
}
