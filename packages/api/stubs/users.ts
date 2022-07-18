import {
  AuthActionResponse,
  ListUsersResponse,
  UserCreationResponse,
  UserDetailsResponse,
} from '../definitions/users';

export function listUsersResponseStub(): ListUsersResponse {
  return {
    metadata: {
      skipped: 0,
      limit: 0,
      totalCount: 0,
      totalReturned: 0,
    },
    users: [
      {
        id: 2165529378315486700,
        fullName: '123AB',
        mobileNo: '123AB',
        email: '123AB',
        active: true,
        userRoles: ['OpsManager'],
        lastUpdateDate: '2018-09-01T18:04:53.178Z',
        creationDate: '2018-09-01T18:04:53.178Z',
      },
    ],
  };
}

// GET /users/{id}
export function userDetailsResponseStub(): UserDetailsResponse {
  return {
    id: 216552937,
    fullName: '123AB',
    mobileNo: '123AB',
    email: '123AB',
    active: true,
    userRoles: ['OpsManager'],
    lastUpdateDate: '2018-09-01T18:04:53.178Z',
    creationDate: '2018-09-01T18:04:53.178Z',
  };
}

export function authorizeActionResponseStub(): AuthActionResponse {
  return {
    token:
      'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJKb2UifQ.1KP0SsvENi7Uz1oQc07aXTL7kpQG5jBNIybqr60AlD4',
  };
}

export function userCreationResponseStub(): UserCreationResponse {
  return {
    id: 216552937,
    fullName: '123AB',
    mobileNo: '123AB',
    email: '123AB',
    activationToken: 'ajsoidaxxas12',
  };
}
