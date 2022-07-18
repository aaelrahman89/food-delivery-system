import { CatalogueItemOption } from '../../../models/CatalogueItemOption';
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
