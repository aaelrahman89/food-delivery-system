import { Money } from '@survv/commons/core/models/money';

export class ErrandCharging implements ErrandChargingOptions {
  tax = new Money();
  estimatedDeliveryFee = new Money();

  constructor(options?: ErrandChargingOptions) {
    Object.assign(this, options);
  }
}

interface ErrandChargingOptions {
  tax: Money;
  estimatedDeliveryFee: Money;
}
