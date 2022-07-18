import {
  AppMenuRoute,
  AppMenuSection,
} from '@survv/commons/core/models/AppMenu';
import { ROUTE_NAMES } from './core/routes/routeNames';
import {
  SVG_NAVIGATION_AGENTS,
  SVG_NAVIGATION_BRANCHES,
  SVG_NAVIGATION_LIVE_ORDERS,
  SVG_NAVIGATION_ONLINE_ORDERS,
} from '@survv/assets';
import { UserRole } from '@survv/commons/core/models/UserRole';

export const callCenterAppMenu: CallCenterMenuSection[] = [
  {
    header: 'MENU_HEADER_ORDERS',
    entries: [
      {
        name: 'MENU_ENTRY_ALL_ORDERS',
        icon: SVG_NAVIGATION_ONLINE_ORDERS,
        route: { name: ROUTE_NAMES.SUPERVISOR_ALL_ORDERS_LIST },
        userRoles: [
          UserRole.CALL_CENTER_SUPERVISOR,
          UserRole.CALL_CENTER_SUPER_ADMIN,
        ],
      },
      {
        name: 'MENU_ENTRY_LIVE_ORDERS',
        icon: SVG_NAVIGATION_LIVE_ORDERS,
        route: { name: ROUTE_NAMES.SUPERVISOR_LIVE_ORDER_EMPTY },
        userRoles: [
          UserRole.CALL_CENTER_SUPERVISOR,
          UserRole.CALL_CENTER_SUPER_ADMIN,
        ],
      },
    ],
  },
  {
    header: 'MENU_HEADER_MANAGE',
    entries: [
      {
        name: 'MENU_ENTRY_AGENTS',
        icon: SVG_NAVIGATION_AGENTS,
        route: { name: ROUTE_NAMES.SUPERVISOR_AGENTS_LIST },
        userRoles: [
          UserRole.CALL_CENTER_SUPERVISOR,
          UserRole.CALL_CENTER_SUPER_ADMIN,
        ],
      },
      {
        name: 'MENU_ENTRY_BRANCHES',
        icon: SVG_NAVIGATION_BRANCHES,
        route: { name: ROUTE_NAMES.SUPERVISOR_BRANCHES_LIST },
        userRoles: [
          UserRole.CALL_CENTER_SUPERVISOR,
          UserRole.CALL_CENTER_SUPER_ADMIN,
        ],
      },
    ],
  },
];

export interface CallCenterMenuSection extends AppMenuSection {
  entries: CallCenterMenuRoute[];
}

export interface CallCenterMenuRoute extends AppMenuRoute {
  userRoles: UserRole[] | 'all' | 'admin-only';
}
