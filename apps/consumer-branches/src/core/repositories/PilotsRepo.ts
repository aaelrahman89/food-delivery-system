import { PilotRequest } from '../models/PilotRequest';

export interface PilotsRepo {
  getActivePilotRequests(): Promise<PilotRequest[]>;
}
