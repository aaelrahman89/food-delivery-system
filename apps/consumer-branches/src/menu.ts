import {
  AppMenuRoute,
  AppMenuSection,
} from '@survv/commons/core/models/AppMenu';
import {
  SVG_GLOBAL_ONLINE_ORDERS,
  SVG_NAVIGATION_CATALOGUE,
  SVG_NAVIGATION_HOME,
} from '@survv/assets';
import { routeNames } from './core/routes/routeNames';

export interface BranchMenuSection extends AppMenuSection {
  entries: AppMenuRoute[];
}

export const branchAppMenu: BranchMenuSection[] = [
  {
    entries: [
      {
        name: 'MENU_ENTRY_HOME',
        icon: SVG_NAVIGATION_HOME,
        route: { name: routeNames.HOME },
      },
    ],
  },
  {
    header: 'MENU_HEADER_ONLINE_ORDERS',
    entries: [
      {
        name: 'MENU_ENTRY_ALL_ONLINE_ORDERS',
        icon: SVG_GLOBAL_ONLINE_ORDERS,
        route: { name: 'routes.orders.list' },
      },
      {
        name: 'MENU_ENTRY_CATALOGUES',
        icon: SVG_NAVIGATION_CATALOGUE,
        route: { name: routeNames.CATALOGUES_LIST },
      },
    ],
  },
];
