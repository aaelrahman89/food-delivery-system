import { PilotStatus } from '../../../core/models/Pilot';

export function pilotStatusColor(pilotStatus: PilotStatus): string {
  switch (pilotStatus.valueOf()) {
    case PilotStatus.ASSIGNED.valueOf():
      return '#F9A825';
    case PilotStatus.LOADED.valueOf():
      return '#AD1457';
    case PilotStatus.WAITING.valueOf():
      return '#EF6C00';
    case PilotStatus.COLLECTING.valueOf():
      return '#AD6B8A';
    default:
      return '#EF3744';
  }
}
