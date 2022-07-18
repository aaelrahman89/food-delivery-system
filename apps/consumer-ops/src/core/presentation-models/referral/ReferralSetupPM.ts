import { BasePM } from '@survv/commons/core/base/BasePM';
import { BottomSheetListGroup } from '@survv/commons/core/models/ItemsList';

import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { Referral, ReferralDiscountType } from '../../models/Referral';
import { ReferralRepo } from '../../repositories/ReferralRepo';
import { createNotification } from '../../notification';

export class ReferralSetupPM extends BasePM {
  private readonly _notificationService: NotificationService;
  private readonly _referralRepo: ReferralRepo;
  referralSetup = new Referral();
  shouldOpenServicesListBottomSheet = false;

  constructor(options: ReferralListPMOptions) {
    super();
    const { referralRepo, notificationService } = options;
    this._notificationService = notificationService;
    this._referralRepo = referralRepo;
  }

  async _hydrate(): Promise<void> {
    try {
      await this._hydrateReferralSetup();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  private async _hydrateReferralSetup(): Promise<void> {
    this.referralSetup = await this._referralRepo.getReferralSetup();
  }

  showServicesList(): void {
    this.shouldOpenServicesListBottomSheet = true;
  }

  hideServicesListBottomSheet(): void {
    this.shouldOpenServicesListBottomSheet = false;
  }

  get servicesList(): BottomSheetListGroup<string>[] {
    return [
      {
        items: this.referralSetup.services.map((service, index) => ({
          id: index,
          label: service.valueOf(),
          value: service.valueOf(),
        })),
      },
    ];
  }

  get shouldShowPercentageFields(): boolean {
    return ReferralDiscountType.PERCENTAGE.equals(
      this.referralSetup.refereeDiscountType
    );
  }

  get shouldShowFixedValueFields(): boolean {
    return ReferralDiscountType.FIXED_VALUE.equals(
      this.referralSetup.refereeDiscountType
    );
  }
}

interface ReferralListPMOptions {
  notificationService: NotificationService;
  referralRepo: ReferralRepo;
}
