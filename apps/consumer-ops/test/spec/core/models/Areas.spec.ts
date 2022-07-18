import {
  Area,
  AreasErrandServiceConfigForm,
  ErrandServicePricingConfig,
} from '../../../../src/core/models/Area';
import { HoursRange } from '@survv/commons/core/models/HoursRange';
import { Money } from '@survv/commons/core/models/money';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { Time } from '@survv/commons/core/models/Time';
import { assert } from 'chai';
import { required } from '@survv/commons/core/validations/form-validators';

describe('AreasErrandServiceConfigForm', function () {
  context('allowedHours & allowedMinutes', function () {
    const hours = (function generateAllHours() {
      const tmp = [];
      for (let i = 0; i < 24; i += 1) {
        tmp.push(i);
      }
      return tmp;
    })();
    const minutes = (function generateAllMinutes() {
      const tmp = [];
      for (let i = 0; i < 60; i += 1) {
        tmp.push(i);
      }
      return tmp;
    })();

    it('all hours & minutes should be allowed if no working hours were defined', function () {
      const form = new AreasErrandServiceConfigForm();

      hours.forEach((hour) => {
        assert.isTrue(form.allowedHours(form.workingHours[0]).from(hour));
      });
      hours.forEach((hour) => {
        assert.isTrue(form.allowedHours(form.workingHours[0]).to(hour));
      });
      hours.forEach((hour) => {
        minutes.forEach((minute) => {
          assert.isTrue(
            form.allowedMinutes(form.workingHours[0]).from(minute, hour),
            `hour: ${hour} & minute: ${minute} should be allowed`
          );
        });
      });
      hours.forEach((hour) => {
        minutes.forEach((minute) => {
          assert.isTrue(
            form.allowedMinutes(form.workingHours[0]).to(minute, hour),
            `hour: ${hour} & minute: ${minute} should be allowed`
          );
        });
      });
    });
    it('should not overlap with already multiple defined working hours', function () {
      const form = new AreasErrandServiceConfigForm();

      form.workingHours = [
        {
          // basic scenario
          from: '03:00',
          to: '06:00',
        },
        {
          // from time has hours and minutes
          from: '10:30',
          to: '15:00',
        },
        {
          // to time has hours and minutes & this time range less than previous one (time slots are not sorted)
          from: '08:00',
          to: '10:30',
        },
        {
          // can define range with minutes different
          from: '07:30',
          to: '07:35',
        },
        {
          // can span to next day
          from: '22:30',
          to: '02:00',
        },
      ];

      const fromTimeReservedHours = [0, 1, 3, 4, 5, 8, 9, 11, 12, 13, 14, 23];
      const toTimeReservedHours = [0, 1, 4, 5, 9, 11, 12, 13, 14, 23];

      const fromTimeReservedMinutes = (
        hour: number,
        minute: number
      ): boolean => {
        const time = new Time(`${hour}:${minute}`);

        return (
          (time.gte('03:00') && time.lt('06:00')) ||
          (time.gte('10:30') && time.lt('15:00')) ||
          (time.gte('08:00') && time.lt('10:30')) ||
          (time.gte('07:30') && time.lt('07:35')) ||
          (time.gte('22:30') && time.lt('24:00')) ||
          (time.gte('00:00') && time.lt('02:00'))
        );
      };
      const toTimeReservedMinutes = (hour: number, minute: number): boolean => {
        const time = new Time(`${hour}:${minute}`);

        return (
          (time.gt('03:00') && time.lte('06:00')) ||
          (time.gt('10:30') && time.lte('15:00')) ||
          (time.gt('08:00') && time.lte('10:30')) ||
          (time.gt('07:30') && time.lte('07:35')) ||
          (time.gt('22:30') && time.lte('24:00')) ||
          (time.gte('00:00') && time.lte('02:00'))
        );
      };

      hours.forEach((hour) => {
        if (fromTimeReservedHours.includes(hour)) {
          assert.isFalse(
            form.allowedHours({ from: '', to: '' }).from(hour),
            `from time - hour: ${hour} should be reserved`
          );
        } else {
          assert.isTrue(
            form.allowedHours({ from: '', to: '' }).from(hour),
            `from time - hour: ${hour} should be allowed`
          );
        }
      });
      hours.forEach((hour) => {
        if (toTimeReservedHours.includes(hour)) {
          assert.isFalse(
            form.allowedHours({ from: '', to: '' }).to(hour),
            `to time - hour: ${hour} should be reserved`
          );
        } else {
          assert.isTrue(
            form.allowedHours({ from: '', to: '' }).to(hour),
            `to time - hour: ${hour} should be allowed`
          );
        }
      });

      hours.forEach((hour) => {
        minutes.forEach((minute) => {
          assert.equal(
            form.allowedMinutes({ from: '', to: '' }).from(minute, hour),
            !fromTimeReservedMinutes(hour, minute),
            `hour: ${hour} & minute: ${minute} should be allowed`
          );
        });
      });
      hours.forEach((hour) => {
        minutes.forEach((minute) => {
          assert.equal(
            form.allowedMinutes({ from: '', to: '' }).to(minute, hour),
            !toTimeReservedMinutes(hour, minute),
            `hour: ${hour} & minute: ${minute} should be allowed`
          );
        });
      });
    });
  });
  context('validators', function () {
    it('distanceScaleInMeters should be required', function () {
      const form = new AreasErrandServiceConfigForm();

      assert.equal(form.validators.distanceScaleInMeters(), required(''));

      form.distanceScaleInMeters = 10;

      assert.isTrue(form.validators.distanceScaleInMeters());
    });

    it('distanceScalePrice should be required', function () {
      const form = new AreasErrandServiceConfigForm();

      assert.equal(form.validators.distanceScalePrice(), required(''));

      form.distanceScalePrice = 10.0;

      assert.isTrue(form.validators.distanceScalePrice());
    });

    it('durationScaleInMinutes should be required', function () {
      const form = new AreasErrandServiceConfigForm();

      assert.equal(form.validators.durationScaleInMinutes(), required(''));

      form.durationScaleInMinutes = 10;

      assert.isTrue(form.validators.durationScaleInMinutes());
    });

    it('durationScalePrice should be required', function () {
      const form = new AreasErrandServiceConfigForm();

      assert.equal(form.validators.durationScalePrice(), required(''));

      form.durationScalePrice = 10.0;

      assert.isTrue(form.validators.durationScalePrice());
    });

    it('startingFee should be required', function () {
      const form = new AreasErrandServiceConfigForm();

      assert.equal(form.validators.startingFee(), required(''));

      form.startingFee = 10.0;

      assert.isTrue(form.validators.startingFee());
    });

    it('minimumTripFare should be required', function () {
      const form = new AreasErrandServiceConfigForm();

      assert.equal(form.validators.minimumTripFare(), required(''));

      form.minimumTripFare = 10.0;

      assert.isTrue(form.validators.minimumTripFare());
    });

    it('maxErrandPoints should between [1,10]', function () {
      const form = new AreasErrandServiceConfigForm();

      form.maxErrandPoints = 0;

      assert.equal(
        form.validators.maxErrandPoints(),
        'VALIDATION_MAX_ERRANDS_NOT_WITHIN_RANGE'
      );

      form.maxErrandPoints = 10;
      assert.isTrue(form.validators.maxErrandPoints());
    });
    it('workingHours always return true if form.working24Hours was true', function () {
      const form = new AreasErrandServiceConfigForm();

      form.working24Hours = true;

      assert.isTrue(form.validators.workingHours());
    });

    it('workingHours returns false if form.working24Hours was false and any of the working hours were not defined', function () {
      const form = new AreasErrandServiceConfigForm();

      form.workingHours = [{ from: '', to: '' }];
      assert.isFalse(form.validators.workingHours());

      form.workingHours = [{ from: '', to: '20:00' }];
      assert.isFalse(form.validators.workingHours());

      form.workingHours = [{ from: '20:00', to: '' }];
      assert.isFalse(form.validators.workingHours());

      form.workingHours = [{ from: '10:00', to: '12:00' }];
      assert.isTrue(form.validators.workingHours());
    });

    it('workingHours returns false if validator workingHours.from was not returning true', function () {
      const form = new AreasErrandServiceConfigForm();

      form.workingHours = [{ from: '10:00', to: '10:00' }];

      assert.isFalse(form.validators.workingHours());
    });

    it('workingHours returns false if validator workingHours.to was not returning true', function () {
      const form = new AreasErrandServiceConfigForm();

      // basic scenario
      form.workingHours = [
        { from: '02:00', to: '03:00' },
        { from: '01:00', to: '05:00' },
      ];

      assert.isFalse(form.validators.workingHours());

      // range that span next day overlaps
      form.workingHours = [
        { from: '02:00', to: '03:00' },
        { from: '20:00', to: '05:00' },
      ];

      assert.isFalse(form.validators.workingHours());

      // range that span next day overlaps another range that spans next day
      form.workingHours = [
        { from: '23:00', to: '01:00' },
        { from: '20:00', to: '05:00' },
      ];

      assert.isFalse(form.validators.workingHours());

      // success
      form.workingHours = [
        { from: '02:00', to: '13:00' },
        { from: '14:00', to: '01:00' },
      ];
      assert.isTrue(form.validators.workingHours());
    });

    it('workingHours.from validates that from time does not equal to time if both values were defined', function () {
      const form = new AreasErrandServiceConfigForm();

      form.workingHours = [{ from: '10:00', to: '10:00' }];

      assert.equal(
        form.validators['workingHours.from'](0),
        'VALIDATION_WORKING_HOURS_START_TIME_MUST_NOT_EQUALS_END_TIME'
      );
    });

    it("workingHours.to validates that the last defined working hours doesn't overlap with a previous one", function () {
      const form = new AreasErrandServiceConfigForm();

      form.workingHours = [
        { from: '02:00', to: '03:00' },
        { from: '01:00', to: '05:00' },
      ];

      assert.isTrue(form.validators['workingHours.to'](0));
      assert.equal(
        form.validators['workingHours.to'](1),
        'VALIDATION_WORKING_HOURS_MUST_NOT_OVERLAP'
      );
    });
  });
  context('mapping from Area model', function () {
    it('maps area model to AreaErrandServiceConfigForm correctly', function () {
      const area = new Area({
        id: 111,
        name: new MultilingualString({ en: 'en', ar: 'ar' }),
        cityId: 222,
        working24Hours: true,
        workingHours: [
          new HoursRange({
            from: new Time('22:00:00'),
            to: new Time('04:00:00'),
          }),
        ],
        errandServicePricingConfig: new ErrandServicePricingConfig({
          distanceScaleInMeters: 10,
          durationScaleInMinutes: 10,
          surgeCharge: 10,
          minimumTripFare: new Money({ amount: 100, currency: 'EGP' }),
          distanceScalePrice: new Money({ amount: 100, currency: 'EGP' }),
          durationScalePrice: new Money({ amount: 100, currency: 'EGP' }),
          startingFee: new Money({ amount: 100, currency: 'EGP' }),
        }),
        maxErrandPoints: 3,
      });

      const hydratedForm = AreasErrandServiceConfigForm.from(area);

      assert.deepEqual(hydratedForm.workingHours, [
        { from: '00:00:00', to: '06:00:00' },
      ]);
      assert.equal(hydratedForm.maxErrandPoints, 3);
      assert.isTrue(hydratedForm.working24Hours);
      assert.equal(hydratedForm.distanceScaleInMeters, 10);
      assert.equal(hydratedForm.durationScaleInMinutes, 10);
      assert.equal(hydratedForm.surgeCharge, 10);
      assert.equal(hydratedForm.minimumTripFare, 100);
      assert.equal(hydratedForm.distanceScalePrice, 100);
      assert.equal(hydratedForm.durationScalePrice, 100);
      assert.equal(hydratedForm.startingFee, 100);
    });
  });
});
