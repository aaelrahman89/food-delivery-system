export default {
  routes: {
    home: {
      pilots: 'الطيارون',
      pending_orders: 'طلبات عملاء جديدة',
      scheduled_orders: 'طلبات بموعد محدد',
      working_orders: 'طلبات قيد التحضير',
    },
    unauthorized: 'غير مصرح لك بزيارة هذه الصفحة',
    not_found: 'تعذر إيجاد الصفحة',
    sign_in: 'تسجيل الدخول',
    sign_out: 'تسجيل الخروج',
    tasks: {
      details: 'تفاصيل الطلب',
      dispute_details: 'تفاصيل شكوى الطلب',
      list: 'قائمة الطلبات',
    },
    tasks_daily_closing: {
      list: 'تقفيل اليوم',
    },
    disputed_tasks: {
      list: 'قائمة شكاوي الطلبات',
    },
    orders: {
      list: 'طلبات الأونلاين',
      details: 'تفاصيل الطلب الأونلاين',
    },
    trips: {
      details: 'تفاصيل الرحلة',
    },
    catalogues: {
      details: 'تفاصيل القائمة',
      list: 'قائمة الكتالوجات',
      items: {
        details: 'تفاصيل العنصر',
      },
    },
  },
  branches: {
    sign_in: {
      $self: 'تسجيل الدخول',
      code: 'كود الفرع',
    },
  },
  trips: {
    requested: 'الطيارون المطلوبون',
    active_pilots: 'الطيارون النشطون',
    new: 'طلب طيار جديد',
    details: {
      id_lbl: 'معرف الرحلة',
      status_lbl: 'حالة الرحلة',
      creation_date_lbl: 'تاريخ الإنشاء',
      last_update_date_lbl: 'تاريخ آخر تحديث',
      vendor_branch_lbl: 'الفرع',
      pilot_name_lbl: 'الطيار',
      distance_lbl: 'المسافة',
      duration_lbl: 'الوقت',
      trip_tasks_lbl: 'طلبات الرحلة',
      trip_trail_lbl: 'مسار الرحلة',
      tasks: {
        title: 'الطلبات',
        id: 'معرف الطلب',
        status: 'حالة الطلب',
        customer_mobile_number: 'تلفون العميل',
        reached_date: 'وقت الوصول',
        total_duration: 'إجمالي الوقت',
        duration_since_previous_task: 'الوقت منذ الطلب السابق',
        total_distance: 'إجمالي المسافة',
        distance_from_previous_task: 'المسافة من الطلب السابق',
      },
    },
  },
  tasks: {
    list: {
      pilot_picture: 'صورة الطيار',
      pilot_name: 'أسم الطيار',
      vendor_task_id: 'رقم الطلب',
      customer_mobile_no: 'تليفون العميل',
      creation_date: 'تاريخ إنشاء الطلب',
      status: 'حالة الطلب',
      last_update_date: 'تاريخ آخر تحديث',
      duration: 'الوقت',
      total_distance: 'المسافة',
      actions: 'المزيد',
      location: 'الموقع الجغرافى',
      map_trail: 'مسار الطلب',
      cancel_task: 'الغاء الطلب',
      no_available_reason: 'لا يوجد سبب',
    },
    details: {
      title: 'التفاصيل',
      vendor_lbl: 'البائع',
      vendor_branch_lbl: 'الفرع',
      von_lbl: 'رقم الإيصال',
      id_lbl: 'معرف الطلب',
      customer_phone_number_lbl: 'تليفون العميل',
      customer_name_lbl: 'اسم العميل',
      customer_address_lbl: 'عنوان العميل',
      cancellation_info_lbl: 'تفاصيل الإلغاء',
      status_lbl: 'حالة الطلب',
      creation_date_lbl: 'تاريخ الإنشاء',
      last_update_date_lbl: 'تاريخ آخر تحديث',
      pilot_name_lbl: 'اسم الطيار',
      pilot_mobile_number_lbl: 'موبايل الطيار',
      distance_lbl: 'المسافة',
      duration_lbl: 'الوقت',
      location_lbl: 'مكان العميل',
      receipt_image_lbl: 'صورة الإيصال',
      location_not_available: 'مكان العميل غير متاح',
      paymentMethod_lbl: 'طريقة الدفع',
      cancellation_category_lbl: 'فئة الإلغاء',
      vendor_cancellation_reason_lbl: 'سبب الإلغاء من الفرع',
      survv_cancellation_reason_lbl: 'سبب الإلغاء من SURVV',
      cancellation_notes_lbl: 'ملاحظات',
      trip_id: 'معرف الرحلة',
      order_id: 'معرف الطلب الأونلاين',
      zone_name: 'المنطقة الفرعية',
      branch_selected_zone_name: 'المنطقة الفرعية المختارة من الفرع',
      zone_rate: 'فئة الحساب',
    },
    filters: {
      status_title: 'حالة الطلب',
      vendor_task_id_title: 'رقم الإيصال',
      customer_mobile_no_title: 'تليفون العميل',
      creation_date_from_title: 'بداية الفترة الزمنية',
      creation_date_to_title: 'نهاية الفترة الزمنية',
    },
    cancellation_reason: {
      $self: 'سبب الإلغاء',
      header: 'إلغاء طلب',
      desc: 'هل أنت متأكد من رغبتك في إلغاء الطلب ؟',
    },
    map_trail: {
      title: 'مسار الطلب',
    },
    journey: {
      duration: 'الوقت',
      distance: 'المسافة',
      value: 'القيمة',
      not_available: 'الخط الزمني للرحلة غير متاح',
    },
  },
  pilots: {
    request: {
      $self: 'إنشاء طلب جديد',
      number_of_pilots: 'عدد الطيارين',
      arrival_estimation: 'سيصلك الطيارون في خلال 10-15 دقيقة',
      confirm: 'تأكيد الطلب',
      cancel: 'إلغاء',
    },
    requests_list: {
      $self: 'الطيارون',
      pilot_image: 'صورة الطيار',
      searching: 'جاري البحث...',
      deliveries: 'توصيلات',
      eta: 'الوصول خلال',
      cancel: 'إلغاء الطلب',
      edit_tasks_per_trip: 'تغيير التوصيلات',
      number_of_tasks: 'عدد التوصيلات',
    },
  },
  catalogues: {
    details: {
      description: {
        en: 'الوصف (إنجليزي)',
        ar: 'الوصف (عربي)',
      },
      categories: 'الفئات',
      items: {
        description: {
          en: 'الوصف (إنجليزي)',
          ar: 'الوصف (عربي)',
        },
        price: 'السعر',
        calories: 'السعرات الحرارية',
        prepTime: 'وقت التحضير',
        tags: 'الوسوم',
        set_as_unavailable: 'جعل العنصر غير متاح',
        set_unavailable_dialog: {
          title: 'جعل العنصر غير متاح',
          message:
            'هل أنت متأكد من جعل هذا العنصر غير متاح ؟ لن يستطيع المستخدمين طلب هذا العنصر حتى جعلة متاحا مرة أخرى.',
        },
        set_as_available: 'جعل العنصر متاح',
        set_available_dialog: {
          title: 'جعل العنصر متاح',
          message:
            'هل أنت متأكد من جعل هذا العنصر متاحا ؟ سوف يكون المستخدمين قادرين على طلب هذا العنصر من القائمة.',
        },
      },
    },
    items: {
      categories: 'الفئات',
      tags: 'الوسوم',
      calories: 'سعرات حرارية',
      prep_time: 'وقت التحضير (بالدقائق)',
      price: 'السعر',
      option: {
        mandatory: 'اختيار إجباري',
        multi_selection: 'اختيار متعدد',
        min_allowed: 'الحد الأدنى',
        max_allowed: 'الحد الأعلى',
        selections: {
          $self: 'بنود الاختيار',
          price: 'السعر',
          calories: 'سعرات حرارية',
          related_options: 'الخيارات المرتبطة',
        },
      },
    },
  },
  orders: {
    pending: {
      id: 'رقم الطلب',
      price: 'السعر',
      requested_since: 'تم الطلب منذ',
      details_lbl: 'عرض التفاصيل',
      reject_msg:
        'هل انت متأكد من رغبتك برفض هذا الطلب؟ سيتم إبلاغ العميل برفض طلبه.',
    },
    working_orders: {
      order_id: 'رقم الطلب',
      total_price: 'السعر',
      requested_since: 'تم الطلب منذ',
      details_lbl: 'عرض التفاصيل',
    },
    details: {
      title: 'تفاصيل طلب العميل',
      id: 'المعرف',
      von: 'رقم الطلب',
      status: 'الحالة',
      request_date: 'تاريخ الطلب',
      update_date: 'تاريخ آخر تحديث',
      items: {
        quantity: 'الكمية',
        option_title: 'الإضافة',
        option_quantity: 'الكمية',
        option_price: 'السعر',
        base_price: 'السعر اﻷساسي',
        total_price: 'اﻹجمالي',
        notes_title: 'ملاحظات',
      },
      sub_total: 'السعر',
      tax: 'الضريبة',
      delivery_fees: 'تكلفة التوصيل',
      totalWithoutDeliveryFees: 'الإجمالي',
      total: 'اﻹجمالي',
    },
    list: {
      order_id: 'رقم الطلب',
      status: 'حالة الطلب',
      price: 'المبلغ الإجمالى',
      totalWithoutDeliveryFees: 'الإجمالي',
      scheduledTo: 'موعد الأوردر',
      creation_date: 'تاريخ الطلب',
      filters: {
        title: 'فلاتر',
        orderId: 'رقم الأوردر',
        status: 'الحالة',
        scheduledTo: 'موعد الأوردر',
        totalFrom: 'المجمل من',
        totalTo: 'المجمل إلى',
        from: 'التاريخ من',
        to: 'التاريخ إلى',
      },
    },
  },
  loader: {
    loading: 'جاري التحميل',
  },
  misc: {
    dismiss: 'إغلاق',
    confirm: 'تأكيد',
    apply: 'تطبيق',
    reset: 'إعادة تعيين',
    save: 'حفظ',
    close: 'اغلاق',
    from_date: 'من',
    to_date: 'إلى',
    clear: 'مسح',
    cancel: 'إلغاء',
    ok: 'موافق',
    accept_lbl: 'قبول',
    reject_lbl: 'رفض',
  },
  errors: {
    survv: {
      unauthorized: 'كود الفرع خاطئ',
      invalid_task_status: 'لا يمكن الغاء طلب غير مستلم من الطيار',
      inactive_branch: 'الفرع غير مفعل',
      reached_max_pending_trips:
        'تم الوصول للحد الأقصى للطلبات المنتظرة للطيارين، برجاء المحاولة بعد عدة دقائق',
      transaction_conflict: 'فشل في العملية، برجاء إعادة المحاولة',
      trail_not_ready: 'المسار غير جاهز للعرض',
      insufficient_balance: 'لا يوجد رصيد كافي',
      no_item_has_selections: 'يجب اضافة عناصر في قسم واحد على الأقل',
    },
    required: {
      branch_code: 'كود الفرع مطلوب',
    },
    invalid: {
      branch_code: 'كود الفرع غير صحيح',
      missing_field: 'هذا الحقل مطلوب',
      negative_number: 'لا يمكن إدخال أرقام سالبة',
      form_error: 'لا يمكن حفظ بيانات خاطئة!',
    },
    misc: {
      connection: 'خطأ في الاتصال',
      unknown: 'خطأ فني',
      server: 'خطأ في الخادم',
      illegal: 'عملية غير صحيحة',
      expired_token: 'انتهت الجلسة، برجاء تحديث الصفحة وإعادة تسجيل الدخول',
    },
  },
  warnings: {
    location: {
      permission_denied: 'لا يوجد صلاحيات لتتبع موقعك الحالي',
    },
    branches: {
      failed_trips_requests:
        'فشل طلب {failedPilots} من {requiredPilots} طيار, برجاء إعادة المحاولة',
    },
    no_trail: 'لا يوجد نقاط لرسم مسار الرحلة',
  },
  successes: {
    operation_completed: 'تمت العملية بنجاح',
  },
  lookups: {
    task_status: {
      DELIVERED: 'منتهية',
      CANCELED: 'ملغية',
      REACHED: 'وصل إلى الوجهة',
      ARRIVING: 'على وصول',
      COLLECTED: 'تم الإستلام',
      ON_DELIVERY: 'جاري التوصيل',
      ACCEPTED: 'جاري تعيين طيار',
      REQUESTED: 'تم الطلب',
      UNKNOWN: 'غير معروف',
      ASSIGNED: 'قيد التجهيز',
      NOT_FULFILLED: 'غير مكتملة',
      PENDING: 'انتظار',
      RETURNED: 'تم العودة',
      RECALLED: 'مرتجع',
      CANCELLED_PAID: 'ملغى مدفوع',
      PENDING_COLLECTION: 'فى إنتظار الإستلام',
    },
    task_cancellation_reason: {
      NONE: 'لا يوجد سبب إلغاء',
      CUSTOMER_CHANGE_MIND: 'العميل غير رأيه',
      REQUEST_TOOK_LONG: 'استغرق الطلب وقتًا طويلاً جدًا',
      MISSING_ORDER: 'طلب مفقود',
      WRONG_ORDER: 'طلب خاطئ',
      BAD_ORDER_QUALITY: 'جودة الطلب سيئة',
      PILOT_APPEARANCE: 'مظهر الطيار',
      PILOT_ATTITUDE: 'سلوك الطيار',
      NO_CHANGE: 'لا توجد فكة مع الطيار',
      CREDIT_MACHINE_PROBLEM: 'مشكلة آلة بطاقة الائتمان',
      CANNOT_REACH_ADDRESS: 'لم يتمكن الطيار من الوصول إلى العنوان',
      WEATHER_CONDITIONS: 'حالة الطقس',
      RIDE_NOT_NEEDED: 'لم يعد هناك حاجة إلى طيار',
    },
    task_cancellation_category: {
      NONE: 'لا توجد فئة إلغاء',
      QUICK_CANCELLATION: 'إلغاء سريع',
      PENALTY_CANCELLATION: 'إلفاء بغرامة',
      UNFULFILLED_CANCELLATION: 'إلغاء تأخر',
      RECALLED_CANCELLATION: 'إلغاء مرتجع',
      SURVV_CANCELLATION: 'إلفاء على SURVV',
    },
    trip_status: {
      REQUESTED: 'تم الطلب',
      PENDING: 'قيد الانتظار',
      REJECTED: 'تم الرفض',
      ASSIGNED: 'تم تعيين طيار',
      OPENED: 'قيد التنفيذ',
      NOT_FULFILLED: 'غير مكتملة',
      CANCELLED: 'ملغية',
      CLOSED: 'منتهية',
    },
    pilot_status: {
      UNAVAILABLE: 'غير متاح',
      AVAILABLE: 'متاح',
      LOADED: 'يقوم بالتوصيل',
      IN_HUB: 'في نقطة التجمع',
      ASSIGNED: 'تم إختياره',
      CANDIDATE: 'مرشح',
      WAITING: 'منتظر',
      COLLECTING: 'يسجل الطلبات',
      NONE: 'لا يوجد',
    },
    order_status: {
      UNKNOWN: 'غير معروف',
      REQUESTED: 'تم الطلب',
      CONFIRMED: 'تم التأكيد',
      REJECTED: 'تم الرفض',
      CANCELLED: 'تم الإلغاء',
      PILOT_REQUESTED: 'تم طلب طيار',
      COLLECTED: 'تم الاستلام من الطيار',
      DELIVERED: 'تم التوصيل',
    },
    task_payment_method: {
      Cash: 'نقدي',
      Credit: 'بطاقة ائتمانية',
      None: 'لم تحدد طريقة الدفع',
      Already_Paid: 'مدفوع مسبقا',
    },
    currency: {
      egp: 'جنيه',
    },
    distance_unit: {
      km: 'كم',
    },
    time_unit: {
      min: 'د',
    },
  },
};
