import { wiremock } from '../utils/wiremock';

export async function stubBankDetailsRetrieval({
  resError,
  resBody,
  statusCode = 200,
} = {}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'get /api/v1/banks',
    })
    .response({
      status: statusCode,
      body: resError ?? {
        id: 123654789,
        name: 'CIB Bank',
        account: '4354857546358',
        ...resBody,
      },
    });
}
