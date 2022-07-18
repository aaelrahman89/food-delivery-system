import { wiremock } from '../utils/wiremock';

export async function stubVendorUserRegistration({
  vendorUserId,
  code,
  username,
  password,
  resError,
  resBody,
  statusCode = 200,
}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'post /api/v1/vendor-users/:vendorUserId/register',
      params: {
        vendorUserId,
      },
      body: {
        code,
        username,
        password,
      },
    })
    .response({
      status: statusCode,
      body: resError ?? {
        vendorUserId,
        status: 'Registered',
        authToken: 'authToken',
        vendorId: 4789631,
        ...resBody,
      },
    });
}

export async function stubVendorUserCodeCheck({
  vendorUserId,
  code,
  resError,
  statusCode = 200,
}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'get /api/v1/vendor-users/:vendorUserId/codes/:code/valid',
      params: {
        vendorUserId,
        code,
      },
    })
    .response({
      status: statusCode,
      body: resError ?? undefined,
    });
}

export async function stubVendorUserLogin({
  username,
  password,
  resError,
  resBody,
  statusCode = 200,
}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'post /api/v1/vendor-users/sign-in',
      body: {
        username,
        password,
      },
    })
    .response({
      status: statusCode,
      body: resError ?? {
        vendorUserId: 4671124,
        authToken: 'authTokenString',
        vendorId: 78913,
        ...resBody,
      },
    });
}

export async function stubVendorUserDetailsRetrieval({
  vendorUserId,
  resError,
  resBody,
  statusCode = 200,
}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'get /api/v1/vendor-users/:vendorUserId',
      params: { vendorUserId },
    })
    .response({
      status: statusCode,
      body: resError ?? {
        title: 'Branch Manager',
        name: 'name',
        mobileNo: '134694992',
        email: 'test@vg.com',
        vendorId: 2165529378315486700,
        vendorLabel: 'KFC',
        ...resBody,
      },
    });
}
