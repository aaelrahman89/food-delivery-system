import { commonAr } from '@survv/commons/locales/commonAr';

export const ar = {
  ...commonAr,

  // common
  LOGIN: 'دخول',
  WELCOME_TO: 'أهلا بك في',
  CHANGE_LANGUAGE: 'Show In English',
  EMAIL: 'البريد الإلكتروني',
  PASSWORD: 'كلمة السر',
  CLOSE: 'إغلاق',
  APPLY_FILTERS: 'تطبيق الفلتر',
  CLEAR_FILTERS: 'مسح الفلتر',
  CONFIRM: 'تأكيد',
  DISCARD: 'إلغاء',
  SAVE_CHANGES: 'حفظ التغييرات',
  DISCARD_CHANGES: 'إلغاء العملية',
  SUBMIT: 'حفظ',
  CREATE: 'إنشاء',
  UPDATE: 'تعديل',
  GENDER_MALE: 'ذكر',
  GENDER_FEMALE: 'أنثى',
  GENDER_NONE: 'لا يوجد',
  ENABLED: 'مفعل',
  DISABLED: 'غير مفعل',
  NAME: 'الاسم',
  MOBILE_NUMBER: 'رقم الهاتف',
  TITLE: 'اللقب',
  STATUS: 'الحالة',
  TERMINATED: 'مغلق',
  ARABIC: 'عربي',
  ENGLISH: 'إنجليزي',
  TAGS: 'العلامات',
  CATALOGUES: 'كتالوجات',
  DESCRIPTION: 'وصف',
  DISPLAY_NAME: 'الاسم الظاهر',
  ORDERING_FROM: 'متاح الطلب من',
  ORDERING_TO: 'متاح الطلب الى',
  BRANCHES: 'الفروع',
  ACTIVE: 'مفعل',
  INACTIVE: 'غير مفعل',
  NONE: 'لا يوجد',
  YES: 'نعم',
  NO: 'لا',
  GO_BACK: 'رجوع للصفحة السابقة',
  MISC_REQUIRED: 'مطلوب',
  MISC_SHOW_DETAILS: 'عرض التفاصيل',

  // notification chip
  NOTIFICATION_CHIP_SCHEDULED_ORDERS: 'الطلبات المجدولة',
  NOTIFICATION_CHIP_UNASSIGNED_ORDERS: 'الطلبات الجديدة',

  // agent orders
  AGENT_ORDERS_LIST: 'قائمة الطلبات',
  AGENT_ORDER_DETAILS: 'تفاصيل طلب {orderId}',
  AGENT_QUEUED_ORDERS: 'منتظرة',
  AGENT_WORKING_ORDERS: 'حالية',
  AGENT_SCHEDULED_ORDERS: 'بموعد',

  // order statuses
  ORDER_STATUS_UNKNOWN: 'غير معروف',
  ORDER_STATUS_REQUESTED: 'تم الطلب',
  ORDER_STATUS_CONFIRMED: 'تم التأكيد',
  ORDER_STATUS_SCHEDULED: 'موعد محدد',
  ORDER_STATUS_REJECTED: 'مرفوض',
  ORDER_STATUS_PILOT_REQUESTED: 'تم طلب طيار',
  ORDER_STATUS_PILOT_ASSIGNED: 'تم تعيين الطيار',
  ORDER_STATUS_ASSIGNED: 'تم تعيين الطيار',
  ORDER_STATUS_COLLECTED: 'تم الاستلام من الطيار',
  ORDER_STATUS_DELIVERED: 'تم التوصيل',
  ORDER_STATUS_CANCELLED: 'تم الإلغاء',
  ORDER_STATUS_PICKUP: 'تم الاستلام من الطيار',

  // order details
  ONLINE_ORDER_DETAILS_CUSTOMER_DETAILS: 'بيانات العميل',
  ONLINE_ORDER_DETAILS_CUSTOMER_NAME: 'الاسم',
  ONLINE_ORDER_DETAILS_CUSTOMER_ADDRESS: 'العنوان',
  ONLINE_ORDER_DETAILS_CUSTOMER_PHONE_NUMBER: 'رقم المحمول',
  ONLINE_ORDER_DETAILS_ORDER_BRIEF: 'ملخص الطلب',
  ONLINE_ORDER_DETAILS_SURVV_ORDER_ID: 'رقم تعريف SURVV',
  ONLINE_ORDER_DETAILS_CREATION_TIME: 'وقت الطلب',
  ONLINE_ORDER_DETAILS_PAYMENT_METHOD: 'طريقة الدفع',
  ONLINE_ORDER_DETAILS_STATUS: 'حالة الطلب',
  ONLINE_ORDER_DETAILS_NUMBER_OF_ITEMS: 'عدد العناصر',
  ONLINE_ORDER_DETAILS_VON: 'VON',
  ONLINE_ORDER_DETAILS_SCHEDULED_TO: 'محدد لموعد',
  ONLINE_ORDER_DETAILS_DELIVER_BY: 'توصيل بواسطة',
  ONLINE_ORDER_DETAILS_BRANCH_DETAILS: 'تفاصيل الفرع',
  ONLINE_ORDER_DETAILS_BRANCH_NAME: 'الإسم',
  ONLINE_ORDER_DETAILS_BRANCH_AREA: 'المنطقة',
  ONLINE_ORDER_DETAILS_ORDER_ITEMS: 'عناصر الطلب',
  ONLINE_ORDER_DETAILS_CHARGING: 'الحساب',
  ONLINE_ORDER_DETAILS_SUBTOTAL: 'المجموع الفرعي',
  ONLINE_ORDER_DETAILS_TAX: 'الضريبة',
  ONLINE_ORDER_DETAILS_DELIVERY_FEE: 'سعر التوصيل',
  ONLINE_ORDER_DETAILS_TOTAL: 'المجموع',
  ONLINE_ORDER_UNAVAILABLE_ITEMS_NOTIFICATION:
    'العناصر والتحديدات غير المتاحة مميزة باللون الأحمر',

  DELIVERY_FLEET_SURVV_FLEET: 'SURVV أسطول',
  DELIVERY_FLEET_VENDOR_FLEET: 'أسطول البائع',

  // order journey
  ORDER_JOURNEY_TIME_STAMP: 'الوقت والتاريخ',
  ORDER_JOURNEY_DURATION: 'الزمن',
  ORDER_JOURNEY_PLATFORM: 'منصة',
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

  ORDER_JOURNEY_PICKUP:
    'نقطة التقاط {pointLabel} {pickupPointIndex} من {pickupsCount}',

  // order card
  ORDER_CARD_TITLE: 'رقم الطلب',
  ORDER_CARD_BRANCH: 'الفرع',
  ORDER_CARD_ITEMS_COUNT: 'عدد العناصر',
  ORDER_CARD_TOTAL_: 'الإجمالي',
  ORDER_CARD_REQUESTED_DATE: 'مطلوب منذ',
  ORDER_CARD_SCHEDULED_TO: 'موعد الأوردر',
  ORDER_CARD_VIEW_DETAILS: 'عرض التفاصيل',

  // validation messages
  PASSWORDS_MISMATCH_ERROR: 'كلمة المرور غير متطابقة',
  PASSWORD_LENGTH_ERROR: 'عدد الاحرف في كلمة السر يجب ان تكون من 8 الى 20 حرف',
  CONFIRM_PASSWORD: 'أعد ادخال كلمة المرور',
  SET_PASSWORD_MESSAGE: 'ادخل كلمة المرور الخاصة بك للمتابعة',

  // branch b2c status
  BRANCH_B2C_STATUS_AVAILABLE: 'متاح',
  BRANCH_B2C_STATUS_BUSY_ONE_HOUR: 'مشغول (1 ساعة)',
  BRANCH_B2C_STATUS_BUSY_TWO_HOUR: 'مشغول (2 ساعات)',
  BRANCH_B2C_STATUS_BUSY_THREE_HOUR: 'مشغول (3 ساعات)',
  BRANCH_B2C_STATUS_OUT_OF_SERVICE: 'خارج الخدمة',
  BRANCH_B2C_STATUS_OUT_OF_WORKING_HOURS: 'خارج ساعات الخدمة',

  // order empty state
  ORDER_EMPTY_STATE_MESSAGE_ONE: 'تفاصيل الطلب ستظهر هنا',
  ORDER_EMPTY_STATE_MESSAGE_TWO: 'لم تقم باختيار طلب لعرضه',

  // payment methods
  ORDER_PAYMENT_METHOD_Cash: 'نقدي',
  ORDER_PAYMENT_METHOD_Credit: 'كرت كريديت',
  ORDER_PAYMENT_METHOD_Already_Paid: 'مدفوع مقدما',

  // reset-password
  FORGOT_PASSWORD: 'هل نسيت كلمة المرور؟',
  RESET_PASSWORD: 'أعد ضبط كلمة السر',
  RESET_PASSWORD_HEADER: 'أعد ضبط كلمة السر',
  RESET_PASSWORD_SUB_HEADER:
    'اكتب بريدك الإلكتروني لإرسال رابط إعادة ضبط كلمة المرور',
  BACK_TO_LOGIN: 'الرجوع الى تسجيل الدخول',
  PASSWORD_SENT_SUB_HEADER:
    'تحقق من بريدك الإلكتروني ، لقد أرسلنا رابط إعادة الضبط إلى ',
  EMAIL_RESEND_MESSAGE_INACTIVE:
    'لم تحصل على البريد الإلكتروني؟ أعد إرسال الرابط بعد ',
  EMAIL_RESEND_MESSAGE_ACTIVE: 'لم تحصل على البريد الإلكتروني؟ ',
  RESEND_LINK: 'أعد إرسال الرابط',

  // order actions
  REJECT_ORDER: 'رفض الطلب',
  ACCEPT_ORDER: 'قبول الطلب',
  ACCEPT_ORDER_FORM_TITLE: 'ضبط المعلومات الخاصة بالطلب',
  ACCEPT_ORDER_FORM_ORDER_ID: 'رقم الطلب',
  ASSIGN_TO_ME_MESSAGE: 'اضفط على تعيين عليّ لتنفيذ الأوامر على الطلب',
  ASSIGN_TO_ME_BUTTON: 'تعيين عليّ',

  // supervisor menu
  MENU_HEADER_ORDERS: 'الطلبات',
  MENU_ENTRY_ALL_ORDERS: 'جميع الطلبات',
  MENU_ENTRY_LIVE_ORDERS: 'الطلبات الحالية',
  MENU_HEADER_MANAGE: 'إدارة',
  MENU_ENTRY_AGENTS: 'موظفين الخدمة',
  MENU_ENTRY_BRANCHES: 'الفروع',

  // supervisor orders
  SUPERVISOR_LIVE_ORDERS_LIST: 'قائمة الطلبات',
  SUPERVISOR_LIVE_ORDER_DETAILS: 'تفاصيل طلب {orderId}',
  SUPERVISOR_QUEUED_ORDERS: 'منتظرة',
  SUPERVISOR_WORKING_ORDERS: 'حالية',
  SUPERVISOR_SCHEDULED_ORDERS: 'بموعد',
  SUPERVISOR_LIVE_ORDER_DETAILS_ASSIGNED_AGENT_MESSAGE:
    'هذا الطلب معين على {email}',
  SUPERVISOR_ALL_ORDERS_LIST: 'جميع الطلبات',
  SUPERVISOR_ALL_ORDERS_LIST_SURVV_ORDER_ID: 'معرف طلب Survv',
  SUPERVISOR_ALL_ORDERS_LIST_BRANCH_LABEL: 'الفرع',
  SUPERVISOR_ALL_ORDERS_LIST_VON: 'معرف طلب التاجر',
  SUPERVISOR_ALL_ORDERS_LIST_STATUS: 'الحالة',
  SUPERVISOR_ALL_ORDERS_LIST_NUMBER_OF_ITEMS: 'عدد العناصر',
  SUPERVISOR_ALL_ORDERS_LIST_SCHEDULED_TO: 'مؤجل إلى',
  SUPERVISOR_ALL_ORDERS_LIST_PAYMENT_METHOD: 'طريقة الدفع',
  SUPERVISOR_ALL_ORDERS_LIST_AGENT_ASSIGNED: 'الموظف المعين',
  SUPERVISOR_ALL_ORDERS_LIST_TIME_TO_ACCEPT: 'تم القبول بعد',
  SUPERVISOR_ALL_ORDERS_LIST_CREATION_DATE: 'تاريخ الإنشاء',
  SUPERVISOR_ALL_ORDERS_LIST_FILTERS: 'البحث والفلاتر',
  SUPERVISOR_ALL_ORDERS_LIST_FILTERS_VENDOR_ORDER_ID: 'معرف الطلب',
  SUPERVISOR_ALL_ORDERS_LIST_FILTERS_CUSTOMER_ORDER_ID: 'معرف طلب Survv',
  SUPERVISOR_ALL_ORDERS_LIST_FILTERS_BRANCH: 'الفرع',
  SUPERVISOR_ALL_ORDERS_LIST_FILTERS_STATUS: 'الحالة',
  SUPERVISOR_ALL_ORDERS_LIST_FILTERS_AGENT: 'الموظف المعين',
  SUPERVISOR_ALL_ORDERS_LIST_FILTERS_FROM: 'تاريخ الانشاء من',
  SUPERVISOR_ALL_ORDERS_LIST_FILTERS_TO: 'تاريخ الانشاء إلى',
  SUPERVISOR_TOTAL_ORDERS: 'الإجمالي ({count}) طلبات',
  SUPERVISOR_BRANCHES_LIST_UPDATE_BRANCH_STATUS_FORM_TITLE:
    'تحديث حالة فرع ({label})',

  // supervisor branches list
  SUPERVISOR_BRANCHES_LIST: 'الفروع',
  SUPERVISOR_BRANCHES_LIST_FILTERS: 'البحث والفلاتر',
  SUPERVISOR_BRANCHES_LIST_FILTERS_NAME: 'البحث بالاسم',
  SUPERVISOR_BRANCHES_LIST_FILTERS_STATUS: 'الحالة',
  SUPERVISOR_BRANCHES_LIST_BRANCH_LABEL: 'الاسم',
  SUPERVISOR_BRANCHES_LIST_STATUS: 'الحالة',
  SUPERVISOR_BRANCHES_LIST_ACTIONS_UPDATE_STATUS: 'تعديل الحالة',
  SUPERVISOR_BRANCHES_LIST_ACTIONS_VIEW_CATALOGUES: 'مشاهدة القوائم',

  // supervisor branch catalogues
  SUPERVISOR_BRANCH_CATALOGUES_LIST: 'القوائم',
  CATALOGUE_ORDERING_HOURS: 'ساعات الطلب',
  CATALOGUE_DESCRIPTION: 'الوصف',
  CATALOGUE_SECTIONS: 'الاقسام',
  CATALOGUE_SECTIONS_ITEM_PRICE: 'السعر',
  CATALOGUE_SECTIONS_ITEM_PREPARATION_TIME: 'زمن التحضير',
  CATALOGUE_SECTIONS_ITEM_PREPARATION_TIME_UNIT: 'دقيقة',
  CATALOGUE_SECTIONS_ITEM_CALORIES: 'سعرات حرارية',
  CATALOGUE_SECTIONS_ITEM_POPULAR: 'عنصر شائع',
  CATALOGUE_SECTIONS_ITEM_AVAILABLE: 'متوفر',

  CATALOGUE_STATUS_DRAFT: 'مسودة',
  CATALOGUE_STATUS_READY: 'جاهزة',
  CATALOGUE_STATUS_PUBLISHED: 'تم نشرها',

  CATALOGUE_SECTIONS_SET_ITEM_AVAILABLE: 'جعل العنصر متاح',
  CATALOGUE_SECTIONS_SET_ITEM_UNAVAILABLE: 'جعل العنصر غير متاح',

  CATALOGUE_TABLE_HEADER_ENGLISH: 'الاسم (انجليزي)',
  CATALOGUE_TABLE_HEADER_ARABIC: 'الاسم (عربي)',

  // supervisor agents list
  SUPERVISOR_AGENTS_LIST: 'موظفين الخدمة',
  SUPERVISOR_AGENTS_LIST_NAME: 'الإسم',
  SUPERVISOR_AGENTS_LIST_EMAIL: 'الإيميل',
  SUPERVISOR_AGENTS_LIST_MOBILE_NUMBER: 'رقم الموبايل',
  SUPERVISOR_AGENTS_LIST_STATUS: 'الحالة',
  SUPERVISOR_AGENTS_LIST_CREATION_DATE: 'تاريخ الإنشاء',
  SUPERVISOR_AGENTS_LIST_ACTIONS_ACTIVATE: 'تفعيل',
  SUPERVISOR_AGENTS_LIST_ACTIONS_DEACTIVATE: 'تعطيل',
  SUPERVISOR_AGENTS_LIST_ACTIONS_UPDATE: 'تعديل',
  SUPERVISOR_AGENTS_LIST_DIALOG_TITLE: 'تعطيل الموظف',
  SUPERVISOR_AGENTS_LIST_DIALOG_BODY:
    'هل أنت متأكد من تعطيل المستخدم "{name}" من لوحة تحكم الطلبات؟',

  // user statuses
  USER_STATUS_ACTIVE: 'مفعل',
  USER_STATUS_INACTIVE: 'غير مفعل',

  // agent create and update
  SUPERVISOR_AGENTS_LIST_CREATE_AGENT: 'إضافة موظف جديد',
  AGENT_CREATION_FORM_TITLE: 'إضافة موظف جديد',
  AGENT_CREATION_FORM_NAME: 'الإسم',
  AGENT_CREATION_FORM_EMAIL: 'الإيميل',
  AGENT_CREATION_FORM_MOBILE_NUMBER: 'رقم الموبايل',

  AGENT_UPDATE_FORM_TITLE: 'تعديل الموظف',
  AGENT_UPDATE_FORM_NAME: 'الإسم',
  AGENT_UPDATE_FORM_EMAIL: 'الإيميل',
  AGENT_UPDATE_FORM_MOBILE_NUMBER: 'رقم الموبايل',

  // reject order
  BRANCH_ORDER_REJECTION_REASONS_HEADER: 'اختر سبب الرفض',
  BRANCH_ORDER_REJECTION_REASONS_SEARCH: 'بحث عن سبب',
  BRANCH_BUSY_LIST_HEADER: 'الفرع',
  ITEMS_UNAVAILABLE_LIST_HEADER: 'اختر العناصر غير المتوفرة',
  ITEMS_UNAVAILABLE_NOTES: 'ملاحظات',
};
