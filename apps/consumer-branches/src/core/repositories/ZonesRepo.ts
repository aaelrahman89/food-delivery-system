import { BranchServedZones } from '../models/Zone';

export interface ZonesRepo {
  getServedZones(): Promise<BranchServedZones>;
}
