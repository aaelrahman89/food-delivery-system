let billingDay = 26;

function twoDigits(value) {
  return String(value).padStart(2, '0');
}

export class MonthlyBillingCycle {
  constructor({ month, year }) {
    this.month = month;
    this.year = year;
  }

  valueOf() {
    return Number(`${this.year}${twoDigits(this.month)}`);
  }

  get startDate() {
    const startDate = new Date();
    // must be in this order, otherwise it will have unpredictable behavior
    startDate.setHours(6, 0, 0, 0);
    startDate.setDate(billingDay);
    startDate.setMonth(this.month - 1);
    startDate.setFullYear(this.year);

    return startDate;
  }

  get endDate() {
    const endDate = new Date();
    // must be in this order, otherwise it will have unpredictable behavior
    endDate.setHours(5, 59, 59, 999);
    endDate.setDate(billingDay);
    endDate.setMonth(this.month);
    if (this.month == 12) {
      endDate.setFullYear(this.year + 1);
    } else {
      endDate.setFullYear(this.year);
    }

    return endDate;
  }

  toString() {
    const startDateTime = this.startDate;

    const endDateTime = new Date(this.endDate.getTime() - 24 * 60 * 60 * 1000);

    return `${startDateTime.getFullYear()}-${twoDigits(
      startDateTime.getMonth() + 1
    )}-${twoDigits(
      startDateTime.getDate()
    )} -> ${endDateTime.getFullYear()}-${twoDigits(
      endDateTime.getMonth() + 1
    )}-${twoDigits(endDateTime.getDate())}`;
  }

  static upcomingBillingCycle() {
    const { month, year } = MonthlyBillingCycle.currentBillingCycle();

    if (month === 12) {
      return new MonthlyBillingCycle({ month: 1, year: year + 1 });
    }

    return new MonthlyBillingCycle({
      month: month + 1,
      year,
    });
  }

  static configureBillingDay(day) {
    billingDay = Number(day);
  }

  static currentBillingCycle() {
    return MonthlyBillingCycle.fromDate(new Date(Date.now()));
  }

  static fromDate(date) {
    if (!(date instanceof Date)) {
      throw new Error(`expected Date but got ${typeof date}`);
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const { startDate } = new MonthlyBillingCycle({ year, month });

    let workdayMonth = month;
    let workdayYear = year;

    if (date < startDate) {
      workdayMonth = month - 1;
      if (workdayMonth === 0) {
        workdayMonth = 12;
        workdayYear = year - 1;
      }
    }

    return new MonthlyBillingCycle({
      month: workdayMonth,
      year: workdayYear,
    });
  }
}
