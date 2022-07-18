const serverBaseUrl = '/consumer-assets';

function image(strings: TemplateStringsArray): AssetExport {
  const [filename] = strings;
  return {
    url: `${serverBaseUrl}/images/${filename}`,
    filename,
  };
}

function mapMarker(strings: TemplateStringsArray): AssetExport {
  const [filename] = strings;
  return {
    url: `${serverBaseUrl}/images/map-markers/${filename}-30.png`,
    filename: `${filename}-30.png`,
  };
}

function svg(strings: TemplateStringsArray): AssetExport {
  const [filename] = strings;
  return {
    url: `${serverBaseUrl}/images/svg/${filename}.svg`,
    filename: `${filename}.svg`,
  };
}

function sound(strings: TemplateStringsArray): AssetExport {
  const [filename] = strings;
  return {
    url: `${serverBaseUrl}/sounds/${filename}`,
    filename,
  };
}

export interface AssetExport {
  url: string;
  filename: string;
}

export const IMAGE_COMING_SOON = image`coming-soon.svg`;
export const IMAGE_FLAG = image`flag.svg`;
export const IMAGE_HASH_TAGS = image`hash-tags.png`;
export const IMAGE_HOME = image`Home.svg`;
export const IMAGE_IMAGE_LOADER = image`image-loader.svg`;
export const IMAGE_IMAGE_NOT_AVAILABLE = image`image-not-available.svg`;
export const IMAGE_IMAGE_NOT_FOUND = image`image-not-found.svg`;
export const IMAGE_LOGO = image`brand-logo.png`;
export const IMAGE_LOGO_WHITE = image`logo-white.svg`;
export const IMAGE_MAP_MARKER_GREEN = image`map-marker-green.svg`;
export const IMAGE_MAP_MARKER_RED = image`map-marker-red.svg`;
export const IMAGE_NO_PHOTO = image`no-photo.svg`;
export const IMAGE_NO_PROFILE = image`no-profile.svg`;
export const IMAGE_ORDERS = image`orders.svg`;
export const IMAGE_PROFILE_FALLBACK = image`profile-fallback.svg`;
export const IMAGE_VENDOR = image`vendor.svg`;
export const IMAGE_VESPA = image`vespa.svg`;
export const IMAGE_BRAND_LOGO = image`brand-logo.png`;
export const IMAGE_ORDER_EMPTY_STATE = image`agent-order-empty.png`;
export const IMAGE_LOGIN_BG = image`login-bg.jpg`;

export const MAP_MARKER_ASSIGNMENT_LOCATION = mapMarker`assignment-location`;
export const MAP_MARKER_BRANCH_HUB = mapMarker`branch-hub`;
export const MAP_MARKER_BRANCH_LOCATION = mapMarker`branch-location`;
export const MAP_MARKER_DELIVERY_POINT = mapMarker`delivery-point`;
export const MAP_MARKER_HUB = mapMarker`hub`;
export const MAP_MARKER_HUB_SELECTED = mapMarker`hub-selected`;
export const MAP_MARKER_NUMBERED_1 = mapMarker`numbered-1`;
export const MAP_MARKER_NUMBERED_2 = mapMarker`numbered-2`;
export const MAP_MARKER_NUMBERED_3 = mapMarker`numbered-3`;
export const MAP_MARKER_NUMBERED_4 = mapMarker`numbered-4`;
export const MAP_MARKER_NUMBERED_5 = mapMarker`numbered-5`;
export const MAP_MARKER_NUMBERED_6 = mapMarker`numbered-6`;
export const MAP_MARKER_NUMBERED_7 = mapMarker`numbered-7`;
export const MAP_MARKER_NUMBERED_8 = mapMarker`numbered-8`;
export const MAP_MARKER_NUMBERED_9 = mapMarker`numbered-9`;
export const MAP_MARKER_PILOT_HUB = mapMarker`pilot-hub`;

export const SVG_GLOBAL_ARROW_DOWN = svg`global-arrow-down`;
export const SVG_GLOBAL_ARROW_RIGHT = svg`global-arrow-right`;
export const SVG_GLOBAL_DASHBOARD = svg`global-dashboard`;
export const SVG_GLOBAL_EDIT = svg`global-edit`;
export const SVG_GLOBAL_ERROR = svg`global-error`;
export const SVG_GLOBAL_HELP = svg`global-help`;
export const SVG_GLOBAL_LOCALIZATION = svg`global-localization`;
export const SVG_GLOBAL_LOGOUT = svg`global-logout`;
export const SVG_GLOBAL_MORE = svg`global-more`;
export const SVG_GLOBAL_ONLINE_ORDERS = svg`global-online-orders`;
export const SVG_GLOBAL_SCHEDULED_ORDERS = svg`global-scheduled-orders`;
export const SVG_GLOBAL_PROMOTION = svg`global-promotion`;
export const SVG_GLOBAL_REMOVE = svg`global-remove`;
export const SVG_GLOBAL_SHIFT_BACK_LTR = svg`global-shift-back-ltr`;
export const SVG_GLOBAL_SHIFT_BACK_RTL = svg`global-shift-back-rtl`;
export const SVG_GLOBAL_SURGE = svg`global-surge`;
export const SVG_GLOBAL_WARNING = svg`global-warning`;
export const SVG_GLOBAL_UNAVAILABLE = svg`global-unavailable`;
export const SVG_GLOBAL_CARET_DOWN = svg`caret-down`;

