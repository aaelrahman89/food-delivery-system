import stringify from 'json-stable-stringify-without-jsonify';
import { storageKeys } from '@survv/commons/core/models/Storage';

const apiPath = 'api';
const apiVersion = 'v1';

function getOriginOverride() {
  const value = localStorage.getItem(storageKeys.baseUrl);
  if (!value || value === 'null') {
    return '';
  }
  return value;
}

export function createUrl(endpoint, endpointParams = null, queryParams = null) {
  let createdUrl = '';

  createdUrl = `${getOriginOverride()}/${apiPath}/${apiVersion}/${endpoint}`;

  if (endpointParams != null && typeof endpointParams == 'object') {
    Object.entries(endpointParams).forEach(([key, value]) => {
      createdUrl = createdUrl.replace(new RegExp(`:${key}`, 'g'), `${value}`);
    });
  }

  if (queryParams != null && typeof queryParams == 'object') {
    const copiedQueryParams = JSON.parse(stringify(queryParams));
    const params = new URLSearchParams();
    Object.entries(copiedQueryParams)
      .sort()
      .forEach(([key, value]) => {
        if (value != null && typeof value == 'object') {
          params.append(key, stringify(value));
        } else {
          params.append(key, value);
        }
      });
    if (params.toString().length) {
      createdUrl += `?${params.toString()}`;
    }
  }

  return createdUrl;
}

export function createConsumerUrl(
  endpoint,
  endpointParams = null,
  queryParams = null
) {
  let createdUrl = '';

  createdUrl = `${getOriginOverride()}/consumer/${apiPath}/${apiVersion}/${endpoint}`;

  if (endpointParams != null && typeof endpointParams == 'object') {
    Object.entries(endpointParams).forEach(([key, value]) => {
      createdUrl = createdUrl.replace(new RegExp(`:${key}`, 'g'), `${value}`);
    });
  }

  if (queryParams != null && typeof queryParams == 'object') {
    const copiedQueryParams = JSON.parse(stringify(queryParams));
    const params = new URLSearchParams();
    Object.entries(copiedQueryParams)
      .sort()
      .forEach(([key, value]) => {
        if (value != null && typeof value == 'object') {
          params.append(key, stringify(value));
        } else {
          params.append(key, value);
        }
      });
    if (params.toString().length) {
      createdUrl += `?${params.toString()}`;
    }
  }

  return createdUrl;
}

export const survvEndpoints = {
  BRANCHES_SIGN_IN: 'branches/sign-in',
  BRANCHES_SIGN_OUT: 'branches/:vendorBranchId/sign-out',
  BRANCH_TASK_JOURNEY: 'tasks/:taskId/timeline',
  BRANCH: 'branches/:branchId',
  VENDOR: 'vendors/:vendorId',
  ACCEPT_ORDER: 'branches/:branchId/accept-order',
  REJECT_ORDER: 'branches/:branchId/reject-order',
  BRANCH_ORDERS: 'branches/:branchId/orders',
  BRANCH_ZONES: 'branches/:branchId/served-zones',
  TASKS_FETCH: 'v1.1/tasks',
  TASKS_DAILY_CLOSING: 'tasks/daily-close',
  TASK_TRAIL: 'tasks/:taskId/trail',
  TASK_DISPUTE: 'tasks/:taskId/dispute',
  CANCEL_TRIP: 'trips/:tripId/cancel',
  REQUEST_PILOT: 'branches/:branchId/request-pilot',
  ORDER: 'orders/:orderId',
  CANCEL_PICKED_UP_TASK: 'v1.1/tasks/:taskId/cancel',
  TRIPS_FETCH: 'trips',
  TRIP_DETAILS: 'trips/:tripId',
  TRIP_TRAIL: 'trips/:tripId/trail',
  TRIP_TASKS_COUNT_UPDATE: 'trips/:tripId/tasks-count',
  TASK_LIVE_TRAIL: 'tasks/:taskId/live-trail',
  TASK_DETAILS: 'tasks/:taskId',
  IMAGE: 'images/:imageId',
  IMAGES: 'images',
  ALBUMS: 'albums',
  ORDER_JOURNEY: 'orders/:orderId/timeline',
  IMAGES_FETCH: 'images',
};
