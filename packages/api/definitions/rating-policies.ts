import { MoneyWithCurrency } from './common';

export interface RatingPolicyResponse {
  id: number;
  name: string;
  rates: {
    rate1: MoneyWithCurrency;
    rate2: MoneyWithCurrency;
    rate3: MoneyWithCurrency;
    rate4: MoneyWithCurrency;
    outOfZone: MoneyWithCurrency;
  };
}
