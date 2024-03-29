export const backendExceptionCodes = Object.freeze({
  PilotNotInHubRadiusException: 'PilotNotInHubRadiusException',
  InactiveVendorBranchException: 'InactiveVendorBranchException',
  PilotHasReachedTasksException: 'PilotHasReachedTasksException',
  InactiveVendorException: 'InactiveVendorException',
  NoOngoingTripException: 'NoOngoingTripException',
  NoPendingCollectionTasksOnTripException:
    'NoPendingCollectionTasksOnTripException',
  UnSupportedAppVersionException: 'UnSupportedAppVersionException',
  MissingParameterException: 'MissingParameterException',
  InvalidMobileNumberFormatException: 'InvalidMobileNumberFormatException',
  NotFoundException: 'NotFoundException',
  FieldUpdateException: 'FieldUpdateException',
  TaskWithVONAlreadyExistsException: 'TaskWithVONAlreadyExistsException',
  MobileNumberNotFoundException: 'MobileNumberNotFoundException',
  MobileNumberAlreadyExistsException: 'MobileNumberAlreadyExistsException',
  UnAuthorizedException: 'UnAuthorizedException',
  InvalidPilotStatusException: 'InvalidPilotStatusException',
  PilotLocationNotFoundException: 'PilotLocationNotFoundException',
  ImageNotFoundException: 'ImageNotFoundException',
  InvalidParameterException: 'InvalidParameterException',
  StaffIdNotFoundException: 'StaffIdNotFoundException',
  StaffIdAlreadyExistsException: 'StaffIdAlreadyExistsException',
  InvalidSearchCriteriaException: 'InvalidSearchCriteriaException',
  HubLabelAlreadyReserved: 'HubLabelAlreadyReserved',
  UserEmailAlreadyExistsException: 'UserEmailAlreadyExistsException',
  SurvvException: 'SurvvException',
  ParseException: 'ParseException',
  VendorLabelAlreadyReserved: 'VendorLabelAlreadyReserved',
  InvalidEmailFormatException: 'InvalidEmailFormatException',
  VendorBranchLabelAlreadyReserved: 'VendorBranchLabelAlreadyReserved',
  TripNotFulfilledException: 'TripNotFulfilledException',
  InvalidTaskStatusException: 'InvalidTaskStatusException',
  InvalidLoginDataException: 'InvalidLoginDataException',
  PilotNotAssignedToOneTask: 'PilotNotAssignedToOneTask',
  UnclassifiedError: 'UnclassifiedError',
  WebClientOperationException: 'WebClientOperationException',
  TaskDoesNotBelongToCustomer: 'TaskDoesNotBelongToCustomer',
  TaskAlreadyLinkedException: 'TaskAlreadyLinkedException',
  TaskIsNotClosedException: 'TaskIsNotClosedException',
  TaskIsNotDestinationPinned: 'TaskIsNotDestinationPinned',
  RequestedTasksCountNotAllowed: 'RequestedTasksCountNotAllowed',
  UserNotFoundByActivationToken: 'UserNotFoundByActivationToken',
  BranchExceedsTripsThresholdException: 'BranchExceedsTripsThresholdException',
  PilotIsInactiveException: 'PilotIsInactiveException',
  CanNotDeactivatePilotException: 'CanNotDeactivatePilotException',
  SMSServiceException: 'SMSServiceException',
  MapsApiException: 'MapsApiException',
  NoAttendanceException: 'NoAttendanceException',
  CanNotEndShiftException: 'CanNotEndShiftException',
  CanNotStartShiftException: 'CanNotStartShiftException',
  TrailNotReadyException: 'TrailNotReadyException',
  CanNotEndWorkSession: 'CanNotEndWorkSession',
  CanNotStartWorkSession: 'CanNotStartWorkSession',
  CanNotGoOnlineException: 'CanNotGoOnlineException',
  CanNotGoOfflineException: 'CanNotGoOfflineException',
  MaxShiftsThresholdException: 'MaxShiftsThresholdException',
  NoShiftsException: 'NoShiftsException',
  TransactionWriteConflictException: 'TransactionWriteConflictException',
  CategoryTitleAlreadyExistsException: 'CategoryTitleAlreadyExistsException',
  CatalogueTitleAlreadyExistsException: 'CatalogueTitleAlreadyExistsException',
  NoSelectionException: 'NoSelectionException',
  ItemAlreadyArchivedException: 'ItemAlreadyArchivedException',
  ItemAlreadyUnarchivedException: 'ItemAlreadyUnarchivedException',
  InvalidCatalogueStatusException: 'InvalidCatalogueStatusException',
  OptionSelectionsShouldNotBeEmpty: 'OptionSelectionsShouldNotBeEmpty',
  ShiftAlreadyClosedException: 'ShiftAlreadyClosedException',
  ItemTitleAlreadyExistsException: 'ItemTitleAlreadyExistsException',
  InconsistentCatalogueException: 'InconsistentCatalogueException',
  MaxTrialsReachedException: 'MaxTrialsReachedException',
  InvalidVerificationCodeException: 'InvalidVerificationCodeException',
  ExpiredVerificationCodeException: 'ExpiredVerificationCodeException',
  TryAgainAfterFewSecondsException: 'TryAgainAfterFewSecondsException',
  TagsNotFoundException: 'TagsNotFoundException',
  InvalidMonetaryValueException: 'InvalidMonetaryValueException',
  CuisinesNotFoundException: 'CuisinesNotFoundException',
  HubsDoNotBelongToAreaException: 'HubsDoNotBelongToAreaException',
  ZonesDoNotBelongToAreaException: 'ZonesDoNotBelongToAreaException',
  AreaZoneVersionNotConsistent: 'AreaZoneVersionNotConsistent',
  ZonePolygonNotValidException: 'ZonePolygonNotValidException',
  PointDoesNotBelongToZoneException: 'PointDoesNotBelongToZoneException',
  CityDoesNotBelongToCountryException: 'CityDoesNotBelongToCountryException',
  AreaDoesNotBelongToCityException: 'AreaDoesNotBelongToCityException',
  ZoneNameIsEmptyException: 'ZoneNameIsEmptyException',
  ZoneDoesNotExistByNameException: 'ZoneDoesNotExistByNameException',
  CartIsLinkedToAnotherCustomerException:
    'CartIsLinkedToAnotherCustomerException',
  CustomerAlreadyHasCartException: 'CustomerAlreadyHasCartException',
  CartIsNotLinkedToCustomerException: 'CartIsNotLinkedToCustomerException',
  InvalidNaturalNumberException: 'InvalidNaturalNumberException',
  ItemIsArchivedException: 'ItemIsArchivedException',
  BranchIsOutOfOrderHoursException: 'BranchIsOutOfOrderHoursException',
  CatalogueIsOutOfOrderHoursException: 'CatalogueIsOutOfOrderHoursException',
  ItemIsNotServedByZoneException: 'ItemIsNotServedByZoneException',
  ZoneNamesAlreadyReserved: 'ZoneNamesAlreadyReserved',
  InvalidBranchOrderFlagException: 'InvalidBranchOrderFlagException',
  HoursRangeIsNotValidException: 'HoursRangeIsNotValidException',
  ItemAlreadyAvailableException: 'ItemAlreadyAvailableException',
  ItemAlreadyUnAvailableException: 'ItemAlreadyUnAvailableException',
  MissingHubIdsException: 'MissingHubIdsException',
  MissingRateIdsException: 'MissingRateIdsException',
  ZoneRateConfigDoesNotExistException: 'ZoneRateConfigDoesNotExistException',
  NoOpenUnreachablePilotLog: 'NoOpenUnreachablePilotLog',
  TokenDoesNotBelongToPilotException: 'TokenDoesNotBelongToPilotException',
  InvalidSubscriptionStatusException: 'InvalidSubscriptionStatusException',
  InvalidPrepaidFlagException: 'InvalidPrepaidFlagException',
  InactiveVendorUserException: 'InactiveVendorUserException',
  VendorUserRegistrationStatusMismatchException:
    'VendorUserRegistrationStatusMismatchException',
  InvalidTrackingSMSFlagException: 'InvalidTrackingSMSFlagException',
});

export function stubBackendException({
  code = 'PilotNotInHubRadiusException',
  args = { additionalProp1: {} },
  devDetails = 'backend error',
} = {}) {
  return {
    code,
    args,
    devDetails,
    stackTraceId: 1234567,
    trace: {
      exceptionClass: 'string',
      message: 'string',
      stackTrace: ['string'],
    },
  };
}
