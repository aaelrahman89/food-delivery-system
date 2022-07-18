import { wiremock } from '../utils/wiremock';

export async function stubChargingConfigs({
  query,
  resError,
  resBody,
  statusCode = 200,
}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'get /api/v1/charging-configs',
      query,
    })
    .response({
      status: statusCode,
      body: resError ?? {
        itemValue: 'value',
        ...resBody,
      },
    });
}
