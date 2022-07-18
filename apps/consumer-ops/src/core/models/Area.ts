import { BaseForm } from '@survv/commons/core/models/Forms';
import { EntityId } from '@survv/commons/core/types';
import { EnumClass } from '@survv/commons/core/models/EnumClass';
import {
  FormValidationResult,
  required,
} from '@survv/commons/core/validations/form-validators';
import { HoursRange } from '@survv/commons/core/models/HoursRange';
import { Money } from '@survv/commons/core/models/money';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { Time } from '@survv/commons/core/models/Time';
import { Validators } from '@survv/commons/core/base/BasePM';

export class DispatchingServiceLevel extends EnumClass {
  protected readonly _prefix: string;
  static HUB = new DispatchingServiceLevel('HUB');
  static AREA = new DispatchingServiceLevel('AREA');

  constructor(value: string) {
    super(value);
    this._prefix = 'DISPATCHING_SERVICE_LEVEL';
  }
}

export class DispatchingServiceType extends EnumClass {
  protected readonly _prefix: string;
  static B2B = new DispatchingServiceType('B2B');
  static B2C = new DispatchingServiceType('B2C');
  static C2C = new DispatchingServiceType('C2C');
  static NONE = new DispatchingServiceType('NONE');

  constructor(value: string) {
    super(value);
    this._prefix = 'DISPATCHING_SERVICE_TYPE';
  }
}

export class ErrandServicePricingConfig
  implements ErrandServicePricingConfigOptions
{
  distanceScaleInMeters = 0;
  distanceScalePrice = new Money();
  durationScaleInMinutes = 0;
  durationScalePrice = new Money();
  startingFee = new Money();
  minimumTripFare = new Money();
  surgeCharge = 1;

  constructor(options?: ErrandServicePricingConfigOptions) {
    Object.assign(this, options);
  }
}

export class Area implements AreaOptions {
  id: EntityId = 0;
  name = new MultilingualString();
  cityId: EntityId = 0;
  cityName = new MultilingualString();
  dispatchingConfigs: AreaDispatchingServiceConfig[] = [];
  errandServicePricingConfig = new ErrandServicePricingConfig();
  workingHours: HoursRange[] = [];
  working24Hours = false;
  maxErrandPoints = 2;

  constructor(options?: AreaOptions) {
    Object.assign(this, options);
  }
}

