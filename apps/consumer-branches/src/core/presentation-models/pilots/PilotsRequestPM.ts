import { BasePM } from '@survv/commons/core/base/BasePM';
import { BranchServedZones } from '../../models/Zone';
import { PilotRequest } from '../../models/PilotRequest';
import { RootPM } from '../root/RootPM';

export class PilotsRequestPM extends BasePM {
  private readonly _rootPM: RootPM;
  readonly min = 1;
  readonly max = 3;

  constructor(options: PilotsRequestPMOptions) {
    super();
    const { rootPM } = options;
    this._rootPM = rootPM;
  }

  get activePilotRequests(): PilotRequest[] {
    return this._rootPM.activePilotRequests;
  }

  get servedZones(): BranchServedZones {
    return this._rootPM.servedZones;
  }
}
interface PilotsRequestPMOptions {
  rootPM: RootPM;
}
