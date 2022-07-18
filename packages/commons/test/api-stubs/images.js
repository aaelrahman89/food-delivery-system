import { wiremock } from '../utils/wiremock';

export async function stubImageUpload({
  referenceId,
  referenceType,
  payload,
  mimeType,
  append = false,
  resBody,
  resError,
  statusCode = 200,
}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'post /api/v1/files',
      body: {
        referenceId,
        referenceType,
        payload,
        mimeType,
        append,
      },
    })
    .response({
      status: statusCode,
      body: resError ?? {
        id: 21655293786700,
        creationDate: '2020-01-23T14:33:13.246Z',
        ...resBody,
      },
    });
}

export async function stubGetAlbum({
  referenceId,
  referenceType,
  resError,
  statusCode = 200,
}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'get /api/v1/albums',
      query: {
        referenceId,
        referenceType,
      },
    })
    .response({
      status: statusCode,
      body: resError ?? [1, 2, 3, 4, 5],
    });
}

export async function stubAlbumUpload({
  referenceId,
  referenceType,
  payload,
  mimeType,
  append = true,
  resBody,
  resError,
  statusCode = 200,
}) {
  return wiremock
    .stub()
    .request({
      requestLine: 'post /api/v1/albums',
      body: {
        referenceId,
        referenceType,
        payload,
        mimeType,
        append,
      },
    })
    .response({
      status: statusCode,
      body: resError ?? {
        id: 21655293786700,
        creationDate: '2020-01-23T14:33:13.246Z',
        ...resBody,
      },
    });
}
