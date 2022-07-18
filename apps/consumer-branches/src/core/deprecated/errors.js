export default {
  // server side exceptions mapping
  survv: {
    UnAuthorizedException: 'errors.survv.unauthorized',
    InvalidTaskStatusException: 'errors.survv.invalid_task_status',
    InactiveVendorBranchException: 'errors.survv.inactive_branch',
    BranchExceedsTripsThresholdException:
      'errors.survv.reached_max_pending_trips',
    TransactionWriteConflictException: 'errors.survv.transaction_conflict',
    TrailNotReadyException: 'errors.survv.trail_not_ready',
    InsufficientBalanceException: 'errors.survv.insufficient_balance',
    NoItemHasSelectionsException: 'errors.survv.no_item_has_selections',
  },

  // required validation errors
  required: {
    branchCode: 'errors.required.branch_code',
  },

  // invalid validation errors
  invalid: {
    branchCode: 'errors.invalid.branch_code',
    missingFieldError: 'errors.invalid.missing_field',
    negativeNumberError: 'errors.invalid.negative_number',
    invalidFormError: 'errors.invalid.form_error',
  },

  // network or unhandled errors
  misc: {
    connection: 'errors.misc.connection',
    unknown: 'errors.misc.unknown',
    server: 'errors.misc.server',
    illegalOperation: 'errors.misc.illegal',
    expiredToken: 'errors.misc.expired_token',
  },
};
