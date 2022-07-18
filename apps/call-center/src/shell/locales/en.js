import { commonEn } from '@survv/commons/locales/commonEn';

export const en = {
  ...commonEn,

  // common
  LOGIN: 'Login',
  WELCOME_TO: 'Welcome To',
  CHANGE_LANGUAGE: 'عرض باللغة العربية',
  EMAIL: 'Email',
  PASSWORD: 'Password',
  CLOSE: 'Close',
  APPLY_FILTERS: 'Apply Filters',
  CLEAR_FILTERS: 'Clear Filters',
  CONFIRM: 'Confirm',
  DISCARD: 'Discard',
  SUBMIT: 'Submit',
  CREATE: 'Create',
  UPDATE: 'Update',
  SAVE_CHANGES: 'Save Changes',
  DISCARD_CHANGES: 'Discard changes',
  GENDER_MALE: 'Male',
  GENDER_FEMALE: 'Female',
  GENDER_NONE: 'None',
  ENABLED: 'Enabled',
  DISABLED: 'Disabled',
  NAME: 'Name',
  MOBILE_NUMBER: 'Mobile Number',
  TITLE: 'Title',
  STATUS: 'Status',
  TERMINATED: 'Terminated',
  ARABIC: 'Arabic',
  ENGLISH: 'English',
  TAGS: 'Tags',
  CATALOGUES: 'Catalogues',
  DESCRIPTION: 'Description',
  DISPLAY_NAME: 'Display Name',
  ORDERING_FROM: 'Ordering From',
  ORDERING_TO: 'Ordering To',
  BRANCHES: 'Branches',
  CLEAR: 'Clear',
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  NONE: 'None',
  YES: 'Yes',
  NO: 'No',
  GO_BACK: ' Go Back',
  MISC_REQUIRED: 'Required',
  MISC_SHOW_DETAILS: 'Show Details',

  // notification chip
  NOTIFICATION_CHIP_SCHEDULED_ORDERS: 'Scheduled Orders',
  NOTIFICATION_CHIP_UNASSIGNED_ORDERS: 'Unassigned Orders',

  // agent orders
  AGENT_ORDERS_LIST: 'Orders List',
  AGENT_ORDER_DETAILS: 'Order {orderId} Details',
  AGENT_QUEUED_ORDERS: 'Queued',
  AGENT_WORKING_ORDERS: 'Working',
  AGENT_SCHEDULED_ORDERS: 'Scheduled',

  // order statuses
  ORDER_STATUS_UNKNOWN: 'Unknown',
  ORDER_STATUS_REQUESTED: 'Requested',
  ORDER_STATUS_CONFIRMED: 'Accepted',
  ORDER_STATUS_REJECTED: 'Rejected',
  ORDER_STATUS_SCHEDULED: 'Scheduled',
  ORDER_STATUS_PILOT_REQUESTED: 'Pilot Requested',
  ORDER_STATUS_PILOT_ASSIGNED: 'Pilot Assigned',
  ORDER_STATUS_ASSIGNED: 'Pilot Assigned',
  ORDER_STATUS_COLLECTED: 'Collected',
  ORDER_STATUS_DELIVERED: 'Delivered',
  ORDER_STATUS_CANCELLED: 'Cancelled',
  ORDER_STATUS_PICKUP: 'Collected',

  // order details
  ONLINE_ORDER_DETAILS_CUSTOMER_DETAILS: 'Customer Details',
  ONLINE_ORDER_DETAILS_CUSTOMER_NAME: 'Name',
  ONLINE_ORDER_DETAILS_CUSTOMER_ADDRESS: 'Address',
  ONLINE_ORDER_DETAILS_CUSTOMER_PHONE_NUMBER: 'Phone Number',
  ONLINE_ORDER_DETAILS_ORDER_BRIEF: 'Order Brief',
  ONLINE_ORDER_DETAILS_SURVV_ORDER_ID: 'SURVV Order ID',
  ONLINE_ORDER_DETAILS_CREATION_TIME: 'Creation Time',
  ONLINE_ORDER_DETAILS_PAYMENT_METHOD: 'Payment Method',
  ONLINE_ORDER_DETAILS_STATUS: 'Order Status',
  ONLINE_ORDER_DETAILS_NUMBER_OF_ITEMS: 'Number of Items',
  ONLINE_ORDER_DETAILS_VON: 'VON',
  ONLINE_ORDER_DETAILS_SCHEDULED_TO: 'Scheduled To',
  ONLINE_ORDER_DETAILS_DELIVER_BY: 'Deliver By',
  ONLINE_ORDER_DETAILS_BRANCH_DETAILS: 'Branch Details',
  ONLINE_ORDER_DETAILS_BRANCH_NAME: 'Name',
  ONLINE_ORDER_DETAILS_BRANCH_AREA: 'Area',
  ONLINE_ORDER_DETAILS_ORDER_ITEMS: 'Order Items',
  ONLINE_ORDER_DETAILS_CHARGING: 'Charging',
  ONLINE_ORDER_DETAILS_SUBTOTAL: 'Subtotal',
  ONLINE_ORDER_DETAILS_TAX: 'Tax',
  ONLINE_ORDER_DETAILS_DELIVERY_FEE: 'Delivery',
  ONLINE_ORDER_DETAILS_TOTAL: 'Total',
  ONLINE_ORDER_UNAVAILABLE_ITEMS_NOTIFICATION:
    'Unavailable items and selections are highlighted in red',

  DELIVERY_FLEET_SURVV_FLEET: 'SURVV Fleet',
  DELIVERY_FLEET_VENDOR_FLEET: 'Vendor FlEET',

  // order journey
  ORDER_JOURNEY_TIME_STAMP: 'Time Stamp',
  ORDER_JOURNEY_DURATION: 'Duration',
  ORDER_JOURNEY_PLATFORM: 'Platform',
  ORDER_JOURNEY_TERMINATION_REASON: 'Reason',
  ORDER_JOURNEY_TERMINATION_REASON_TYPE: 'Reason Type',
  ORDER_JOURNEY_REFUNDED: 'Refunded',
  ORDER_JOURNEY_TASK_ID: 'Task ID',
  ORDER_JOURNEY_TRIP_ID: 'Trip ID',
  ORDER_JOURNEY_PILOT_ID: 'Pilot ID',
  ORDER_JOURNEY_ACCEPTED_BY: 'Accepted By',
  ORDER_JOURNEY_REJECTED_BY: 'Rejected By',
  ORDER_JOURNEY_REJECTION_REASON: 'Rejection reason',
  ORDER_JOURNEY_REJECTION_NOTES: 'Notes',
  ORDER_JOURNEY_REJECTION_BUSY_FOR: 'Busy for',

  ORDER_JOURNEY_CANCELLED_BY: 'Cancelled By',
  ORDER_JOURNEY_CANCELLATION_REASON: 'Cancellation Reason',
  ORDER_JOURNEY_CANCELLATION_REASON_CATEGORY: 'Reason Category',
  ORDER_JOURNEY_COLLECTING: 'Started collecting',
  ORDER_JOURNEY_COLLECTED: 'Collected',

  ORDER_JOURNEY_PICKUP:
    'Pickup point {pointLabel} {pickupPointIndex} of {pickupsCount}',

  // order card
  ORDER_CARD_TITLE: 'Order',
  ORDER_CARD_BRANCH: 'Branch',
  ORDER_CARD_ITEMS_COUNT: 'Items Count',
  ORDER_CARD_TOTAL: 'Total',
  ORDER_CARD_REQUESTED_DATE: 'Requested Since',
  ORDER_CARD_SCHEDULED_TO: 'Scheduled To',
  ORDER_CARD_VIEW_DETAILS: 'View Details',

  // set password
  PASSWORDS_MISMATCH_ERROR: 'Passwords do not match',
  PASSWORD_LENGTH_ERROR: 'Passwords should be 8 to 20 characters long',
  CONFIRM_PASSWORD: 'Re-Enter Password',
  SET_PASSWORD_MESSAGE: 'Set your password to continue',

  // branch b2c status
  BRANCH_B2C_STATUS_AVAILABLE: 'Available',
  BRANCH_B2C_STATUS_BUSY_ONE_HOUR: 'Busy (1 hour)',
  BRANCH_B2C_STATUS_BUSY_TWO_HOUR: 'Busy (2 hours)',
  BRANCH_B2C_STATUS_BUSY_THREE_HOUR: 'Busy (3 hours)',
  BRANCH_B2C_STATUS_OUT_OF_SERVICE: 'Out of Service',
  BRANCH_B2C_STATUS_OUT_OF_WORKING_HOURS: 'Out of Working Hours',

  // order empty state
  ORDER_EMPTY_STATE_MESSAGE_ONE: 'Order details will display here',
  ORDER_EMPTY_STATE_MESSAGE_TWO: "You didn't choose any orders to view",

  // payment methods
  ORDER_PAYMENT_METHOD_Cash: 'Cash',
  ORDER_PAYMENT_METHOD_Credit: 'Credit',
  ORDER_PAYMENT_METHOD_Already_Paid: 'Already Paid',

  // reset-password
  FORGOT_PASSWORD: 'Forgot Password?',
  RESET_PASSWORD: 'Reset Password',
  RESET_PASSWORD_HEADER: 'Reset Your Password',
  RESET_PASSWORD_SUB_HEADER:
    'Type your email to send you a password reset link',
  BACK_TO_LOGIN: 'Back To Login',
  PASSWORD_SENT_SUB_HEADER: 'Check you email, we have sent a reset link to ',
  EMAIL_RESEND_MESSAGE_INACTIVE: "Didn't get the Email? Resend Link in ",
  EMAIL_RESEND_MESSAGE_ACTIVE: "Didn't get the Email?",
  RESEND_LINK: 'Resend Link',

  // order actions
  ACCEPT_ORDER: 'Accept',
  REJECT_ORDER: 'Reject',
  ACCEPT_ORDER_FORM_TITLE: 'Set Info From Your System',
  ACCEPT_ORDER_FORM_ORDER_ID: 'Order Number',
  ASSIGN_TO_ME_MESSAGE: 'Click assign to me to take action on order',
  ASSIGN_TO_ME_BUTTON: 'Assign To Me',

  // supervisor menu
  MENU_HEADER_ORDERS: 'Orders',
  MENU_ENTRY_ALL_ORDERS: 'All Orders',
  MENU_ENTRY_LIVE_ORDERS: 'Live Orders',
  MENU_HEADER_MANAGE: 'Manage',
  MENU_ENTRY_AGENTS: 'Agents',
  MENU_ENTRY_BRANCHES: 'Branches',

  // supervisor orders
  SUPERVISOR_LIVE_ORDERS_LIST: 'Orders List',
  SUPERVISOR_LIVE_ORDER_DETAILS: 'Order {orderId} Details',
  SUPERVISOR_QUEUED_ORDERS: 'Queued',
  SUPERVISOR_WORKING_ORDERS: 'Working',
  SUPERVISOR_SCHEDULED_ORDERS: 'Scheduled',
  SUPERVISOR_LIVE_ORDER_DETAILS_ASSIGNED_AGENT_MESSAGE:
    'This order is assigned to {email}',
  SUPERVISOR_ALL_ORDERS_LIST: 'All Orders',
  SUPERVISOR_ALL_ORDERS_LIST_SURVV_ORDER_ID: 'Survv Order ID',
  SUPERVISOR_ALL_ORDERS_LIST_BRANCH_LABEL: 'Branch',
  SUPERVISOR_ALL_ORDERS_LIST_VON: 'VON',
  SUPERVISOR_ALL_ORDERS_LIST_STATUS: 'Status',
  SUPERVISOR_ALL_ORDERS_LIST_NUMBER_OF_ITEMS: 'No. of Items',
  SUPERVISOR_ALL_ORDERS_LIST_SCHEDULED_TO: 'Scheduled to',
  SUPERVISOR_ALL_ORDERS_LIST_PAYMENT_METHOD: 'Payment Method',
  SUPERVISOR_ALL_ORDERS_LIST_AGENT_ASSIGNED: 'Agent Assigned',
  SUPERVISOR_ALL_ORDERS_LIST_TIME_TO_ACCEPT: 'Accepted After',
  SUPERVISOR_ALL_ORDERS_LIST_CREATION_DATE: 'Creation Date',
  SUPERVISOR_ALL_ORDERS_LIST_FILTERS: 'Search & Filters',
  SUPERVISOR_ALL_ORDERS_LIST_FILTERS_VENDOR_ORDER_ID: 'Order ID',
  SUPERVISOR_ALL_ORDERS_LIST_FILTERS_CUSTOMER_ORDER_ID: 'Survv Order ID',
  SUPERVISOR_ALL_ORDERS_LIST_FILTERS_BRANCH: 'Branch',
  SUPERVISOR_ALL_ORDERS_LIST_FILTERS_STATUS: 'Status',
  SUPERVISOR_ALL_ORDERS_LIST_FILTERS_AGENT: 'Agent',
  SUPERVISOR_ALL_ORDERS_LIST_FILTERS_FROM: 'Created From',
  SUPERVISOR_ALL_ORDERS_LIST_FILTERS_TO: 'Created To',
  SUPERVISOR_TOTAL_ORDERS: 'Total ({count}) Orders',

  // supervisor branches list
  SUPERVISOR_BRANCHES_LIST: 'Branches',
  SUPERVISOR_BRANCHES_LIST_FILTERS: 'Search & Filters',
  SUPERVISOR_BRANCHES_LIST_FILTERS_NAME: 'Search by name',
  SUPERVISOR_BRANCHES_LIST_FILTERS_STATUS: 'Status',
  SUPERVISOR_BRANCHES_LIST_BRANCH_LABEL: 'Name',
  SUPERVISOR_BRANCHES_LIST_STATUS: 'Status',
  SUPERVISOR_BRANCHES_LIST_ACTIONS_UPDATE_STATUS: 'Update Status',
  SUPERVISOR_BRANCHES_LIST_ACTIONS_VIEW_CATALOGUES: 'View Catalogues',
  SUPERVISOR_BRANCHES_LIST_UPDATE_BRANCH_STATUS_FORM_TITLE:
    "Update ({label})'s Branch Status",

  // supervisor branch catalogues
  SUPERVISOR_BRANCH_CATALOGUES_LIST: 'Catalogues',
  CATALOGUE_ORDERING_HOURS: 'Ordering Hours',
  CATALOGUE_DESCRIPTION: 'Description',
  CATALOGUE_SECTIONS: 'Catalogue Sections',
  CATALOGUE_SECTIONS_ITEM_PRICE: 'Price',
  CATALOGUE_SECTIONS_ITEM_PREPARATION_TIME: 'Preparation Time',
  CATALOGUE_SECTIONS_ITEM_PREPARATION_TIME_UNIT: 'Min',
  CATALOGUE_SECTIONS_ITEM_CALORIES: 'Calories',
  CATALOGUE_SECTIONS_ITEM_POPULAR: 'Popular',
  CATALOGUE_SECTIONS_ITEM_AVAILABLE: 'Available',

  CATALOGUE_STATUS_DRAFT: 'Draft',
  CATALOGUE_STATUS_READY: 'Ready',
  CATALOGUE_STATUS_PUBLISHED: 'Published',

  CATALOGUE_SECTIONS_SET_ITEM_AVAILABLE: 'Set item available',
  CATALOGUE_SECTIONS_SET_ITEM_UNAVAILABLE: 'Set item un-available',

  CATALOGUE_TABLE_HEADER_ENGLISH: 'English Name',
  CATALOGUE_TABLE_HEADER_ARABIC: 'Arabic Name',

  // supervisor agents list
  SUPERVISOR_AGENTS_LIST: 'Agents',
  SUPERVISOR_AGENTS_LIST_NAME: 'Name',
  SUPERVISOR_AGENTS_LIST_EMAIL: 'Email',
  SUPERVISOR_AGENTS_LIST_MOBILE_NUMBER: 'Mobile Number',
  SUPERVISOR_AGENTS_LIST_STATUS: 'Status',
  SUPERVISOR_AGENTS_LIST_CREATION_DATE: 'Creation Date',
  SUPERVISOR_AGENTS_LIST_ACTIONS_ACTIVATE: 'Activate',
  SUPERVISOR_AGENTS_LIST_ACTIONS_DEACTIVATE: 'Deactivate',
  SUPERVISOR_AGENTS_LIST_ACTIONS_UPDATE: 'Update',
  SUPERVISOR_AGENTS_LIST_DIALOG_TITLE: 'Deactivate User',
  SUPERVISOR_AGENTS_LIST_DIALOG_BODY:
    'Are you sure you want to deactivate the agent "{name}" from using order taking center?',

  // user statuses
  USER_STATUS_ACTIVE: 'Active',
  USER_STATUS_INACTIVE: 'Inactive',

  // agent create and update
  SUPERVISOR_AGENTS_LIST_CREATE_AGENT: 'Create New Agent',
  AGENT_CREATION_FORM_TITLE: 'Create New Agent',
  AGENT_CREATION_FORM_NAME: 'Name',
  AGENT_CREATION_FORM_EMAIL: 'Email',
  AGENT_CREATION_FORM_MOBILE_NUMBER: 'Mobile Number',

  AGENT_UPDATE_FORM_TITLE: 'Update Agent',
  AGENT_UPDATE_FORM_NAME: 'Name',
  AGENT_UPDATE_FORM_EMAIL: 'Email',
  AGENT_UPDATE_FORM_MOBILE_NUMBER: 'Mobile Number',

  // reject order
  BRANCH_ORDER_REJECTION_REASONS_HEADER: 'Choose rejection reason',
  BRANCH_ORDER_REJECTION_REASONS_SEARCH: 'Search reasons',
  BRANCH_BUSY_LIST_HEADER: 'Branch is',
  ITEMS_UNAVAILABLE_LIST_HEADER: 'Choose Unavailable Items',
  ITEMS_UNAVAILABLE_NOTES: 'Notes',
};
