import { EnumClass } from './EnumClass';

export class UserRole extends EnumClass {
  _prefix: string;

  static SUPER_ADMIN = new UserRole('SuperAdmin');
  static OPS_MANAGER = new UserRole('OpsManager');
  static CATALOGUE_USER = new UserRole('CatalogueUser');
  static CATALOGUE_SUPERVISOR = new UserRole('CatalogueSupervisor');
  static APP_DESIGNER = new UserRole('AppDesigner');
  static OPS_USER = new UserRole('OpsUser');
  static MARKETING_USER = new UserRole('MarketingUser');
  static MARKETING_MANAGER = new UserRole('MarketingManager');
  static VENDOR_BRANCH_USER = new UserRole('VendorBranchUser');
  static VENDOR_ON_BOARDING_USER = new UserRole('VendorOnBoardingUser');
  static PILOT = new UserRole('Pilot');
  static INTERNAL_USER = new UserRole('InternalUser');
  static CS_USER = new UserRole('CustomerService');
  static AREA_MANAGER = new UserRole('AreaManager');
  static CUSTOMER = new UserRole('Customer');
  static GUEST_CUSTOMER = new UserRole('GuestCustomer');
  static VENDOR_USER = new UserRole('VendorUser');
  static ACCOUNTANT = new UserRole('Accountant');
  static FLEET_MANAGER = new UserRole('FleetManager');
  static DXWAND = new UserRole('DXWand');
  static ORDER_MANUAL_UPDATER = new UserRole('OrderManualUpdater');
  static TASK_MANUAL_UPDATER = new UserRole('TaskManualUpdater');
  static CALL_CENTER_SUPER_ADMIN = new UserRole('VendorCallCenterSuperAdmin');
  static CALL_CENTER_SUPERVISOR = new UserRole('VendorCallCenterSupervisor');
  static CALL_CENTER_AGENT = new UserRole('VendorCallCenterAgent');
  static FINANCIAL_MANAGER = new UserRole('FinancialManager');
  static ALL = new UserRole('All');
  static NONE = new UserRole('NONE');

  constructor(value: string) {
    super(value);
    this._prefix = 'USER_ROLE';
  }
}
