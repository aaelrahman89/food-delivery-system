import {
  CatalogueItemOption,
  RelatedOption,
} from '../../../models/CatalogueItemOption';
import { EntityId } from '@survv/commons/core/types';
import { OrderItemCustomization } from '../../../models/OrderItemCustomizations';

export function hasValidCustomizations(args: {
  option: CatalogueItemOption;
  customizations: OrderItemCustomization[];
}): boolean {
  const { option, customizations } = args;
  const selectionsCount = customizations.filter(
    (customization) => option.id == customization.optionId
  ).length;
  const isSelectionsCountInRange =
    selectionsCount >= option.minAllowed &&
    selectionsCount <= option.maxAllowed;

  if (option.mandatory && option.multiSelection) {
    return isSelectionsCountInRange && selectionsCount > 0;
  }
  if (option.mandatory && !option.multiSelection) {
    return selectionsCount == 1;
  }
  if (!option.mandatory && option.multiSelection && selectionsCount > 0) {
    return isSelectionsCountInRange;
  }
  if (!option.mandatory && !option.multiSelection && selectionsCount > 0) {
    return selectionsCount == 1;
  }

  return true;
}

export function isValidRelatedOptionCustomizations(args: {
  optionId: EntityId;
  selectionId: EntityId;
  customizations: OrderItemCustomization[];
  relatedOption: RelatedOption;
}): boolean {
  const { optionId, selectionId, customizations, relatedOption } = args;

  const customizationOption = customizations.find(
    (customization) =>
      customization.optionId === optionId &&
      customization.selectionId === selectionId
  );
  let selectionsCount = 0;
  if (customizationOption) {
    selectionsCount = customizationOption.relatedOptions.filter(
      (customization) => relatedOption.optionId == customization.optionId
    ).length;
  }

  const isSelectionsCountInRange =
    selectionsCount >= relatedOption.minAllowed &&
    selectionsCount <= relatedOption.maxAllowed;

  if (relatedOption.mandatory && relatedOption.multiSelection) {
    return isSelectionsCountInRange && selectionsCount > 0;
  }
  if (relatedOption.mandatory && !relatedOption.multiSelection) {
    return selectionsCount == 1;
  }
  if (
    !relatedOption.mandatory &&
    relatedOption.multiSelection &&
    selectionsCount > 0
  ) {
    return isSelectionsCountInRange;
  }
  if (
    !relatedOption.mandatory &&
    !relatedOption.multiSelection &&
    selectionsCount > 0
  ) {
    return selectionsCount == 1;
  }

  return true;
}
