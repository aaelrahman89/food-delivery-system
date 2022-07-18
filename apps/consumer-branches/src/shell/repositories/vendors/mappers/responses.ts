import {
  VendorDetails,
  VendorPaymentRiskStatus,
} from '../../../../core/models/Vendor';
import { VendorDetailsResponse } from '@survv/api/definitions/vendors';
import { VendorType } from '@survv/commons/core/models/VendorType';

export function mapVendorDetailsResponseToVendorDetails(
  vendorDetails: VendorDetailsResponse
): VendorDetails {
  return new VendorDetails({
    vendorType: new VendorType(vendorDetails.type),
    paymentRiskStatus: new VendorPaymentRiskStatus(
      vendorDetails.paymentRiskStatus
    ),
  });
}
