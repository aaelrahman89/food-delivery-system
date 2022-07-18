import { Datetime } from '@survv/commons/core/utils/datetime';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { ListVendorUsersResponse } from '@survv/api/definitions/vendors';
import { User } from '../../../../core/models/User';
import { UserRole } from '@survv/commons/core/models/UserRole';
import { UserStatus } from '../../../../core/models/UserStatus';

export function mapVendorUsersListResponseToUsers(
  response: ListVendorUsersResponse
): ItemsList<User> {
  return {
    totalItemsCount: response.metadata.totalCount,
    items: response.vendorUsers.map(
      (user) =>
        new User({
          id: user.id,
          name: user.name,
          mobileNo: user.mobileNo,
          email: user.email,
          status: user.active ? UserStatus.ACTIVE : UserStatus.INACTIVE,
          roles: user.roles.map((role) => new UserRole(role)),
          creationDate: new Datetime(user.creationDate),
        })
    ),
  };
}
