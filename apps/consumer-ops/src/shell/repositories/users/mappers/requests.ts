import {
  UserCreationRequest,
  UserUpdateRequest,
} from '@survv/api/definitions/users';
import { UserForm } from '../../../../core/models/User';

export function mapUserFormToUserUpdateRequest(
  form: UserForm
): UserUpdateRequest {
  return {
    mobileNo: form.mobileNo,
    fullName: form.name,
    email: form.email,
    userRoles: form.userRoles.map((userRole) => userRole.valueOf()),
  };
}

export function mapUserFormToUserCreationRequest(
  form: UserForm
): UserCreationRequest {
  return {
    mobileNo: form.mobileNo,
    fullName: form.name,
    email: form.email,
    userRoles: form.userRoles.map((userRole) => userRole.valueOf()),
  };
}
