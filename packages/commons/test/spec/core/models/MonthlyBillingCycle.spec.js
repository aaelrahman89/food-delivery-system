import { $sb } from '../../../utils/sandbox';
import { MonthlyBillingCycle } from '../../../../core/models/MonthlyBillingCycle';
import { assert } from 'chai';

describe('MonthlyBillingCycle Unit', function () {
  beforeEach('set the billing cycle date', function () {
    MonthlyBillingCycle.configureBillingDay(1);
  });
  describe('valueOf()', function () {
    it('returns numerical value for comparisons', function () {
      assert.isTrue(
        new MonthlyBillingCycle({ month: 1, year: 2019 }) <
          new MonthlyBillingCycle({ month: 10, year: 2019 })
      );
    });
  });

  describe('startDateTime', function () {
    it('returns the first day of the current month at 6:00:00.000 AM', function () {
      const monthlyBillingCycle = new MonthlyBillingCycle({
        month: 11,
        year: 2020,
      });

      const expectedDate = new Date('2020-11-01');
      expectedDate.setHours(6, 0, 0, 0);

      assert.equal(
        monthlyBillingCycle.startDate.toISOString(),
        expectedDate.toISOString()
      );
    });
  });

  describe('endDateTime', function () {
    it('returns the first day of the next month at 5:59:59.999 AM', function () {
      const monthlyBillingCycle = new MonthlyBillingCycle({
        month: 8,
        year: 2019,
      });

      const expectedDate = new Date('2019-09-01');
      expectedDate.setHours(5, 59, 59, 999);

      assert.equal(
        monthlyBillingCycle.endDate.toISOString(),
        expectedDate.toISOString()
      );
    });
    it('returns the first day of the next year at 5:59:59.999 AM when in December', function () {
      const monthlyBillingCycle = new MonthlyBillingCycle({
        month: 12,
        year: 2019,
      });

      const expectedDate = new Date('2020-01-01');
      expectedDate.setHours(5, 59, 59, 999);

      assert.equal(
        monthlyBillingCycle.endDate.toISOString(),
        expectedDate.toISOString()
      );
    });
  });

  describe('toString()', function () {
    it('returns the first and last day of the month ', function () {
      const monthlyBillingCycle = new MonthlyBillingCycle({
        month: 10,
        year: 2019,
      });

      assert.equal(monthlyBillingCycle.toString(), '2019-10-01 -> 2019-10-31');
    });
  });

  describe('fromDate()', function () {
    const tests = [
      {
        description: 'handles the end of the workday on months boundaries',
        date: '2019-09-01T03:59:59.999Z',
        expectedBillingCycle: new MonthlyBillingCycle({
          month: 8,
          year: 2019,
        }),
      },
      {
        description: 'handles the start of the workday on months boundaries',
        date: '2019-09-01T04:00:00.000Z',
        expectedBillingCycle: new MonthlyBillingCycle({
          month: 9,
          year: 2019,
        }),
      },
      {
        description: 'handles the end of the workday on year boundaries',
        date: '2020-01-01T03:59:59.999Z',
        expectedBillingCycle: new MonthlyBillingCycle({
          month: 12,
          year: 2019,
        }),
      },
      {
        description: 'handles the start of the workday on year boundaries',
        date: '2020-01-01T04:00:00.000Z',
        expectedBillingCycle: new MonthlyBillingCycle({
          month: 1,
          year: 2020,
        }),
      },
      {
        description: 'handles any date',
        date: '2020-08-07T12:00:00.000Z',
        expectedBillingCycle: new MonthlyBillingCycle({
          month: 8,
          year: 2020,
        }),
      },
    ];

    tests.forEach((test) => {
      it(test.description, function () {
        const testDate = new Date(test.date);

        assert.deepEqual(
          MonthlyBillingCycle.fromDate(testDate),
          test.expectedBillingCycle
        );
      });
    });

    it('throws "expected Date but got string" error if given date was not Date object', function () {
      assert.throws(() => {
        MonthlyBillingCycle.fromDate('2019-10-01');
      }, 'expected Date but got string');
    });
  });

  describe('currentBillingCycle()', function () {
    const tests = [
      {
        description: 'handles the end of the workday on months boundaries',
        dateEpoch: new Date('2019-09-01T03:59:59.999Z').getTime(),
        expectedBillingCycle: new MonthlyBillingCycle({
          month: 8,
          year: 2019,
        }),
      },
      {
        description: 'handles the start of the workday on months boundaries',
        dateEpoch: new Date('2019-09-01T04:00:00.000Z').getTime(),
        expectedBillingCycle: new MonthlyBillingCycle({
          month: 9,
          year: 2019,
        }),
      },
      {
        description: 'handles the end of the workday on year boundaries',
        dateEpoch: new Date('2020-01-01T03:59:59.999Z').getTime(),
        expectedBillingCycle: new MonthlyBillingCycle({
          month: 12,
          year: 2019,
        }),
      },
      {
        description: 'handles the start of the workday on year boundaries',
        dateEpoch: new Date('2020-01-01T04:00:00.000Z').getTime(),
        expectedBillingCycle: new MonthlyBillingCycle({
          month: 1,
          year: 2020,
        }),
      },
      {
        description: 'handles any date',
        dateEpoch: new Date('2020-08-07T12:00:00.000Z').getTime(),
        expectedBillingCycle: new MonthlyBillingCycle({
          month: 8,
          year: 2020,
        }),
      },
    ];

    tests.forEach((test) => {
      it(test.description, function () {
        $sb.stub(Date, 'now').returns(test.dateEpoch);

        assert.deepEqual(
          MonthlyBillingCycle.currentBillingCycle(),
          test.expectedBillingCycle
        );
      });
    });
  });

  describe('upcomingBillingCycle()', function () {
    const tests = [
      {
        description: 'handles the end of the workday on months boundaries',
        dateEpoch: new Date('2019-09-01T03:59:59.999Z').getTime(),
        expectedBillingCycle: new MonthlyBillingCycle({
          month: 9,
          year: 2019,
        }),
      },
      {
        description: 'handles the start of the workday on months boundaries',
        dateEpoch: new Date('2019-09-01T04:00:00.000Z').getTime(),
        expectedBillingCycle: new MonthlyBillingCycle({
          month: 10,
          year: 2019,
        }),
      },
      {
        description: 'handles the end of the workday on year boundaries',
        dateEpoch: new Date('2020-01-01T03:59:59.999Z').getTime(),
        expectedBillingCycle: new MonthlyBillingCycle({
          month: 1,
          year: 2020,
        }),
      },
      {
        description: 'handles the start of the workday on year boundaries',
        dateEpoch: new Date('2020-01-01T04:00:00.000Z').getTime(),
        expectedBillingCycle: new MonthlyBillingCycle({
          month: 2,
          year: 2020,
        }),
      },
      {
        description: 'handles any date',
        dateEpoch: new Date('2020-08-07T12:00:00.000Z').getTime(),
        expectedBillingCycle: new MonthlyBillingCycle({
          month: 9,
          year: 2020,
        }),
      },
    ];

    tests.forEach((test) => {
      it(test.description, function () {
        $sb.stub(Date, 'now').returns(test.dateEpoch);

        assert.deepEqual(
          MonthlyBillingCycle.upcomingBillingCycle(),
          test.expectedBillingCycle
        );
      });
    });
  });
});
