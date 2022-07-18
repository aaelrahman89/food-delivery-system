import {
  AppMenuRoute,
  AppMenuSection,
} from '@survv/commons/core/models/AppMenu';
import { ROUTE_NAMES } from './core/routes/routeNames';
import { SVG_NAVIGATION_IDENTITY } from '@survv/assets';
import { UserRole } from '@survv/commons/core/models/UserRole';

export const consumerVendorAppMenu: ConsumerVendorMenuSection[] = [
  {
    header: 'MENU_HEADER_MANAGE',
    entries: [
      {
        name: 'MENU_ENTRY_USERS',
        icon: SVG_NAVIGATION_IDENTITY,
        route: { name: ROUTE_NAMES.USERS_LIST },
        userRoles: [UserRole.CALL_CENTER_SUPER_ADMIN],
      },
    ],
  },
];

export interface ConsumerVendorMenuSection extends AppMenuSection {
  entries: ConsumerVendorMenuRoute[];
}

export interface ConsumerVendorMenuRoute extends AppMenuRoute {
  userRoles: UserRole[] | 'all' | 'admin-only';
}
