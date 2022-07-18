import { ROUTE_NAMES } from '../../../core/routes/routeNames';
import { USER_ROLES } from '../../../core/constants';

export default [
  {
    path: '/campaigns',
    name: ROUTE_NAMES.CAMPAIGNS_LIST,
    component: () => import('./campaigns-list/CampaignsListView.ts.vue'),
    meta: {
      allowedRoles: [USER_ROLES.MARKETING_USER, USER_ROLES.MARKETING_MANAGER],
    },
  },
  {
    path: '/campaigns/create',
    name: ROUTE_NAMES.CAMPAIGN_CREATION,
    component: () => import('./campaign-creation/PromotionCreationView.ts.vue'),
    meta: {
      allowedRoles: [USER_ROLES.MARKETING_USER, USER_ROLES.MARKETING_MANAGER],
    },
  },
];
