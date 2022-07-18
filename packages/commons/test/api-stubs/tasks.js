import { wiremock } from '../utils/wiremock';

export async function stubTaskInfo({
  taskId,
  resError,
  resBody,
  statusCode = 200,
}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'get /api/v1/tasks/:taskId/task-info',
      params: { taskId },
    })
    .response({
      status: statusCode,
      body: resError ?? {
        id: taskId,
        ratedByCustomer: false,
        pilot: {
          id: 87951,
          mobileNo: '0102312381',
          fullName: 'Bakaka Dassa',
        },
        status: 'DELIVERED',
        lastStatusUpdateDate: '2018-09-05T19:04:53.178Z',
        cancellationReason: 'AnyReason',

        ...resBody,
      },
    });
}

export async function stubTaskPilotRating({
  taskId,
  rating,
  resError,
  statusCode = 200,
}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'post /api/v1/tasks/:taskId/rate-pilot',
      params: { taskId },
      body: { rating },
    })
    .response({
      status: statusCode,
      body: resError ?? undefined,
    });
}

export async function stubTaskPilotTrace({
  taskId,
  resError,
  resBody,
  statusCode = 200,
}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'get /api/v1.1/tasks/:taskId/live-trail',
      params: {
        taskId,
      },
    })
    .response({
      status: statusCode,
      body: resError ?? {
        pilotId: 2165529378315486700,
        movementStatus: 'NA',
        path: {
          type: 'LineString',
          coordinates: [
            [-1.43, 31.3],
            [-1.43, 31.3],
          ],
        },
        branchLocation: {
          type: 'Point',
          coordinates: [-1.43, 31.3],
        },
        customerLocation: {
          type: 'Point',
          coordinates: [-1.43, 31.3],
        },
        ...resBody,
      },
    });
}
