import { BasePM } from '@survv/commons/core/base/BasePM';
import { BranchServedZones } from '../../models/Zone';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { ZonesRepo } from '../../repositories/ZonesRepo';
import { createNotification } from '../../notification';

export class BranchServedZonesPM extends BasePM {
  private zonesRepo: ZonesRepo;
  private _notificationService: NotificationService;
  servedZones: BranchServedZones;

  constructor(options: BranchServedZonesPMOptions) {
    super();
    this.zonesRepo = options.zonesRepo;
    this._notificationService = options.notificationService;
    this.servedZones = new BranchServedZones();
  }

  async _hydrate(): Promise<void> {
    try {
      this.servedZones = await this.zonesRepo.getServedZones();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }
}

interface BranchServedZonesPMOptions {
  zonesRepo: ZonesRepo;
  notificationService: NotificationService;
}
