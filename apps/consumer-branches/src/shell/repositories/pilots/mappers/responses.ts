import { Datetime } from '@survv/commons/core/utils/datetime';
import {
  ImageRefType,
  createImageUrl,
} from '@survv/commons/core/models/Images';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { Pilot, PilotStatus } from '../../../../core/models/Pilot';
import {
  PilotRequest,
  PilotRequestStatus,
  PilotRequestTask,
} from '../../../../core/models/PilotRequest';
import { TripsItem, TripsResponse } from '@survv/api/definitions/trips';

export function mapTripsResponseToActivePilotRequests(
  response: TripsResponse
): PilotRequest[] {
  function constructPilotData(trip: TripsItem): Pilot {
    if (trip.pilot) {
      return new Pilot({
        id: trip.pilot.id,
        name: trip.pilot.fullName,
        mobileNo: trip.pilot.mobileNo,
        status: new PilotStatus(trip.pilot.status),
        profileImage: createImageUrl({
          refId: trip.pilot.id,
          refType: ImageRefType.PILOT_PROFILE_IMAGE,
        }),
      });
    }
    return new Pilot();
  }

  function getLastStatusUpdateDate(trip: TripsItem): Datetime {
    if (trip.pilot.status === 'NONE') {
      return new Datetime(trip.creationDate);
    }
    if (trip.pilot.status === 'ASSIGNED' || trip.pilot.status === 'WAITING') {
      return new Datetime(trip.assignmentDate);
    }
    return new Datetime(trip.pendingCollectionDate);
  }

  function shouldShowElapsedTime(trip: TripsItem): boolean {
    if (
      trip.status === 'PENDING' ||
      trip.status === 'REQUESTED' ||
      trip.status === 'ASSIGNED'
    ) {
      return true;
    }
    return false;
  }

  return response.trips.map(
    (trip) =>
      new PilotRequest({
        id: trip.id,
        pilot: constructPilotData(trip),
        tasks: trip.tasks.map(
          (task) =>
            new PilotRequestTask({
              id: task.taskId,
              zoneName: new MultilingualString({
                en: task.branchSelectedZoneName.en,
                ar: task.branchSelectedZoneName.ar,
              }),
            })
        ),
        hasAssignedPilot: trip.pilot.id > 0,
        status: new PilotRequestStatus(trip.status),
        lastStatusUpdateDate: getLastStatusUpdateDate(trip),
        creationDate: new Datetime(trip.creationDate),
        shouldShowElapsedTime: shouldShowElapsedTime(trip),
      })
  );
}
