import BaseProcessor from '../base/BaseProcessor';
import Clock from '../etc/Clock';
import Duration from '../etc/Duration';
import NetworkService from '../../../shell/services-deprecated/network/NetworkService';
import PilotStatus from './PilotStatus';
import TripStatus from '../../models/TripStatus';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import { createUrl, survvEndpoints } from '../survv.nc';

class ActiveRequestsProcessor extends BaseProcessor {
  constructor() {
    super();
    this.filter = null;
  }

  async process() {
    this.filter = {
      sortBy: 'creationDate',
      sortType: 'desc',
      criteria: JSON.stringify({
        vendorBranchId: await authTokenRepo.getUserId(),
        status: ['OPENED', 'ASSIGNED', 'REQUESTED', 'PENDING'],
      }),
    };

    const requestUrl = createUrl(survvEndpoints.TRIPS_FETCH, {}, this.filter);
    const activeRequests = await NetworkService.get(requestUrl);

    return activeRequests.map((request) => {
      const mappedRequest = { ...request };
      if (request.pilot) {
        mappedRequest.pilot.imageUrl = createUrl(
          survvEndpoints.IMAGES,
          {},
          {
            referenceType: 'pilotProfileImage',
            referenceId: request.pilot.id,
          }
        );
        mappedRequest.pilot.status = new PilotStatus({
          value: request.pilot.status,
        });
      }

      mappedRequest.eta = new Duration({
        value: request.eta,
      });

      mappedRequest.status = new TripStatus({ value: request.status });

      if (Clock.greaterThan(request.creationDate, request.assignmentDate)) {
        mappedRequest.lastStatusElapsedTime = Clock.elapsedTime({
          date: request.creationDate,
        });
      } else if (
        Clock.greaterThan(request.assignmentDate, request.pendingCollectionDate)
      ) {
        mappedRequest.lastStatusElapsedTime = Clock.elapsedTime({
          date: request.assignmentDate,
        });
      } else {
        mappedRequest.lastStatusElapsedTime = Clock.elapsedTime({
          date: request.pendingCollectionDate,
        });
      }

      return mappedRequest;
    });
  }
}

export default ActiveRequestsProcessor;