export class AreasErrandServiceConfigForm
  extends BaseForm
  implements AreasErrandServiceConfigFormInputs
{
  distanceScaleInMeters = 0;
  distanceScalePrice = 0;
  durationScaleInMinutes = 0;
  durationScalePrice = 0;
  startingFee = 0;
  minimumTripFare = 0;
  surgeCharge = 1;
  workingHours = [{ from: '', to: '' }];
  working24Hours = false;
  maxErrandPoints = 2;

  protected _initialValues = {
    distanceScaleInMeters: 0,
    distanceScalePrice: 0,
    durationScaleInMinutes: 0,
    durationScalePrice: 0,
    startingFee: 0,
    minimumTripFare: 0,
    surgeCharge: 1,
    workingHours: [{ from: '', to: '' }],
    working24Hours: false,
    maxErrandPoints: 2,
  };

  constructor(options?: AreasErrandServiceConfigFormOptions) {
    super();
    this._init(options);
  }

  static from(area: Area): AreasErrandServiceConfigForm {
    return new AreasErrandServiceConfigForm({
      formInputs: {
        distanceScaleInMeters:
          area.errandServicePricingConfig.distanceScaleInMeters,
        distanceScalePrice:
          area.errandServicePricingConfig.distanceScalePrice.valueOf(),
        durationScaleInMinutes:
          area.errandServicePricingConfig.durationScaleInMinutes,
        durationScalePrice:
          area.errandServicePricingConfig.durationScalePrice.valueOf(),
        startingFee: area.errandServicePricingConfig.startingFee.valueOf(),
        minimumTripFare:
          area.errandServicePricingConfig.minimumTripFare.valueOf(),
        surgeCharge: area.errandServicePricingConfig.surgeCharge,
        workingHours:
          area.workingHours.length > 0
            ? area.workingHours.map((wh) => ({
                from: wh.from.toLocalTime(),
                to: wh.to.toLocalTime(),
              }))
            : [{ from: '', to: '' }],
        working24Hours: area.working24Hours,
        maxErrandPoints: area.maxErrandPoints,
      },
    });
  }

  allowedHours(workingHours: WorkingHours): WorkingHoursAllowedHours {
    const workingHoursExcludedGivenOne = this.workingHours.filter(
      (wh) => wh.from !== workingHours.from && wh.to !== workingHours.to
    );
    return {
      from: (hour: number): boolean => {
        let isAllowed = true;
        workingHoursExcludedGivenOne.forEach((val) => {
          if (new Time(val.from).lt(val.to)) {
            const time = new Time(`${hour}:00`);
            const [valHourTo] = val.to.split(':');
            if (time.gte(val.from) && time.lt(`${valHourTo}:00`)) {
              isAllowed = false;
            }
          } else {
            const time = new Time(`${hour}:00`);
            const to1 = '24:00';
            const from2 = '00:00';
            const [to2] = val.to.split(':');
            if (time.gte(val.from) && time.lt(to1)) {
              isAllowed = false;
            }
            if (time.gte(from2) && time.lt(`${to2}:00`)) {
              isAllowed = false;
            }
          }
        });

        return isAllowed;
      },
      to: (hour: number): boolean => {
        let isAllowed = true;
        workingHoursExcludedGivenOne.forEach((val) => {
          if (new Time(val.from).lt(val.to)) {
            const time = new Time(`${hour}:00`);
            const [valHourFrom] = val.from.split(':');
            const [valHourTo] = val.to.split(':');
            if (time.gt(`${valHourFrom}:00`) && time.lt(`${valHourTo}:00`)) {
              isAllowed = false;
            }
          } else {
            const time = new Time(`${hour}:00`);
            const to1 = '24:00';
            const from2 = '00:00';
            const [from1] = val.from.split(':');
            const [to2] = val.to.split(':');
            if (time.gt(`${from1}:00`) && time.lt(to1)) {
              isAllowed = false;
            }
            if (time.gte(from2) && time.lt(`${to2}:00`)) {
              isAllowed = false;
            }
          }
        });

        return isAllowed;
      },
    };
  }

  allowedMinutes(workingHours: WorkingHours): WorkingHoursAllowedMinutes {
    const workingHoursExcludedGivenOne = this.workingHours.filter(
      (wh) => wh.from !== workingHours.from && wh.to !== workingHours.to
    );

    return {
      from: (minutes: number, hour: number): boolean => {
        let isAllowed = true;
        workingHoursExcludedGivenOne.forEach((val) => {
          if (new Time(val.from).lt(val.to)) {
            const time = new Time(`${hour}:${minutes}`);
            if (time.gte(val.from) && time.lt(val.to)) {
              isAllowed = false;
            }
          } else {
            const time = new Time(`${hour}:${minutes}`);
            const to1 = '24:00';
            const from2 = '00:00';
            if (time.gte(val.from) && time.lt(to1)) {
              isAllowed = false;
            }
            if (time.gte(from2) && time.lt(val.to)) {
              isAllowed = false;
            }
          }
        });
        return isAllowed;
      },
      to: (minutes: number, hour: number): boolean => {
        let isAllowed = true;
        workingHoursExcludedGivenOne.forEach((val) => {
          if (new Time(val.from).lt(val.to)) {
            const time = new Time(`${hour}:${minutes}`);
            if (time.gt(val.from) && time.lte(val.to)) {
              isAllowed = false;
            }
          } else {
            const time = new Time(`${hour}:${minutes}`);
            const to1 = '24:00';
            const from2 = '00:00';
            if (time.gt(val.from) && time.lte(to1)) {
              isAllowed = false;
            }
            if (time.gte(from2) && time.lte(val.to)) {
              isAllowed = false;
            }
          }
        });

        return isAllowed;
      },
    };
  }

  get validators(): Validators {
    return {
      'distanceScaleInMeters': (): FormValidationResult => {
        return required(this.distanceScaleInMeters);
      },
      'distanceScalePrice': (): FormValidationResult => {
        return required(this.distanceScalePrice);
      },
      'durationScaleInMinutes': (): FormValidationResult => {
        return required(this.durationScaleInMinutes);
      },
      'durationScalePrice': (): FormValidationResult => {
        return required(this.durationScalePrice);
      },
      'startingFee': (): FormValidationResult => {
        return required(this.startingFee);
      },
      'minimumTripFare': (): FormValidationResult => {
        return required(this.minimumTripFare);
      },
      'workingHours.from': (index: unknown): FormValidationResult => {
        if (this.working24Hours) {
          return true;
        }
        const wh = this.workingHours[index as number];

        if (!wh || !wh.from || !wh.to) {
          return true;
        }

        if (new Time(wh.from).equals(wh.to)) {
          return 'VALIDATION_WORKING_HOURS_START_TIME_MUST_NOT_EQUALS_END_TIME';
        }

        return true;
      },
      'workingHours.to': (index: unknown): FormValidationResult => {
        if (this.working24Hours) {
          return true;
        }
        const wh = this.workingHours[index as number];

        if (!wh || !wh.from || !wh.to) {
          return true;
        }

        const workingHoursExcludedGivenOne = this.workingHours
          .filter((_, i) => i !== index)
          .flatMap((workingHours) => {
            if (new Time(workingHours.from).gt(workingHours.to)) {
              return [
                {
                  from: workingHours.from,
                  to: '24:00',
                },
                {
                  from: '00:00',
                  to: workingHours.to,
                },
              ];
            }
            return [workingHours];
          });

        for (let i = 0; i < workingHoursExcludedGivenOne.length; i += 1) {
          if (
            !workingHoursExcludedGivenOne[i].from ||
            !workingHoursExcludedGivenOne[i].to
          ) {
            return true;
          }

          if (new Time(wh.from).gt(wh.to)) {
            if (
              new Time(wh.from).lte(workingHoursExcludedGivenOne[i].from) &&
              new Time('24:00').gte(workingHoursExcludedGivenOne[i].to)
            ) {
              return 'VALIDATION_WORKING_HOURS_MUST_NOT_OVERLAP';
            }
            if (
              new Time('00:00').lte(workingHoursExcludedGivenOne[i].from) &&
              new Time(wh.to).gte(workingHoursExcludedGivenOne[i].to)
            ) {
              return 'VALIDATION_WORKING_HOURS_MUST_NOT_OVERLAP';
            }
          } else if (
            new Time(wh.from).lte(workingHoursExcludedGivenOne[i].from) &&
            new Time(wh.to).gte(workingHoursExcludedGivenOne[i].to)
          ) {
            return 'VALIDATION_WORKING_HOURS_MUST_NOT_OVERLAP';
          }
        }

        return true;
      },
      'workingHours': (): boolean => {
        if (this.working24Hours) {
          return true;
        }

        if (
          !this.working24Hours &&
          (this.workingHours.some(
            (workingHour) => !workingHour.from || !workingHour.to
          ) ||
            this.workingHours.some(
              (_, index) => this.validators['workingHours.from'](index) !== true
            ) ||
            this.workingHours.some(
              (_, index) => this.validators['workingHours.to'](index) !== true
            ))
        ) {
          return false;
        }

        return true;
      },
      'maxErrandPoints': (): FormValidationResult => {
        const errorValidationMessage =
          'VALIDATION_MAX_ERRANDS_NOT_WITHIN_RANGE';
        return this.maxErrandPoints >= 1 && this.maxErrandPoints <= 10
          ? true
          : errorValidationMessage;
      },
    };
  }
}

