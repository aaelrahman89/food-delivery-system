import arOld from './ar-old';
import { commonAr } from '@survv/commons/locales/commonAr';

export const ar = {
  ...commonAr,
  ...arOld,

  CONFIRM: 'تأكيد',
  DISCARD: 'إلغاء',
  SIGN_IN: 'تسجيل الدخول',
  BRANCH_CODE: 'كود الفرع',
  CHANGE_LANGUAGE: 'تغيير اللغة',

  CLEAR_FILTERS: 'مسح الفلتر',
  APPLY_FILTERS: 'تطبيق الفلتر',

  APP_BAR_PILOT_REQUEST_BUTTON: 'طلب طيار',

  MENU_HEADER_DELIVERY_ORDERS: 'طلبات التوصيل',
  NOTIFICATION_CHIP_SCHEDULED_ORDERS: 'طلبات بموعد محدد',
  MENU_HEADER_ONLINE_ORDERS: 'طلبات اﻷونلاين',

  MENU_ENTRY_HOME: 'الرئيسية',
  MENU_ENTRY_PILOTS: 'الطيارون',
  MENU_ENTRY_ALL_ORDERS: 'الطلبات',
  MENU_ENTRY_DAILY_CLOSING: 'تقفيل اليوم',
  MENU_ENTRY_DISPUTED_ORDERS: 'شكاوى الطلبات',
  MENU_ENTRY_ALL_ONLINE_ORDERS: 'الطلبات',
  MENU_ENTRY_CATALOGUES: 'الكتالوجات',

  NOTIFICATION_CHIP_ONLINE_ORDERS: 'طلبات اﻷونلاين',
  NOTIFICATION_CHIP_PILOTS: 'الطيارون',

  ERR_EXPIRED_TOKEN: 'انتهت الجلسة، برجاء تحديث الصفحة وإعادة تسجيل الدخول',
  ERR_INACTIVE_BRANCH: 'الفرع غير مفعل',
  ERR_MAX_TRIP_THRESHOLD_EXCEEDED:
    'فشل طلب {pilotsCount} من {failedRequestsCount} طيار بسبب وصولك للحد الأقصى للطلبات المنتظرة لطيار. برجاء إعادة المحاولة بعد عدة دقائق',
  ERR_SERVER_TRANSACTION_FAILURE:
    'فشل الخادم في معالجة العملية، برجاء إعادة المحاولة بعد لحظات',
  ERR_TRAIL_NOT_READY: 'مسار الرحلة غير جاهز للعرض',
  ERR_INSUFFICIENT_BALANCE:
    'فشل طلب {pilotsCount} من {failedRequestsCount} طيار بسبب عدم وجود رصيد كافي، برجاء إعادة شحن الرصيد',
  ERR_MAX_TASKS_PER_TRIP_THRESHOLD_EXCEEDED:
    'وصلت للحد اﻷقصى للطلبات المحملة للطيار',

  NAV_CATALOGUES_LIST: 'قائمة الكتالوجات',
  ROUTE_CATALOGUES_LIST: 'قائمة الكتالوجات',
  ROUTE_PILOTS: 'الطيارون',

  SEARCHING_SINCE: 'جارى البحث منذ',
  NUMBER_OF_DELIVERIES: 'عدد التوصيلات',
  SINCE: 'منذ',
  ETA: 'الوصول خلال',
  DURATION: 'المدة',
  ORDER_RECEIPT: 'تفاصيل الطلب',
  TABLE_ACTIONS: 'المزيد',
  TASK_DETAILS: 'تفاصيل الطلب',
  NOT_APPLICABLE: 'لا ينطبق',
  OUT_OF_ZONE: 'منطقة خارج النظام',

  TASK_DAILY_CLOSING: 'تقفيل الطلب',
  TASK_DAILY_CLOSING_STATUS_NA: 'لا ينطبق',
  TASK_DAILY_CLOSING_STATUS_PENDING: 'في انتظار المراجعة',
  TASK_DAILY_CLOSING_STATUS_CLOSED: 'مغلق',
  TASK_DAILY_CLOSING_STATUS_AUTO_CLOSED: 'مغلق تلقائيا',
  TASK_DAILY_CLOSING_CONFIRMATION_MESSAGE:
    'لا يمكنك تسجيل شكوى على الطلبات بعد التقفيل. هل أنت متأكد من رغبتك في تقفيل الطلبات التي اخترتها؟',

  DISPUTE_DETAILS: 'تفاصيل شكوى الطلب',
  DISPUTE_STATUS: 'حالة الشكوى',
  DISPUTE_CATEGORY: 'فئة الشكوى',
  DISPUTED_TIME: 'وقت الشكوى',
  DISPUTE_DESCRIPTION: 'توصيف الشكوى',
  DISPUTE_DETAILS_FALLBACK: 'هذا الطلب ليس علية شكوى',
  DISPUTE_DATE: 'تاريخ الشكوى',
  DISPUTE: 'إرسال شكوى',

  TASK_DISPUTE: 'شكوى طلب',
  TASK_DISPUTE_STATUS__04_NA: 'لا يوجد',
  TASK_DISPUTE_STATUS__01_PENDING_REVIEW: 'في إنتظار المراجعة',
  TASK_DISPUTE_STATUS__02_APPROVED: 'تم القبول',
  TASK_DISPUTE_STATUS__03_REJECTED: 'تم الرفض',

  TASK_DISPUTE_CATEGORY_LABEL: 'سبب الشكوى',
  TASK_DISPUTE_DESCRIPTION: 'المزيد من التفاصيل',
  TASK_DISPUTE_CATEGORY_NONE: 'لا يوجد',
  TASK_DISPUTE_CATEGORY_ZONE: 'منطقة التوصيل',
  TASK_DISPUTE_CATEGORY_PENALTY_CANCELLATIONS: 'غرامة الإلغاء',
  TASK_DISPUTE_CATEGORY_PILOT_WAITING_TIME: 'مدة انتظار الطيار',

  VENDOR_BALANCE_AT_RISK_MSG:
    'رصيدك الحالي قارب على الإنتهاء! برجاء إعادة شحن الحساب لتجنب توقف الخدمة.',

  ORDER_CARD_TITLE: 'رقم الطلب: {orderId}',
  ORDER_CARD_ITEMS_COUNT: 'عدد العناصر',
  ORDER_CARD_TOTAL_VALUE: 'الإجمالي',
  ORDER_CARD_REQUESTED_DATE: 'مطلوب منذ',
  ORDER_CARD_VIEW_DETAILS: 'عرض التفاصيل',
  ORDER_CARD_START_PREPARING: 'إبدأ التحضير',
  ORDER_CARD_SCHEDULED_TO: 'موعد الأوردر',

  YES: 'نعم',
  APPLY: 'تطبيق',
  CANCEL: 'إلغاء',
  CLOSE_TASKS: 'تقفيل الطلبات',

  WARNING: 'تحذير',
  DETAILS: 'التفاصيل',

  C2C_ORDER_DETAILS_CUSTOMER_DETAILS: 'معلومات العميل',
  C2C_ORDER_DETAILS_CUSTOMER_NAME: 'الإسم',
  C2C_ORDER_DETAILS_CUSTOMER_PHONE: 'رقم الموبايل',
  C2C_ORDER_DETAILS_ORDER_BRIEF: 'ملخص الطلب',
  C2C_ORDER_DETAILS_ORDER_ID: 'رقم الطلب',
  C2C_ORDER_DETAILS_CREATION_TIME: 'وقت الإنشاء',
  C2C_ORDER_DETAILS_PAYMENT_METHOD: 'طريقة الدفع',
  C2C_ORDER_DETAILS_ORDER_DETAILS: 'تفاصيل الطلب',
  C2C_ORDER_DETAILS_PILOT_ORDER: 'طلب الطيار',
  C2C_ORDER_DETAILS_ADD_ITEM: 'إضافة عنصر',

  C2C_ORDER_ITEM_FORM_ADD_ITEM: 'إضافة عنصر',
  C2C_ORDER_ITEM_FORM_DISCARD_CHANGES: 'إلغاء',
  C2C_ORDER_ITEM_FORM_SAVE_CHANGES: 'إضافة العنصر',
  C2C_ORDER_ITEM_FORM_NAME: 'الإسم',
  C2C_ORDER_ITEM_FORM_BRAND: 'العلامة التجارية',
  C2C_ORDER_ITEM_FORM_QUANTITY: 'الكمية',

  C2C_ORDER_FORM_REJECT_ORDER: 'رفض الطلب',
  C2C_ORDER_FORM_ACCEPT_ORDER: 'قبول الطلب',

  CATALOGUE_ORDERING_HOURS: 'ساعات الطلب',
  CATALOGUE_DESCRIPTION: 'الوصف',
  CATALOGUE_SECTIONS: 'الاقسام',
  CATALOGUE_SECTIONS_ITEM_PRICE: 'السعر',
  CATALOGUE_SECTIONS_ITEM_PREPARATION_TIME: 'زمن التحضير',
  CATALOGUE_SECTIONS_ITEM_PREPARATION_TIME_UNIT: 'دقيقة',
  CATALOGUE_SECTIONS_ITEM_CALORIES: 'سعرات حرارية',
  CATALOGUE_SECTIONS_ITEM_POPULAR: 'عنصر شائع',

  CATALOGUE_STATUS_DRAFT: 'مسودة',
  CATALOGUE_STATUS_READY: 'جاهزة',
  CATALOGUE_STATUS_PUBLISHED: 'تم نشرها',

  CATALOGUE_SECTIONS_SET_ITEM_AVAILABLE: 'جعل العنصر متاح',
  CATALOGUE_SECTIONS_SET_ITEM_UNAVAILABLE: 'جعل العنصر غير متاح',

  SURVV_SHOP_ORDER_DETAILS_EDIT_ORDER_ITEMS: 'تعديل عناصر الطلب',
  SURVV_SHOP_ORDER_DETAILS_CANCEL: 'إلغاء',
  SURVV_SHOP_ORDER_DETAILS_SAVE: 'حفظ',
  SURVV_SHOP_ORDER_DETAILS_CUSTOMER_DETAILS: 'بيانات العميل',
  SURVV_SHOP_ORDER_DETAILS_CUSTOMER_NAME: 'الاسم',
  SURVV_SHOP_ORDER_DETAILS_CUSTOMER_PHONE_NUMBER: 'رقم المحمول',
  SURVV_SHOP_ORDER_DETAILS_ORDER_BRIEF: 'ملخص الطلب',
  SURVV_SHOP_ORDER_DETAILS_ORDER_ID: 'رقم تعريف الطلب',
  SURVV_SHOP_ORDER_DETAILS_CREATION_TIME: 'وقت الإنشاء',
  SURVV_SHOP_ORDER_DETAILS_PAYMENT_METHOD: 'طريقة الدفع',
  SURVV_SHOP_ORDER_DETAILS_ORDER_STATUS: 'حالة الطلب',
  SURVV_SHOP_ORDER_DETAILS_ORDER_TYPE: 'نوع الطلب',
  SURVV_SHOP_ORDER_DETAILS_VENDOR_DETAILS: 'بيانات البائع',
  SURVV_SHOP_ORDER_DETAILS_VENDOR_NAME: 'الإسم',
  SURVV_SHOP_ORDER_DETAILS_VENDOR_ID: 'رقم تعريف البائع',
  SURVV_SHOP_ORDER_DETAILS_CHARGING: 'الحساب',
  SURVV_SHOP_ORDER_DETAILS_SUBTOTAL: 'المجموع الفرعي',
  SURVV_SHOP_ORDER_DETAILS_TAX: 'الضريبة',
  SURVV_SHOP_ORDER_DETAILS_DELIVERY_FEE: 'سعر التوصيل',
  SURVV_SHOP_ORDER_DETAILS_TOTAL: 'المجموع',
  SURVV_SHOP_ORDER_DETAILS_ORDER_ITEMS: 'عناصر الطلب',
  SURVV_SHOP_ORDER_DETAILS_ADD_ITEM: 'إضافة عنصر',
  SURVV_SHOP_ORDER_DETAILS_ITEMS_SELECTION_HEADER: 'إضافة عنصر',
  SURVV_SHOP_ORDER_DETAILS_ITEMS_SELECTION_SAVE: 'إضافة {quantity} عناصر',

  ORDER_DETAILS_ITEM_FORM_EDIT_ITEM: 'تعديل العنصر',
  ORDER_DETAILS_ITEM_FORM_DISPLAY_NAME: 'الإسم',
  ORDER_DETAILS_ITEM_FORM_QUANTITY: 'الكمية',
  ORDER_DETAILS_ITEM_FORM_DISCARD_CHANGES: 'إلغاء',
  ORDER_DETAILS_ITEM_FORM_SAVE_CHANGES: 'حفظ',

  ORDER_STATUS_REQUESTED: 'تم الطلب',
  ORDER_STATUS_CONFIRMED: 'تم التأكيد',
  ORDER_STATUS_SCHEDULED: 'موعد محدد',
  ORDER_STATUS_REJECTED: 'مرفوض',
  ORDER_STATUS_PILOT_REQUESTED: 'تم طلب طيار',
  ORDER_STATUS_PILOT_ASSIGNED: 'تم التعيين على طيار',
  ORDER_STATUS_COLLECTED: 'تم الاستلام من الطيار',
  ORDER_STATUS_DELIVERED: 'تم التوصيل',
  ORDER_STATUS_CANCELLED: 'تم الإلغاء',
  ORDER_STATUS_PICKUP: 'تم الاستلام من الطيار',

  ORDER_JOURNEY_TIME_STAMP: 'الوقت والتاريخ',
  ORDER_JOURNEY_DURATION: 'الزمن',
  ORDER_JOURNEY_TERMINATION_REASON: 'السبب',
  ORDER_JOURNEY_TERMINATION_REASON_TYPE: 'نوع السبب',
  ORDER_JOURNEY_REFUNDED: 'تم الإسترداد',
  ORDER_JOURNEY_TASK_ID: 'معرف الطلب',
  ORDER_JOURNEY_TRIP_ID: 'معرف الرحلة',
  ORDER_JOURNEY_PILOT_ID: 'معرف الطيار',
  ORDER_JOURNEY_ACCEPTED_BY: 'قبل من طرف',
  ORDER_JOURNEY_CANCELLED_BY: 'ألغي من طرف',
  ORDER_JOURNEY_REJECTED_BY: 'مرفوض من طرف',
  ORDER_JOURNEY_REJECTION_REASON: 'سبب الرفض',
  ORDER_JOURNEY_REJECTION_NOTES: 'ملاحظات',
  ORDER_JOURNEY_REJECTION_BUSY_FOR: 'مشغول حتى',
  ORDER_JOURNEY_CANCELLATION_REASON: 'سبب الإلغاء',
  ORDER_JOURNEY_CANCELLATION_REASON_CATEGORY: 'فئة السبب',
  ORDER_JOURNEY_COLLECTING: 'بدأ التجميع',
  ORDER_JOURNEY_COLLECTED: 'تم التجميع',

  BRANCH_ORDER_STATUS_REQUESTED: 'تم الطلب',
  BRANCH_ORDER_STATUS_CONFIRMED: 'تم التأكيد',
  BRANCH_ORDER_STATUS_SCHEDULED: 'موعد محدد',
  BRANCH_ORDER_STATUS_REJECTED: 'مرفوض',
  BRANCH_ORDER_STATUS_PILOT_REQUESTED: 'تم طلب طيار',
  BRANCH_ORDER_STATUS_COLLECTED: 'تم الاستلام من الطيار',
  BRANCH_ORDER_STATUS_DELIVERED: 'تم التوصيل',
  BRANCH_ORDER_STATUS_CANCELLED: 'تم الإلغاء',

  ORDER_TYPE_C2C: 'C2C',
  ORDER_TYPE_B2C: 'B2C',

  BRANCH_ORDER_REJECTION_REASONS_HEADER: 'اختر سبب الرفض',
  BRANCH_ORDER_REJECTION_REASONS_SEARCH: 'بحث عن سبب',

  BRANCH_BUSY_LIST_HEADER: 'الفرع',

  ITEMS_UNAVAILABLE_LIST_HEADER: 'اختر العناصر غير المتوفرة',
  ITEMS_UNAVAILABLE_NOTES: 'ملاحظات',

  REJECTION_REASON_ORDER_TYPE_B2C: 'B2C',
  REJECTION_REASON_ORDER_TYPE_ERRANDS: 'ERRANDS',

  ORDER_PAYMENT_METHOD_Cash: 'نقدي',
  ORDER_PAYMENT_METHOD_Credit: 'كرت كريديت',
  ORDER_PAYMENT_METHOD_Already_Paid: 'مدفوع مقدما',

  MISC_REQUIRED: 'مطلوب',
  MISC_SHOW_DETAILS: 'عرض التفاصيل',

  ITEM_CUSTOMIZATION_HEADER_NEW_ITEM: 'إضافة عنصر',
  ITEM_CUSTOMIZATION_BUTTON_NEW_ITEM: 'إضافة عنصر',
  ITEM_CUSTOMIZATION_HEADER_EXISTING_ITEM: 'تحديث عنصر',
  ITEM_CUSTOMIZATION_BUTTON_EXISTING_ITEM: 'حفظ التغييرات',
  ITEM_CUSTOMIZATION_LABEL_QUANTITY: 'الكمية',
  ITEM_CUSTOMIZATION_SELECTION_HEADER_MULTI:
    'اختر على الأقل {min} وبحد أقصى {max}',
  ITEM_CUSTOMIZATION_SELECTION_HEADER_SINGLE: 'اختر واحدا',

  AVAILABLE_CATALOGUE_ITEMS_BOTTOM_SHEET_HEADER: 'إضافة عنصر',
  AVAILABLE_CATALOGUE_ITEMS_BOTTOM_SHEET_SEARCH_LABEL: 'البحث عن عنصر',

  APP_UPDATE_ALERT_MESSAGE_PART_1:
    'يوجد تحديث لتطبيق SURVV. هذه التحديثات تقدم أداء أفضل ومزايا جديدة.',
  APP_UPDATE_ALERT_MESSAGE_PART_2:
    'ستقوم الصفحة بالتحديث وتفعيل التطبيق الجديد',
  APP_UPDATE_ALERT_APPLY_BUTTON_LABEL: 'تثبيت التحديثات',

  NOTIFICATION_PERMISSION_ALERT_MESSAGE_PART_1:
    "برجاء تفعيل التنبيهات و رفع صوت السماعات حتى لا تفوتك الطلبات الجديدة. إضغط '",
  NOTIFICATION_PERMISSION_ALERT_MESSAGE_PART_2: 'Allow/قبول',
  NOTIFICATION_PERMISSION_ALERT_MESSAGE_PART_3: "' عند ظهور الرسالة",

  NOTIFICATION_PERMISSION_ALERT_APPLY_BUTTON_LABEL: 'تفعيل التنبيهات',

  CATALOGUE_TABLE_HEADER_ENGLISH: 'الاسم (انجليزي)',
  CATALOGUE_TABLE_HEADER_ARABIC: 'الاسم (عربي)',

  PILOTS: 'الطيارون',
  PILOTS_PANEL: 'الطيارون',
  PILOT_STATUS_LOADED: 'يقوم بالتوصيل',
  PILOT_STATUS_ASSIGNED: 'تم إختياره',
  PILOT_STATUS_WAITING: 'منتظر',
  PILOT_STATUS_COLLECTING: 'يسجل الطلبات',

  ACTIVE_REQUESTS_ADD_ORDER: 'إضافة طلب',
  ACTIVE_REQUESTS_CANCEL: 'إلغاء',

  BRANCH_B2C_STATUS_AVAILABLE: 'متاح',
  BRANCH_B2C_STATUS_BUSY_ONE_HOUR: 'مشغول (1 ساعة)',
  BRANCH_B2C_STATUS_BUSY_TWO_HOUR: 'مشغول (2 ساعات)',
  BRANCH_B2C_STATUS_BUSY_THREE_HOUR: 'مشغول (3 ساعات)',
  BRANCH_B2C_STATUS_OUT_OF_SERVICE: 'خارج الخدمة',
  BRANCH_B2C_STATUS_OUT_OF_WORKING_HOURS: 'خارج ساعات الخدمة',

  ONLINE_ORDER_DETAILS_ORDER_BRIEF: 'ملخص الطلب',
  ONLINE_ORDER_DETAILS_ORDER_ID: 'رقم تعريف الطلب',
  ONLINE_ORDER_DETAILS_NUMBER_OF_ITEMS: 'عدد الأصناف',
  ONLINE_ORDER_DETAILS_REQUESTED_DATE: 'وقت الطلب',
  ONLINE_ORDER_DETAILS_LAST_UPDATE_DATE: 'وقت آخر تحديث',
  ONLINE_ORDER_DETAILS_PICKUP_ETA: 'موعد الإستلام',
  ONLINE_ORDER_DETAILS_SCHEDULED_TO: 'موعد الأوردر',
  ONLINE_ORDER_DETAILS_DELIVER_BY: 'توصيل بواسطة',
  ONLINE_ORDER_DETAILS_VON: 'VON',
  ONLINE_ORDER_DETAILS_CHARGING: 'الحساب',
  ONLINE_ORDER_DETAILS_SUBTOTAL: 'المجموع الفرعي',
  ONLINE_ORDER_DETAILS_TAX: 'الضريبة',
  ONLINE_ORDER_DETAILS_TOTAL: 'المجموع',
  ONLINE_ORDER_DETAILS_ORDER_ITEMS: 'عناصر الطلب',
  ONLINE_ORDER_DETAILS_REJECT: 'رفض الطلب',
  ONLINE_ORDER_DETAILS_ACCEPT: 'قبول الطلب',
  ONLINE_ORDER_DETAILS_ACCEPT_FOR_LATER: 'قبول الطلب لموعد أخر',
  ONLINE_ORDER_UNAVAILABLE_ITEMS_NOTIFICATION:
    'العناصر والتحديدات غير المتاحة مميزة باللون الأحمر',

  BUSINESS_BRANCH_NAVIGATION: 'طلب طيار من Planman',

  DELIVERY_FLEET_SURVV_FLEET: 'أسطول Survv',
  DELIVERY_FLEET_VENDOR_FLEET: 'أسطول البائع',
};