export const SVG_SURVV_LOGO_ICON = svg`survv-logo-icon`;
export const SVG_ICON_TOOLTIP = svg`icon-tooltip`;
export const SVG_ICON_COLLAPSE = svg`icon-collapse`;
export const SVG_ICON_DRAG = svg`icon-drag`;
export const SVG_ICON_EXPAND = svg`icon-expand`;
export const SVG_ICON_PLUS = svg`icon-plus`;
export const SVG_ICON_GALLERY_COVER = svg`icon-gallery-cover`;
export const SVG_ICON_NEW_UPDATE = svg`icon-new-update`;
export const SVG_ICON_NOTIFICATIONS = svg`icon-notifications`;
export const SVG_ICON_REMOVE = svg`icon-remove`;
export const SVG_ICON_EDIT = svg`icon-edit`;
export const SVG_ICON_SEARCH = svg`icon-search`;
export const SVG_ICON_CIRCLE_CHECK = svg`icon-circle-check`;
export const SVG_ICON_TRASH = svg`icon-trash`;
export const SVG_IMAGE_NOT_FOUND = svg`image-not-found`;
export const SVG_LOGO_LTR = svg`logo-ltr`;
export const SVG_LOGO_RTL = svg`logo-rtl`;
export const SVG_ICON_WARNING = svg`warning`;
export const SVG_NAVIGATION_BALANCE = svg`navigation-balance`;
export const SVG_NAVIGATION_CATALOGUE = svg`navigation-catalogue`;
export const SVG_NAVIGATION_CONSUMPTION = svg`navigation-consumption`;
export const SVG_NAVIGATION_CUSTOMERS = svg`navigation-customers`;
export const SVG_NAVIGATION_DISPUTE = svg`navigation-dispute`;
export const SVG_NAVIGATION_HOME = svg`navigation-home`;
export const SVG_NAVIGATION_JOURNAL = svg`navigation-journal`;
export const SVG_NAVIGATION_ORDERS = svg`navigation-orders`;
export const SVG_NAVIGATION_PILOT = svg`navigation-pilot`;
export const SVG_NAVIGATION_RECEIPTS = svg`navigation-receipts`;
export const SVG_TAG_GROUP = svg`tag-group`;
export const SVG_TAG_TYPE_ALLERGIES = svg`tag-type-allergies`;
export const SVG_TAG_TYPE_CUISINE = svg`tag-type-cuisine`;
export const SVG_TAG_TYPE_DIETARY = svg`tag-type-dietary`;
export const SVG_TAG_TYPE_PICKUP = svg`tag-type-pickup`;
export const SVG_TAG_TYPE_VENUE = svg`tag-type-venue`;
export const SVG_FILE = svg`files`;
export const SVG_NAVIGATION_APPLICATION = svg`navigation-app`;
export const SVG_NAVIGATION_BANK = svg`navigation-bank`;
export const SVG_NAVIGATION_E_SHOP = svg`navigation-e-shop`;
export const SVG_NAVIGATION_FLEET_CUSTOMERS = svg`navigation-fleet-customers`;
export const SVG_NAVIGATION_FOOD = svg`navigation-food`;
export const SVG_NAVIGATION_GEO_SETTINGS = svg`navigation-geo-settings`;
export const SVG_NAVIGATION_GROCERIES = svg`navigation-groceries`;
export const SVG_NAVIGATION_HUB = svg`navigation-hub`;
export const SVG_NAVIGATION_IDENTITY = svg`navigation-identity`;
export const SVG_NAVIGATION_LOGOUT = svg`navigation-logout`;
export const SVG_NAVIGATION_LIVE_OPS_DASHBOARD = svg`navigation-live-ops-dashboard`;
export const SVG_NAVIGATION_LIVE_OPS_FLEET = svg`navigation-live-ops-fleet`;
export const SVG_NAVIGATION_LIVE_OPS_ORDERS = svg`navigation-live-ops-orders`;
export const SVG_NAVIGATION_ONLINE_ORDERS = svg`navigation-online-orders`;
export const SVG_NAVIGATION_PET = svg`navigation-pet`;
export const SVG_NAVIGATION_PHARMACY = svg`navigation-pharmacy`;
export const SVG_NAVIGATION_TRACKING = svg`navigation-tracking`;
export const SVG_NAVIGATION_VENDORS = svg`navigation-vendors`;
export const SVG_NAVIGATION_LIVE_OPS = svg`navigation-live-ops`;
export const SVG_NAVIGATION_ERRANDS = svg`navigation-shopping-cart`;
export const SVG_NAVIGATION_COMPLAINTS = svg`navigation-complaints`;
export const SVG_NAVIGATION_C2C = svg`navigation-c2c`;
export const SVG_NAVIGATION_CAMPAIGNS = svg`navigation-campaigns`;
export const SVG_NAVIGATION_REFERRAL = svg`refer`;
export const SVG_NAVIGATION_TAX_TIERS = svg`navigation-tax-tiers`;
export const SVG_NAVIGATION_C2C_PRICING = svg`navigation-c2c-pricing`;
export const SVG_NAVIGATION_SERVICE_CONFIG = svg`navigation-service-config`;
export const SVG_NAVIGATION_REFERRAL_REPORT = svg`navigation-coupon`;
export const SVG_NAVIGATION_LIVE_ORDERS = svg`navigation-live-orders`;
export const SVG_NAVIGATION_BRANCHES = svg`navigation-branches`;
export const SVG_NAVIGATION_BURGER_LTR = svg`navigation-burger-ltr`;
export const SVG_NAVIGATION_BURGER_RTL = svg`navigation-burger-rtl`;
export const SVG_NAVIGATION_AGENTS = svg`navigation-agents`;
export const SVG_NAVIGATION_NOTIFICATIONS = svg`notifications`;

export const SOUND_INCOMING_ONLINE_ORDER = sound`incoming-online-order.mp3`;
