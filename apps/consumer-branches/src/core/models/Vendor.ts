import { EnumClass } from '@survv/commons/core/models/EnumClass';
import { VendorType } from '@survv/commons/core/models/VendorType';

export class VendorPaymentRiskStatus extends EnumClass {
  _prefix: string;
  static AT_RISK = new VendorPaymentRiskStatus('_01_AT_RISK');
  static NORMAL = new VendorPaymentRiskStatus('_02_NORMAL');
  static NONE = new VendorPaymentRiskStatus('_03_NONE');
  constructor(value: string) {
    super(value);
    this._prefix = 'VENDOR_PAYMENT_RISK_STATUS';
  }
}

export class VendorDetails implements VendorDetailsProps {
  paymentRiskStatus = VendorPaymentRiskStatus.NONE;
  balanceAtRisk = false;
  vendorType = VendorType.FOOD;

  constructor(props?: VendorDetailsProps) {
    Object.assign(this, props);
    this.balanceAtRisk = VendorPaymentRiskStatus.AT_RISK.equals(
      this.paymentRiskStatus
    );
  }
}

interface VendorDetailsProps {
  paymentRiskStatus: VendorPaymentRiskStatus;
  vendorType: VendorType;
}
