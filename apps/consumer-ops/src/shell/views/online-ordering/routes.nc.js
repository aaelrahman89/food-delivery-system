import BranchesRoutes from '../restaurants/branches/routes.nc';
import { ROUTE_NAMES } from '../../../core/routes/routeNames';
import { USER_ROLES } from '../../../core/constants';

export default [
  {
    path: 'online-ordering',
    redirect: { name: ROUTE_NAMES.HOME },
  },
  {
    path: 'online-ordering/application',
    redirect: {
      name: 'routes.online_ordering.application.view',
      params: { vendorType: 'food' },
    },
    name: ROUTE_NAMES.ONLINE_ORDERING_APPLICATION,
    meta: {
      allowedRoles: [USER_ROLES.APP_DESIGNER],
    },
  },
  {
    path: 'online-ordering/application/:vendorType',
    component: () =>
      import('./application-management/ApplicationManagementView.vue'),
    meta: {
      allowedRoles: [USER_ROLES.APP_DESIGNER],
    },
    children: [
      {
        path: '',
        name: 'routes.online_ordering.application.view',
        component: () =>
          import('./application-management/HomepageSectionsView.vue'),
        meta: {
          allowedRoles: [USER_ROLES.APP_DESIGNER],
        },
      },
      {
        path: 'edit',
        name: 'routes.online_ordering.application.sections.edit',
        component: () =>
          import('./application-management/HomepageSectionsUpdate.vue'),
        meta: {
          allowedRoles: [USER_ROLES.APP_DESIGNER],
        },
      },
    ],
  },
  {
    path: 'online-ordering/application/:vendorType/tags',
    name: 'routes.online_ordering.application.tags',
    redirect(to) {
      return {
        name: 'routes.online_ordering.application.view',
        params: { ...to.params },
      };
    },
    meta: {
      allowedRoles: [USER_ROLES.APP_DESIGNER],
    },
  },
  {
    path: 'online-ordering/application/:vendorType/tags/:tagType',
    name: 'routes.online_ordering.application.tags.list',
    component: () => import('./tags/TagsListView.vue'),
    meta: {
      allowedRoles: [USER_ROLES.APP_DESIGNER],
    },
  },
  {
    path: 'online-ordering/application/:vendorType/tag-groups',
    name: 'routes.online_ordering.application.tag-groups',
    component: () => import('./tag-groups/TagGroupsListView.vue'),
    meta: {
      allowedRoles: [USER_ROLES.APP_DESIGNER],
    },
  },
  {
    path: 'online-ordering/:vendorType/hash-tags',
    name: 'routes.online_ordering.application.hash-tags',
    component: () => import('./hash-tags/HashTagsListView.vue'),
    meta: {
      allowedRoles: [USER_ROLES.CATALOGUE_SUPERVISOR],
    },
  },
  {
    path: 'online-ordering/:vendorType',
    name: ROUTE_NAMES.ONLINE_ORDERING_VENDOR_ONLINE_PROFILE_LIST,
    component: () =>
      import('./vendor-online-profile-list/VendorOnlineProfileList.ts.vue'),
    meta: {
      allowedRoles: [
        USER_ROLES.CATALOGUE_SUPERVISOR,
        USER_ROLES.CATALOGUE_USER,
      ],
    },
  },
  {
    path: 'online-ordering/:vendorType/creation',
    name: ROUTE_NAMES.ONLINE_ORDERING_VENDOR_ONLINE_PROFILE_CREATION,
    component: () =>
      import(
        './vendor-online-profile-creation/VendorOnlineProfileCreation.ts.vue'
      ),
    meta: {
      allowedRoles: [
        USER_ROLES.CATALOGUE_SUPERVISOR,
        USER_ROLES.CATALOGUE_USER,
      ],
    },
  },
  {
    path: '/online-ordering/:vendorType/:vendorId',
    name: ROUTE_NAMES.ONLINE_ORDERING_VENDOR_ONLINE_PROFILE,
    component: () => import('./vendor-online-profile/VendorOnlineProfile.vue'),
    meta: {
      allowedRoles: [
        USER_ROLES.CATALOGUE_SUPERVISOR,
        USER_ROLES.CATALOGUE_USER,
      ],
    },
  },
  {
    path: 'online-ordering/:vendorType/:vendorId/update',
    name: ROUTE_NAMES.ONLINE_ORDERING_VENDOR_ONLINE_PROFILE_UPDATE,
    component: () =>
      import('./vendor-online-profile-update/VendorOnlineProfileUpdate.ts.vue'),
    meta: {
      allowedRoles: [
        USER_ROLES.CATALOGUE_SUPERVISOR,
        USER_ROLES.CATALOGUE_USER,
      ],
    },
  },
  ...BranchesRoutes,
  {
    path: '/online-ordering/:vendorType/:vendorId/catalogues',
    redirect(to) {
      return {
        name: ROUTE_NAMES.ONLINE_ORDERING_VENDOR_ONLINE_PROFILE,
        params: { ...to.params },
      };
    },
  },

  {
    path: '/online-ordering/:vendorType/:vendorId/catalogues/creation',
    name: ROUTE_NAMES.ONLINE_ORDERING_CATALOGUE_CREATION,
    component: () =>
      import('./catalogue-creation-and-update/CatalogueCreation.ts.vue'),
    meta: {
      allowedRoles: [
        USER_ROLES.CATALOGUE_SUPERVISOR,
        USER_ROLES.CATALOGUE_USER,
      ],
    },
  },
  {
    path: '/online-ordering/:vendorType/:vendorId/catalogues/:catalogueId',
    name: ROUTE_NAMES.ONLINE_ORDERING_CATALOGUE_DETAILS,
    component: () => import('./catalogue/Catalogue.ts.vue'),
    meta: {
      allowedRoles: [
        USER_ROLES.CATALOGUE_SUPERVISOR,
        USER_ROLES.CATALOGUE_USER,
      ],
    },
  },
  {
    path: '/online-ordering/:vendorType/:vendorId/catalogues/:catalogueId/update',
    name: ROUTE_NAMES.ONLINE_ORDERING_CATALOGUE_UPDATE,
    component: () =>
      import('./catalogue-creation-and-update/CatalogueUpdate.ts.vue'),
    meta: {
      allowedRoles: [
        USER_ROLES.CATALOGUE_SUPERVISOR,
        USER_ROLES.CATALOGUE_USER,
      ],
    },
  },
  {
    path: '/online-ordering/:vendorType/:vendorId/catalogues/:catalogueId/items',
    redirect(to) {
      return {
        name: ROUTE_NAMES.ONLINE_ORDERING_CATALOGUE_DETAILS,
        params: { ...to.params },
      };
    },
  },
  {
    path: '/online-ordering/:vendorType/:vendorId/catalogues/:catalogueId/items/creation',
    name: ROUTE_NAMES.ONLINE_ORDERING_CATALOGUE_ITEM_CREATION,
    component: () =>
      import('./catalogue-item-creation/CatalogueItemCreation.ts.vue'),
    meta: {
      allowedRoles: [
        USER_ROLES.CATALOGUE_SUPERVISOR,
        USER_ROLES.CATALOGUE_USER,
      ],
    },
  },
  {
    path: '/online-ordering/:vendorType/:vendorId/catalogues/:catalogueId/items/:itemId/update',
    name: ROUTE_NAMES.ONLINE_ORDERING_CATALOGUE_ITEM_UPDATE,
    component: () =>
      import('./catalogue-item-update/CatalogueItemUpdate.ts.vue'),
    meta: {
      allowedRoles: [
        USER_ROLES.CATALOGUE_SUPERVISOR,
        USER_ROLES.CATALOGUE_USER,
      ],
    },
  },
  {
    path: '/online-ordering/:vendorType/:vendorId/catalogues/:catalogueId/items/:itemId',
    name: ROUTE_NAMES.ONLINE_ORDERING_CATALOGUE_ITEM_DETAILS,
    component: () => import('./catalogue-item/CatalogueItem.ts.vue'),
    meta: {
      allowedRoles: [
        USER_ROLES.CATALOGUE_SUPERVISOR,
        USER_ROLES.CATALOGUE_USER,
      ],
    },
  },
  {
    path: '/online-ordering/:vendorType/:vendorId/catalogues/:catalogueId/items/:itemId/options',
    redirect(to) {
      return {
        name: ROUTE_NAMES.ONLINE_ORDERING_CATALOGUE_ITEM_DETAILS,
        params: { ...to.params },
      };
    },
  },
  {
    path: '/online-ordering/:vendorType/:vendorId/catalogues/:catalogueId/items/:itemId/options/creation',
    name: 'routes.online_ordering.options.create',
    component: () => import('./old/options/AddOption.vue'),
    meta: {
      deprecatedContainer: true,
      allowedRoles: [
        USER_ROLES.CATALOGUE_SUPERVISOR,
        USER_ROLES.CATALOGUE_USER,
      ],
    },
  },
  {
    path: '/online-ordering/:vendorType/:vendorId/catalogues/:catalogueId/items/:itemId/options/:optionId',
    redirect(to) {
      return {
        name: ROUTE_NAMES.ONLINE_ORDERING_CATALOGUE_ITEM_DETAILS,
        params: { ...to.params },
      };
    },
  },
  {
    path: '/online-ordering/:vendorType/:vendorId/catalogues/:catalogueId/items/:itemId/options/:optionId/update',
    name: 'routes.online_ordering.options.edit',
    component: () => import('./old/options/EditOption.vue'),
    meta: {
      deprecatedContainer: true,
      allowedRoles: [
        USER_ROLES.CATALOGUE_SUPERVISOR,
        USER_ROLES.CATALOGUE_USER,
      ],
    },
  },
];
