export default {
  routes: {
    home: 'Home',
    dashboard: 'Dashboard',
    unauthorized: 'Unauthorized',
    not_found: 'Page not found',
    pilots: {
      list: 'Pilots',
      map: 'Pilots On Map',
      profile: {
        $self: 'Pilot Profile',
        title: 'Pilot Profile',
        create: 'Create Pilot Profile',
        edit: 'Edit Pilot Profile',
        tasks: 'Pilot Profile - Orders',
        logs: 'Pilot Profile - Action Logs',
        tracking: 'Pilot Profile - Tracking',
      },
      tasks: {
        details: 'Order Details',
      },
    },
    trips: {
      details: 'Trip Details',
    },
    tasks: {
      list: 'Orders',
      details: 'Order - Details',
      link_customer: {
        confirm_customer_mobile_no: 'Confirm Customer Mobile Number',
        existing_address: 'Link to Existing Customer',
        new_customer: 'Link Order to New Customer',
        new_address: 'Link to New Address',
      },
      linkable: {
        list: 'Linkable Orders',
      },
      activities: 'Order - Activities',
      dispute: 'Order - Dispute',
    },
    hubs: {
      list: 'Hubs',
      profile: {
        current: 'Hub Profile',
        edit: 'Edit Hub Profile',
        create: 'Create Hub Profile',
        assigned_pilots: 'Hub Profile - Assigned Pilots',
        branches: 'Hub Profile - Branches',
        c2c_brands: 'C2C Brands',
        zones_b2b: 'Hub Profile - Zones B2B',
        zones_b2b_management: 'Hub Profile - Zones B2B Management',
        zones_food_b2c: 'Hub Profile - Zones Food B2C',
        zones_food_b2c_management: 'Hub Profile - Zones Food B2C Management',
      },
    },
    ops_users: {
      profile: {
        create: 'Create User',
      },
    },
    vendors: {
      list: 'Vendors',
      payment_profile: {
        invoices: {
          list: 'Invoices',
          details: 'Payment Profile - Invoice Details',
        },
        consumptions: 'Consumptions',
        billing_info: {
          details: 'Billing Info',
          edit: 'Payment Profile - Edit Billing Info',
          tiers: {
            configure: 'Payment Profile - Tiers',
          },
        },
        statement: 'Statement',
        debit_credit_notes: 'Debit/Credit Notes',
      },
      profile: {
        view: 'Vendor Profile',
        create: 'Create Vendor',
        edit: 'Edit Vendor Profile',
        vendor_receipts: 'Vendor Profile - Receipts',
        branches: 'Vendor Profile - Branches',
        contact_persons: 'Vendor Profile - Contact persons',
        disputed_tasks: 'Disputed Orders',
        promotions: 'Promotions',
      },
      branches: {
        profile: {
          create: 'Create Branch Profile',
        },
      },
      receipts: {
        details: 'Receipt Details',
      },
    },
    branches: {
      profile: 'Branch Profile',
      profile_edit: 'Edit Branch Profile',
    },
    customers: {
      list: 'Customers',
      profile: {
        $self: 'Customer Profile',
        update_address: 'Update Customer Address',
        tasks: 'Customer Profile - Orders',
        orders: 'Customer Profile - Online Orders',
        addresses: 'Customer Profile - Addresses',
        debit_credit_notes: 'Customer Profile - Debit/Credit Notes',
        details: 'Customer Profile - Details',
      },
    },
    online_ordering: {
      list: 'Online Ordering',
      vendors: 'Vendors',
      vendor: {
        settings: 'Vendor Settings',
        details: 'Vendor Details',
        branches_settings: 'Branches Settings',
        branch: {
          settings: 'Branches Settings',
          edit_settings: 'Edit Branch Settings',
        },
      },
      catalogues: {
        create: 'New Catalogue',
        edit: 'Edit Catalogue',
        details: 'Catalogue Details',
        validation: 'Catalogue Validation',
      },
      items: {
        create: 'New Item',
        edit: 'Edit Item',
        details: 'Item Details',
      },
      options: {
        create: 'New Option',
        edit: 'Edit Option',
      },
      application: {
        view: 'Application',
        sections: {
          edit: 'Application',
        },
      },
    },
    geo_management: {
      management: 'Geographical Management',
      areas: {
        management: 'Area Management',
        zones_import: 'Zones Definition',
      },
    },
    orders: {
      list: 'Online Orders List',
      details: 'Online Order Details',
    },
    bank: {
      define: 'Define Bank',
      details: 'Bank Details',
    },
    tiers: {
      list: 'Tiers',
      configure: 'Configure',
    },
    invoices: { details: 'Invoice Details', list: 'List Invoices' },
    sign_in: 'Sign In',
    activation: 'Activation',
  },
  catalogues: {
    list: {
      filter: {
        vendor_label: 'Vendor Name',
        catalogue_status: 'Catalogue Status',
      },
    },
    validation: {
      entity_type: 'Entity Type',
      entity_key: 'Entity Key',
      message: 'Message',
    },
    vendors: {
      tax: 'Tax',
      deliveryFees: 'Delivery Fees',
      minOrderValue: 'Minimum Order Value',
      orderingFrom: 'Ordering From',
      orderingTo: 'Ordering To',
      tags: 'Hash Tags',
      cuisines: 'Cuisines',
      orderingHours: 'Ordering Hours',
      from: 'From',
      to: 'To',
      editSettings: 'Edit Vendor Settings',
      edit_branches_settings: 'Edit Branches Settings',
    },
    new_catalogue: {
      catalogue_language: {
        $self: 'Catalogue Language',
        english: 'English',
        arabic: 'Arabic',
      },
      title: {
        en: 'Title (English)',
        ar: 'Title (Arabic)',
      },
      desc: {
        en: 'Description (English)',
        ar: 'Description (Arabic)',
      },
    },
    details: {
      edit: 'Edit',
      edit_settings: 'Edit Publish Settings',
      mark_ready: 'Mark as Ready',
      mark_ready_confirmation_message:
        'Are you sure you want to mark the catalogue as ready ?',
      show_validation: 'Show Validation',
      un_publish: 'Un-Publish',
      un_publish_confirmation_message:
        'Are you sure you want to un-publish the catalogue ?',
      status: 'Status',
      publish: 'Publish',
      description: {
        en: 'Description (English)',
        ar: 'Description (Arabic)',
      },
      add_new_item: 'Add New Item',
      all_items: 'All Items',
      archived_items: 'Archived Items',
      items: {
        details: 'Details',
        edit: 'Edit',
        add_option: 'Add option',
        archive_lbl: 'Archive',
        archive_title: 'Archive this item?',
        archive_msg: ' This item will be no longer available for use',
        unarchive_lbl: 'Unarchive',
        unarchive_title: 'Unarchive this item?',
        unarchive_msg: ' This item will be available for use',
        description: 'Description',
        calories: 'Calories',
        options_num: 'Options Number',
        options: 'Options',
      },
      tabs: {
        all_categories: 'All Catalogue Sections',
      },
    },
    items: {
      title: {
        en: 'Title (English)',
        ar: 'Title (Arabic)',
      },
      desc: {
        en: 'Description (English)',
        ar: 'Description (Arabic)',
      },
      categories: {
        $self: 'Catalogue Sections',
        add_category: 'Add Catalogue Section',
        title: {
          en: 'Title (English)',
          ar: 'Title (Arabic)',
        },
      },
      calories: 'Calories',
      prep_time: 'Preparation Time (Minutes)',
      price: 'Price',
      price_hint: 'Specify price or leave it empty to add price options later',
      cancellation_title: 'Cancel Creating Item?',
      cancellation_msg:
        'Do you want to cancel the item creation? You will redirect to the catalogue page.',
      edit_cancellation_title: 'Cancel Editing Item?',
      edit_cancellation_msg:
        'Do you want to cancel the item editing? You will redirect to the catalogue page.',
      remove_images_msg: 'Select images that you want to delete',
      option: {
        new: 'New Option',
        edit: 'Edit Option',
        title: {
          en: 'Title (English)',
          ar: 'Title (Arabic)',
        },
        description: {
          en: 'Description (English)',
          ar: 'Description (Arabic)',
        },
        multi_selection: 'Multi Selection',
        mandatory: 'Mandatory',
        min_allowed: 'Minimum Limit',
        max_allowed: 'Maximum Limit',
        selections: {
          $self: 'Selections',
          new: 'New Selection',
          edit: 'Edit Selection',
          title: {
            en: 'Title (English)',
            ar: 'Title (Arabic)',
          },
          price: 'Price',
          calories: 'Calories',
          related_options: 'Related Options',
        },
        delete: {
          title: 'Delete Option',
          confirmation_message: 'Are you sure you want to delete this option?',
          warning_message:
            'Careful, you are trying to delete an option related to below selections:',
        },
      },
    },
    tags: {
      $self: 'Hash Tags',
      add_tag: 'Add Hash Tag',
      title: {
        en: 'Title (English)',
        ar: 'Title (Arabic)',
      },
    },
    cuisines: {
      $self: 'Cuisines',
      add_cuisine: 'Add Cuisine',
      title: {
        en: 'Title (English)',
        ar: 'Title (Arabic)',
      },
    },
    publish: {
      title: 'Publish Settings',
      msg: 'Please, insert catalogue settings to be able to publish',
      from_time: 'From Time',
      to_time: 'To Time',
      ordering_hours: 'Ordering Hours',
      ordering_hours_hint:
        'Choose the hours where the catalogue will be available in',
      branches_list: 'Branches List',
      branches_list_hint:
        'Select the branches where the catalogue will be published to',
      branches_list_validation_msg:
        '*Please, select at least one branch to publish to*',
      apply_and_publish: 'Apply Settings & Publish',
    },
    catalogue_settings: {
      title: 'Catalogue Publish Settings',
    },
    branch_settings: {
      title: 'Branch Settings',
      msg: 'This vendor has no branches yet',
      settings: {
        $self: 'Settings',
        msg: 'Please, select a branch to be able to edit its settings',
        delivery_fees: 'Delivery Fees',
        min_order_value: 'Min. Order Value',
        ordering_hours: {
          from: 'From',
          to: 'To',
        },
        tags: 'Hash Tags',
      },
      branches_list: 'Branches',
    },
  },
  misc: {
    none: 'None',
    yes: 'Yes',
    no: 'No',
    clear_lbl: 'Clear',
    close_lbl: 'Close',
    cancel: 'Cancel',
    apply_lbl: 'Apply',
    save_and_add_another: 'Save and add another',
    reset_filters_lbl: 'Reset',
    browse_image_lbl: 'Browse Image',
    browse_images_lbl: 'Browse Images',
    create_lbl: 'Create',
    create_add_options_lbl: 'Create & Add Options',
    update_lbl: 'Update',
    edit: 'Edit',
    dismiss_lbl: 'Dismiss',
    refresh_lbl: 'Refresh',
    back_lbl: 'Back',
    date_lbl: 'Date',
    time_lbl: 'Time',
    logo: 'Logo',
    from_date_lbl: 'From',
    to_date_lbl: 'To',
    confirm_lbl: 'Confirm',
    save_lbl: 'Save',
    submit: 'Submit',
    successful_operation_msg: 'Operation Succeeded',
    ok: 'OK',
    remove_lbl: 'Remove',
    upload: 'Upload',
    reset: 'Reset',
    no_data: 'No data available',
  },
  path_breadcrumbs: {
    home: 'Home',
    pilots: 'Pilots',
    pilot_create: 'Create',
    hub_create: 'Create',
    vendor_create: 'Create',
    user_create: 'Create',
    trips: 'Trips',
    tasks: 'Orders',
    task_details: 'Details',
    disputed_tasks: 'Disputed Orders',
    dispute: 'Dispute',
    hubs: 'Hubs',
    map: 'Map',
    unauthorized: 'Unauthorized',
    sign_in: 'Sign in',
    activation: 'Activation',
    logs: 'Logs',
    location: 'Location',
    tracking: 'Tracking',
    profile: 'Profile',
    users: 'Users',
    details: 'Details',
    settings: 'Settings',
    addresses: 'Addresses',
    vendors: 'Vendors',
    receipts: 'Receipts',
    branches: 'Branches',
    contact_persons: 'Contact Persons',
    assigned_pilots: 'Assigned Pilots',
    edit: 'Edit',
    create: 'Create',
    customers: 'Customers',
    link_confirm_customer_mobile_no: 'Confirm Customer Mobile Number',
    link_existing_customer_address: 'Link to Existing Customer',
    link_new_customer: 'Link to New Customer',
    link_existing_customer_new_address: 'Link to New Address',
    linkable_tasks: 'Linkable Orders',
    activities: 'Activities',
    new: 'New',
    online_ordering: 'Online Ordering',
    areas: 'Areas',
    item_editing: 'Item Editing',
    food: 'Food',
    pets: 'Pets',
    groceries: 'Groceries',
    courier: 'Courier',
    pharmacy: 'Pharmacy',
    catalogue_creation: 'New Catalogue',
    item_creation: 'New Item',
    option_creation: 'New Option',
    validation: 'Validation',
    geo_management: 'Geographical Management',
    management: 'Management',
    zones_import: 'Zones Definition',
    hubs_linking: 'Hubs Linking',
    zones: 'Zones',
    branches_settings: 'Branches Settings',
    edit_settings: 'Edit Settings',
    zones_management: 'Zones Management',
    orders: 'Online Orders',
    subscriptions: 'Subscriptions',
    bank: 'Bank',
    define: 'Define',
    tiers: 'Tiers',
    configure: 'Configure',
    payment_profile: 'Payment Profile',
    consumptions: 'Consumptions',
    promotions: 'Promotions',
    invoices: 'Invoices',
    billing_info: 'Billing Info',
    statement: 'Statement',
    debit_credit_notes: 'Debit/Credit Notes',
    catalogues: 'Catalogues',
    items: 'Items',
    options: 'Options',
    creation: 'Creation',
    update: 'Update',
    c2c_brands: 'C2C Brands',
    zones_b2b: 'Zones B2B',
    zones_b2b_management: 'Zones B2B Management',
    zones_food_b2c: 'Zones Food B2C',
    zones_food_b2c_management: 'Zones Food B2C Management',
    set_opening_balance: 'Set Opening Balance',
    add_credit_note: 'Add Credit Note',
    add_debit_note: 'Add Debit Note',
    errand_zones: 'Errand Zones',
    errand_zones_management: 'Errand Zones Management',
  },
  validation: {
    password_mismatch: 'Passwords do not match',
    invalid: {
      email_format: 'Invalid email format!',
      password: 'Minimum length is 8 characters!',
      mobile_no: 'Invalid mobile number format!',
      max_trip_tasks: 'Invalid, it should be number and greater than zero!',
      avgTransPerHour: 'Invalid, it should be greater than zero!',
      avgTransPerDay: 'Invalid, it should be greater than zero!',
      avgTransPerMonth: 'Invalid, it should be greater than zero!',
      staff_id: 'Pilot id should be greater than 1000!',
      number: 'Invalid, it should be a number!',
      positive: 'Invalid, this number should be greater than zero!',
      min_max: 'Maximum value should be greater than the minimum value!',
      limit_exceeded:
        'Invalid, this number should  be smaller than or equals the limit!',
      min_transactions:
        'Avoid Gaps: Min. must be greater than previous Max by 1',
      initial_min_transaction: 'Min must start with 1',
      last_max_transaction: 'Max must has no value',
      max_lower_than_min: 'Max. must be greater than Min.',
      min_greater_than_max: 'Min. must be lower than Max.',
      percentage: 'Invalid: Promotion value must be between 0 and 100',
      expiry_lower_than_effective:
        'Expiry date must equal or exceed Effective date',
    },
    missing: {
      email: 'Email is required!',
      password: 'Password is required',
      mobile_number: 'Mobile number is required!',
      vendor_label: 'Vendor Label is required!',
      vendor_branch_label: 'Vendor Branch Label is required!',
      max_trip_tasks: 'Max Trip Tasks is required!',
      date: 'Date is required!',
      time: 'Time is required!',
      full_name: 'Name is required!',
      confirm_password: 'Password confirmation is required!',
      missingVendorId: 'Vendor ID is wrong ',
      rush_hour_from: 'From is required!',
      rush_hour_to: 'To is required!',
      address_data: 'Address Fields Required',
      notes: 'Notes are Required',
      role: 'Role is required!',
      cancellationNotes: 'Cancellation notes is required!',
      staff_id: 'Pilot ID is required!',
      address_country: 'You must choose a country!',
      address_city: 'You must choose a city!',
      address_area: 'You must choose a area!',
      address_street: 'Address Line 1 is required',
      address_building: 'Building name/number is required',
      vendor_type: 'Vendor Type Is Required!',
      catalogue_title: 'Catalogue Title Is Required!',
      field: 'This field is required!',
      image: 'This image is required!',
      zones_names: 'Some zones names are missing!',
    },
  },
};
