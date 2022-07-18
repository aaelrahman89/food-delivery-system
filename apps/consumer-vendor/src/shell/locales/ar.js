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

  // set password
  PASSWORDS_MISMATCH_ERROR: 'كلمة المرور غير متطابقة',
  PASSWORD_LENGTH_ERROR: 'عدد الاحرف في كلمة السر يجب ان تكون من 8 الى 20 حرف',
  CONFIRM_PASSWORD: 'أعد ادخال كلمة المرور',
  SET_PASSWORD_MESSAGE: 'ادخل كلمة المرور الخاصة بك للمتابعة',

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

  // menu
  MENU_HEADER_MANAGE: 'إدارة',
  MENU_ENTRY_USERS: 'إدارة المستخدمين',

  // users list
  USERS_LIST: 'المستخدمين',
  USERS_LIST_CREATE_USER: 'إضافة مستخدم جديد',
  USERS_LIST_NAME: 'الإسم',
  USERS_LIST_EMAIL: 'الإيميل',
  USERS_LIST_MOBILE_NUMBER: 'رقم الموبايل',
  USERS_LIST_ROLE: 'صلاحيات المستخدم',
  USERS_LIST_STATUS: 'الحالة',
  USERS_LIST_CREATION_DATE: 'تاريخ الإنشاء',
  USERS_LIST_ACTIONS_ACTIVATE: 'تفعيل',
  USERS_LIST_ACTIONS_DEACTIVATE: 'تعطيل',
  USERS_LIST_ACTIONS_UPDATE: 'تعديل',
  USERS_LIST_DIALOG_TITLE: 'تعطيل المستخدم',
  USERS_LIST_DIALOG_BODY:
    'هل أنت متأكد من تعطيل المستخدم "{name}" من لوحة تحكم الطلبات؟',

  // user statuses
  USER_STATUS_ACTIVE: 'مفعل',
  USER_STATUS_INACTIVE: 'غير مفعل',

  // user create and update
  USER_CREATION_FORM_TITLE: 'إضافة مستخدم جديد',
  USER_CREATION_FORM_NAME: 'الإسم',
  USER_CREATION_FORM_EMAIL: 'الإيميل',
  USER_CREATION_FORM_MOBILE_NUMBER: 'رقم الموبايل',
  USER_CREATION_FORM_ROLE: 'الصلاحيات',

  USER_UPDATE_FORM_TITLE: 'تعديل المستخدم',
  USER_UPDATE_FORM_NAME: 'الإسم',
  USER_UPDATE_FORM_EMAIL: 'الإيميل',
  USER_UPDATE_FORM_MOBILE_NUMBER: 'رقم الموبايل',

  // user roles
  VendorCallCenterSuperAdmin: 'مسؤول',
  VendorCallCenterSupervisor: 'مشرف',
  VendorCallCenterAgent: 'موظف',
  None: 'لا يوجد',
};