interface AreasErrandServiceConfigFormOptions {
  formInputs: AreasErrandServiceConfigFormInputs;
}

interface AreasErrandServiceConfigFormInputs {
  distanceScaleInMeters: number;
  distanceScalePrice: number;
  durationScaleInMinutes: number;
  durationScalePrice: number;
  startingFee: number;
  minimumTripFare: number;
  surgeCharge: number;
  workingHours: WorkingHours[];
  working24Hours: boolean;
  maxErrandPoints: number;
}

interface AreaOptions {
  id: EntityId;
  name: MultilingualString;
  cityId: EntityId;
  dispatchingConfigs?: AreaDispatchingServiceConfig[];
  cityName?: MultilingualString;
  errandServicePricingConfig?: ErrandServicePricingConfig;
  workingHours?: HoursRange[];
  working24Hours?: boolean;
  maxErrandPoints?: number;
}

export interface AreaDispatchingServiceConfig {
  service: DispatchingServiceType;
  level: DispatchingServiceLevel;
  radiusInKM: number;
  stackingRadiusInKm: number;
}

interface ErrandServicePricingConfigOptions {
  distanceScaleInMeters: number;
  distanceScalePrice: Money;
  durationScaleInMinutes: number;
  durationScalePrice: Money;
  startingFee: Money;
  minimumTripFare: Money;
  surgeCharge: number;
}

interface WorkingHours {
  from: string;
  to: string;
}

interface WorkingHoursAllowedHours {
  from: (hour: number) => boolean;
  to: (hour: number) => boolean;
}

interface WorkingHoursAllowedMinutes {
  from: (minutes: number, hour: number) => boolean;
  to: (minutes: number, hour: number) => boolean;
}
