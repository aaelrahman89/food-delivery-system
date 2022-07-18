import {
  TaxTierCreationRequest,
  TaxTierUpdateRequest,
} from '@survv/api/definitions/tax-tiers';
import { TaxTierForm } from '../../../../core/models/TaxTier';

export function mapTaxTierFormToTaxTierCreationRequest(
  taxTierForm: TaxTierForm
): TaxTierCreationRequest {
  return {
    name: {
      en: taxTierForm.displayName.en,
      ar: taxTierForm.displayName.ar,
    },
    percentage: taxTierForm.percentage,
  };
}

export function mapTaxTierFormToTaxTierUpdateRequest(
  taxTierForm: TaxTierForm
): TaxTierUpdateRequest {
  return {
    name: {
      en: taxTierForm.displayName.en,
      ar: taxTierForm.displayName.ar,
    },
    percentage: taxTierForm.percentage,
  };
}
