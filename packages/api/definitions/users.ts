import { ListingMetadata } from './common';

export type AuthActions = string & ('UPDATE_ORDER' | 'UPDATE_TASK');

// GET /users
export type ListUsersRequest = void;
export interface ListUsersResponse {
  metadata: ListingMetadata;
  users: {
    id: number;
    fullName: string;
    mobileNo: string;
    email: string;
    active: boolean;
    userRoles: Array<UserRole>;
    lastUpdateDate: string;
    creationDate: string;
  }[];
}

export interface AuthActionRequest {
  action: AuthActions;
  password: string;
}

export interface AuthActionResponse {
  token: string;
}

export type UserRole = string &
  (
    | 'OpsUser'
    | 'OpsManager'
    | 'CatalogueUser'
    | 'CatalogueSupervisor'
    | 'AppDesigner'
    | 'Pilot'
    | 'CustomerService'
    | 'AreaManager'
    | 'Accountant'
    | 'VendorUser'
    | 'FleetManager'
    | 'Customer'
    | 'DXWand'
    | 'GuestCustomer'
    | 'VendorBranchUser'
    | 'SuperAdmin'
    | 'VendorCallCenterAgent'
    | 'VendorCallCenterSupervisor'
    | 'VendorCallCenterSuperAdmin'
  );

// POST /users/{id}
export interface UserCreationRequest {
  fullName: string;
  mobileNo: string;
  email: string;
  userRoles: Array<string>;
}
export interface UserCreationResponse {
  id: number;
  fullName: string;
  mobileNo: string;
  email: string;
  activationToken: string;
}

// PUT /users/{id}
export interface UserUpdateRequest {
  fullName: string;
  mobileNo: string;
  email: string;
  userRoles: Array<string>;
}
export type UserUpdateResponse = void;

// GET /users/{id}
export type UserDetailsRequest = void;
export interface UserDetailsResponse {
  id: number;
  fullName: string;
  mobileNo: string;
  email: string;
  active: boolean;
  userRoles: Array<string>;
  lastUpdateDate: string;
  creationDate: string;
}

export type DeactivateUserRequest = void;
export type DeactivateUserResponse = void;

export type ConfigurationsListRequest = void;
export interface ConfigurationsListResponse {
  configurations: {
    configurationKey: string;
    configurationValue: string;
  }[];
}

export interface UserSignInRequest {
  email: string;
  password: string;
}
export interface UserSignInResponse {
  id: number;
  fullName: string;
  mobileNo: string;
  email: string;
  token: string;
}

export interface CallCenterUserActivationRequest {
  activationToken: string;
  password: string;
}
export interface CallCenterUserActivationResponse {
  id: number;
  name: string;
  mobileNo: string;
  email: string;
  token: string;
  vendorId: number;
}

export interface CallCenterUserSignInRequest {
  email: string;
  password: string;
}
export interface CallCenterUserSignInResponse {
  id: number;
  name: string;
  mobileNo: string;
  email: string;
  token: string;
  vendorId: number;
}

export interface SendResetPasswordRequest {
  email: string;
}

export type SendResetPasswordResponse = void;

export interface ResetPasswordRequest {
  resetPasswordCode: string;
  password: string;
}

export interface ResetPasswordResponse {
  id: number;
  name: string;
  mobileNo: string;
  email: string;
  token: string;
  vendorId: number;
}
