import {
  SVG_NAVIGATION_APPLICATION,
  SVG_NAVIGATION_CAMPAIGNS,
  SVG_NAVIGATION_CUSTOMERS,
  SVG_NAVIGATION_E_SHOP,
  SVG_NAVIGATION_FOOD,
  SVG_NAVIGATION_IDENTITY,
  SVG_NAVIGATION_LIVE_OPS_ORDERS,
  SVG_NAVIGATION_NOTIFICATIONS,
  SVG_NAVIGATION_ONLINE_ORDERS,
  SVG_NAVIGATION_REFERRAL,
  SVG_NAVIGATION_REFERRAL_REPORT,
  SVG_NAVIGATION_TAX_TIERS,
} from '@survv/assets';
import {
  AppMenuRoute,
  AppMenuSection,
} from '@survv/commons/core/models/AppMenu';
import { UserRole } from '@survv/commons/core/models/UserRole';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { ROUTE_NAMES } from './core/routes/routeNames';

export const consumerOpsAppMenu: ConsumerOpsMenuSection[] = [
  {
    header: 'MENU_HEADER_LIVE_OPS',
    entries: [
      {
        name: 'MENU_ENTRY_LIVE_OPS_ORDERS',
        icon: SVG_NAVIGATION_LIVE_OPS_ORDERS,
        route: { name: ROUTE_NAMES.LIVE_OPS_ORDERS },
        userRoles: [
          UserRole.OPS_USER,
          UserRole.OPS_MANAGER,
          UserRole.FLEET_MANAGER,
          UserRole.AREA_MANAGER,
        ],
      },
    ],
  },
  {
    header: 'MENU_HEADER_CUSTOMERS',
    entries: [
      {
        name: 'MENU_ENTRY_CUSTOMERS',
        icon: SVG_NAVIGATION_CUSTOMERS,
        route: { name: ROUTE_NAMES.CUSTOMERS },
        userRoles: [UserRole.CS_USER],
      },
      {
        name: 'MENU_ENTRY_ORDERS',
        icon: SVG_NAVIGATION_ONLINE_ORDERS,
        route: { name: ROUTE_NAMES.ORDERS_LIST },
        userRoles: [UserRole.OPS_USER, UserRole.CS_USER],
      },
    ],
  },
  {
    header: 'MENU_HEADER_MARKETING',
    entries: [
      {
        name: 'MENU_ENTRY_CAMPAIGNS',
        icon: SVG_NAVIGATION_CAMPAIGNS,
        route: { name: ROUTE_NAMES.CAMPAIGNS_LIST },
        userRoles: [UserRole.MARKETING_USER, UserRole.MARKETING_MANAGER],
      },
      {
        name: 'MENU_ENTRY_REFERRAL',
        icon: SVG_NAVIGATION_REFERRAL,
        route: { name: ROUTE_NAMES.REFERRAL_LIST },
        userRoles: [UserRole.MARKETING_USER, UserRole.MARKETING_MANAGER],
      },
      {
        name: 'MENU_ENTRY_REFERRAL_REPORT',
        icon: SVG_NAVIGATION_REFERRAL_REPORT,
        route: { name: ROUTE_NAMES.REFERRAL_REPORT },
        userRoles: [UserRole.MARKETING_USER, UserRole.MARKETING_MANAGER],
      },
      {
        name: 'MENU_ENTRY_NOTIFICATIONS',
        icon: SVG_NAVIGATION_NOTIFICATIONS,
        route: { name: ROUTE_NAMES.PUSH_NOTIFICATIONS },
        userRoles: [UserRole.MARKETING_USER, UserRole.MARKETING_MANAGER],
      },
    ],
  },
  {
    header: 'MENU_HEADER_CATALOGUE_APP_MANAGEMENT',
    entries: [
      {
        name: 'MENU_ENTRY_APPLICATION',
        icon: SVG_NAVIGATION_APPLICATION,
        route: { name: ROUTE_NAMES.ONLINE_ORDERING_APPLICATION },
        userRoles: [UserRole.APP_DESIGNER],
      },
      {
        name: 'MENU_ENTRY_CATALOGUE_MANAGEMENT_FOOD',
        icon: SVG_NAVIGATION_FOOD,
        route: {
          name: ROUTE_NAMES.ONLINE_ORDERING_VENDOR_ONLINE_PROFILE_LIST,
          params: { vendorType: VendorType.FOOD.valueOf().toLowerCase() },
        },
        userRoles: [UserRole.CATALOGUE_USER, UserRole.CATALOGUE_SUPERVISOR],
      },
      {
        name: 'MENU_ENTRY_CATALOGUE_MANAGEMENT_SHOP',
        icon: SVG_NAVIGATION_E_SHOP,
        route: {
          name: ROUTE_NAMES.ONLINE_ORDERING_VENDOR_ONLINE_PROFILE_LIST,
          params: { vendorType: VendorType.SURVV_SHOP.valueOf().toLowerCase() },
        },
        userRoles: [UserRole.CATALOGUE_USER, UserRole.CATALOGUE_SUPERVISOR],
      },
    ],
  },
  {
    header: 'MENU_HEADER_FINANCE',
    entries: [
      {
        name: 'MENU_ENTRY_TAX_TIERS',
        icon: SVG_NAVIGATION_TAX_TIERS,
        route: { name: ROUTE_NAMES.TAX_TIERS },
        userRoles: [UserRole.ACCOUNTANT, UserRole.CATALOGUE_SUPERVISOR],
      },
    ],
  },
  {
    header: 'MENU_HEADER_ADMINISTRATION',
    entries: [
      {
        name: 'MENU_ENTRY_USERS',
        icon: SVG_NAVIGATION_IDENTITY,
        route: { name: ROUTE_NAMES.USERS_LIST },
        userRoles: 'admin-only',
      },
    ],
  },
];

export interface ConsumerOpsMenuSection extends AppMenuSection {
  entries: ConsumerOpsMenuRoute[];
}

export interface ConsumerOpsMenuRoute extends AppMenuRoute {
  userRoles: UserRole[] | 'all' | 'admin-only';
}
