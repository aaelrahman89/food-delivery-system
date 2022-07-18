import {
  CustomerAddress,
  ListingMetadata,
  MoneyWithCurrency,
  MultilingualString,
  OrderingHours,
  VendorType,
} from './common';
import { DeliveryFleet } from './vendors';

export type VendorTaxStatus = string &
  ('INCLUDED' | 'EXCLUDED' | 'NOT_APPLICABLE' | 'NONE');

export type ReferralDiscountType = string & ('FIXED_VALUE' | 'PERCENTAGE');

export type OrderRequest = void;

export interface OrderResponse {
  orderId: number;
  taskId: number;
  vendorId: number;
  fakeVendor: boolean;
  serviceType: VendorType;
  customerOrderId: string;
  vendorDisplayName: MultilingualString;
  vendorRating: number;
  vendorTaskId: string;
  creationDate: string;
  lastUpdateDate: string;
  scheduled: boolean;
  scheduledTo: OrderingHours;
  status: string;
  notes: string;
  type: OrderType;
  items: OrderItem[];
  consumedBalance: MoneyWithCurrency;
  promoCode: {
    definition: {
      id: number;
      name: string;
      usage: PromoCodeUsage;
      type: PromoCodeType;
      value: MoneyWithCurrency;
      percentage: number;
      minSpending: MoneyWithCurrency;
    };
    impact: {
      promotionUsageId: number;
      value: MoneyWithCurrency;
    };
  };
  vendorTaxStatus: VendorTaxStatus;
  subTotalTax: MoneyWithCurrency;
  subTotal: MoneyWithCurrency;
  deliveryFeesTax: MoneyWithCurrency;
  serviceFeeWithTax: MoneyWithCurrency;
  tax: MoneyWithCurrency;
  taxWithoutDeliveryFees: MoneyWithCurrency;
  credit: MoneyWithCurrency;
  totalWithoutDeliveryFees: MoneyWithCurrency;
  total: MoneyWithCurrency;
  totalDueAmount: MoneyWithCurrency;
  balanceImpact: MoneyWithCurrency;
  change: MoneyWithCurrency;
  requestedPaidCash: MoneyWithCurrency;
  paymentMethod: OrderPaymentMethod;
  branchId: number;
  customerId: number;
  addressId: number;
  customerName: string;
  customerMobileNo: string;
  coverPhotosIds: number[];
  branchLabel: string;
  assignedPilot: OrderAssignedPilot;
  address: CustomerAddress;
  rated: boolean;
  refundStatus: string;
  referralCode: {
    definition: {
      id: number;
      name: string;
      refereePercentage: number;
      refereeCap: MoneyWithCurrency;
      referrerAmount: MoneyWithCurrency;
      refereeDiscountType: ReferralDiscountType;
      refereeFixedValue: MoneyWithCurrency;
      refereeMinSpending: MoneyWithCurrency;
    };
    impact: {
      referralUsageId: number;
      referrerId: number;
      refereeImpact: MoneyWithCurrency;
      referrerImpact: MoneyWithCurrency;
    };
    valid: boolean;
  };
  deliveryFees: MoneyWithCurrency;
  returnedChange: MoneyWithCurrency;
  assignedAgent: {
    id: number;
    email: string;
  };
  branchAreaName: MultilingualString;
  deliverBy: DeliveryFleet;
  actionDisplay?: boolean;
}

export type ConsumerOrderRequest = void;
export interface ConsumerOrderResponse {
  orderId: number;
  taskId: number;
  rated: boolean;
  vendorId: number;
  customerOrderId: string;
  vendorDisplayName: MultilingualString;
  fakeVendor: boolean;
  vendorRating: number;
  serviceType: VendorType;
  vendorTaskId: string;
  creationDate: string;
  lastUpdateDate: string;
  vendorTaxStatus: VendorTaxStatus;
  status: string;
  type: OrderType;
  notes: string;
  items: OrderItem[];
  subTotal: MoneyWithCurrency;
  subTotalTax: MoneyWithCurrency;
  tax: MoneyWithCurrency;
  promoCode: {
    definition: {
      id: number;
      name: string;
      usage: PromoCodeUsage;
      type: PromoCodeType;
      value: MoneyWithCurrency;
      percentage: number;
      minSpending: MoneyWithCurrency;
    };
    impact: {
      promotionUsageId: number;
      value: MoneyWithCurrency;
    };
  };
  referralCode: {
    definition: {
      id: number;
      name: string;
      refereePercentage: number;
      refereeCap: MoneyWithCurrency;
      referrerAmount: MoneyWithCurrency;
      refereeDiscountType: ReferralDiscountType;
      refereeFixedValue: MoneyWithCurrency;
      refereeMinSpending: MoneyWithCurrency;
    };
    impact: {
      referralUsageId: number;
      referrerId: number;
      refereeImpact: MoneyWithCurrency;
      referrerImpact: MoneyWithCurrency;
    };
    valid: boolean;
  };
  taxWithoutDeliveryFees: MoneyWithCurrency;
  credit: MoneyWithCurrency;
  totalWithoutDeliveryFees: MoneyWithCurrency;
  serviceFeeWithTax: MoneyWithCurrency;
  total: MoneyWithCurrency;
  totalDueAmount: MoneyWithCurrency;
  consumedBalance: MoneyWithCurrency;
  balanceImpact: MoneyWithCurrency;
  change: MoneyWithCurrency;
  requestedPaidCash: MoneyWithCurrency;
  deliveryFees: MoneyWithCurrency;
  deliveryFeesTax: MoneyWithCurrency;
  paymentMethod: OrderPaymentMethod;
  branchId: number;
  customerId: number;
  addressId: number;
  customerName: string;
  customerMobileNo: string;
  coverPhotosIds: number[];
  branchLabel: string;
  assignedPilot: OrderAssignedPilot;
  address: CustomerAddress;
  refundStatus: string;
  scheduled: boolean;
  scheduledTo: OrderingHours;
  assignedAgent: {
    id: number;
    email: string;
  };
  branchAreaName: MultilingualString;
  deliverBy: DeliveryFleet;
  returnedChange: MoneyWithCurrency;
  actionDisplay: boolean;
}
export interface OrderEnrichmentRequest {
  items: OrderEnrichmentItem[];
}

export type OrderEnrichmentResponse = void;

export type OrderStatus = string &
  (
    | 'REQUESTED'
    | 'CONFIRMED'
    | 'REJECTED'
    | 'SCHEDULED'
    | 'PILOT_REQUESTED'
    | 'PILOT_ASSIGNED'
    | 'COLLECTED'
    | 'DELIVERED'
    | 'CANCELLED'
  );

export interface AcceptOrderRequest {
  orderId: number;
}

export interface AcceptOrderResponse {
  orderId: number;
  orderStatus: OrderStatus;
}

export interface RejectOrderRequest {
  orderId: number;
  rejectionReasonId?: number;
  unavailableItems?: number[];
  unavailableSelections?: number[];
  b2cBranchStatus?: BranchB2CRequestStatus;
  notes?: string;
}

export type RejectOrderResponse = void;

export interface OrderCalculationRequest {
  items: OrderCalculationRequestItem[];
}

export interface OrderCalculationResponse {
  orderId: number;
  total: MoneyWithCurrency;
  subTotal: MoneyWithCurrency;
  tax: MoneyWithCurrency;
  deliveryFees: MoneyWithCurrency;
  deliveryFeesTax: MoneyWithCurrency;
  serviceFeeWithTax: MoneyWithCurrency;
  vendorTaxStatus: VendorTaxStatus;
  subTotalTax: MoneyWithCurrency;
  totalDueAmount: MoneyWithCurrency;
  items: OrderCalculationResponseItem[];
  promoCodeImpact: MoneyWithCurrency;
  refereeImpact: MoneyWithCurrency;
  promoCodeMinSpendingShortage: MoneyWithCurrency;
  promoCodeStillValid: boolean;
  referralCodeMinSpendingShortage: MoneyWithCurrency;
  referralCodeStillValid: boolean;
}

export interface OrderCalculationRequestItem {
  itemId: number;
  quantity: number;
  options: OrderCalculationRequestItemOption[];
}
export interface OrderCalculationRequestItemOption {
  optionId: number;
  selectionIds: number[];
}
export interface OrderCalculationResponseItem {
  itemId: number;
  quantity: number;
  price: MoneyWithCurrency;
  totalPrice: MoneyWithCurrency;
}

export interface OrderItem {
  itemId: number;
  orderItemId: number;
  audioId: number;
  orderItemPhotoIds: number[];
  title: MultilingualString;
  price: MoneyWithCurrency;
  totalPrice: MoneyWithCurrency;
  quantity: number;
  notes: string;
  options: OrderItemOption[];
  available: boolean;
}

export interface OrderItemOptionSelection {
  selectionId: number;
  title: MultilingualString;
  quantity: number;
  price: MoneyWithCurrency;
  available: boolean;
}

export interface OrderItemOption {
  optionId: number;
  title: MultilingualString;
  selections: Array<OrderItemOptionSelection>;
}

export interface OrderAssignedPilot {
  pilotId: number;
  fullName: string;
  mobileNo: string;
  rating: number;
}

export interface OrderEnrichmentItem {
  orderItemId: number;
  itemId: number;
  selections: OrderEnrichmentItemSelection[];
}

export interface OrderEnrichmentItemSelection {
  title: MultilingualString;
  quantity: number;
}

export interface OrderUpdateRequest {
  items: OrderUpdateRequestItem[];
}

export interface OrderUpdateRequestItem {
  orderItemId: number;
  itemId: number;
  quantity: number;
  notes: string;
  options: OrderUpdateRequestItemOption[];
}

export interface OrderUpdateRequestItemOption {
  optionId: number;
  selectionIds: number[];
}

export type OrderUpdateResponse = void;

export type OrderPaymentMethod = string &
  ('Cash' | 'Credit' | 'None' | 'Already_Paid');

export type OrderType = string & ('B2C' | 'C2C' | 'B2B' | 'ERRANDS');

export type OrderChargingStatus = string &
  (
    | 'NOT_APPLICABLE'
    | 'PLACED_ORDER_PENDING_CHARGING'
    | 'PLACED_ORDER_CHARGED'
    | 'DELIVERED_ORDER_PENDING_CHARGING'
    | 'DELIVERED_ORDER_CHARGED'
    | 'PENDING_REFUND'
    | 'REFUNDED'
    | 'ORDER_CASH_BACK_PENDING_CHARGING'
    | 'ORDER_CASH_BACK_CHARGED'
    | 'FAILED'
  );

export type OrderRefundStatus = string &
  ('NOT_APPLICABLE' | 'PENDING_REFUND' | 'REFUNDED' | 'FAILED');

export type OrderRefundReason = string &
  ('NONE' | 'SURVV_CANCELLATION' | 'ORDER_REJECTION' | 'ORDER_UPDATED');

export type PromoCodeType = string & ('NONE' | 'FIXED_VALUE' | 'PERCENTAGE');

export type PromoCodeUsage = string &
  ('DISCOUNT' | 'CASH_BACK' | 'FREE_DELIVERY');

export type OrdersListRequest = void;

export interface OrdersListResponse {
  metadata: ListingMetadata;
  orders: Array<{
    orderId: number;
    tripId: number;
    items: Array<{
      itemId: number;
      title: MultilingualString;
      price: number;
      quantity: number;
      notes: string;
      options: Array<{
        optionId: number;
        selections: Array<{
          selectionId: number;
          price: number;
        }>;
      }>;
    }>;
    customerOrderId: string;
    creationDate: string;
    lastStatusUpdateDate: string;
    lastStatusUpdateDuration: number;
    lastUpdateDate: string;
    customerId: number;
    branchId: number;
    hubId: number;
    branchLabel: string;
    vendorId: number;
    vendorDisplayName: MultilingualString;
    addressId: number;
    paymentMethod: OrderPaymentMethod;
    change: MoneyWithCurrency;
    notes: string;
    subTotal: number;
    tax: number;
    taxWithoutDeliveryFees: MoneyWithCurrency;
    subTotalWithTax: MoneyWithCurrency;
    deliveryFees: number;
    total: number;
    totalWithoutDeliveryFees: MoneyWithCurrency;
    totalDueAmount: MoneyWithCurrency;
    consumedBalance: MoneyWithCurrency;
    balanceImpact: MoneyWithCurrency;
    customerMobileNo: string;
    requestedPaidCash: MoneyWithCurrency;
    totalPaidCash: MoneyWithCurrency;
    vendorTaskId: string;
    status: OrderStatus;
    type: OrderType;
    chargingStatus: OrderChargingStatus;
    refundStatus: OrderRefundStatus;
    refundReason: OrderRefundReason;
    promoCode: {
      definition: {
        id: number;
        name: string;
        usage: PromoCodeUsage;
        type: PromoCodeType;
        minSpending: MoneyWithCurrency;
        value: MoneyWithCurrency;
        percentage: number;
      };
      impact: {
        promotionUsageId: number;
        value: MoneyWithCurrency;
      };
    };
    fakeVendor: boolean;
    referralCode: {
      definition: {
        id: number;
        name: string;
        refereePercentage: number;
        refereeCap: MoneyWithCurrency;
        referrerAmount: MoneyWithCurrency;
        refereeDiscountType: ReferralDiscountType;
        refereeFixedValue: MoneyWithCurrency;
        refereeMinSpending: MoneyWithCurrency;
      };
      impact: {
        referralUsageId: number;
        referrerId: number;
        refereeImpact: MoneyWithCurrency;
        referrerImpact: MoneyWithCurrency;
      };
      valid: true;
    };
  }>;
}

export type QueuedOrdersCountsRequest = void;
export interface QueuedOrdersCountsResponse {
  b2cOrdersCount: number;
  c2cOrdersCount: number;
}

export interface UpdateOrderStatusRequest {
  orderStatus: OrderStatus;
  totalPaid: number;
  rejectionReasonId?: number;
  unavailableItems?: number[];
  unavailableSelections?: number[];
  b2cBranchStatus?: BranchB2CRequestStatus;
  notes?: string;
}
export interface UpdateOrderStatusResponse {
  orderStatus: OrderStatus;
}

export type OrderRejectionReasonsRequest = void;
export interface OrderRejectionReasonsResponse {
  metadata: ListingMetadata;
  rejectionReasons: OrderRejectionReason[];
}
interface OrderRejectionReason {
  id: number;
  label: string;
  orderTypes: RejectionReasonOrderType[];
}
type RejectionReasonOrderType = string & ('B2C' | 'ERRANDS');

export type BranchB2CRequestStatus = string &
  (
    | 'AVAILABLE'
    | 'BUSY_ONE_HOUR'
    | 'BUSY_TWO_HOUR'
    | 'BUSY_THREE_HOUR'
    | 'OUT_OF_SERVICE'
    | 'OUT_OF_WORKING_HOURS'
  );

export type OrderJourneyStopStatus = string &
  (
    | 'REQUESTED'
    | 'CONFIRMED'
    | 'SCHEDULED'
    | 'REJECTED'
    | 'CANCELLED'
    | 'PILOT_REQUESTED'
    | 'PILOT_ASSIGNED'
    | 'COLLECTED'
    | 'DELIVERED'
    | 'PICKUP'
  );

export type OrderJourneyRequest = void;
export interface OrderJourneyResponse {
  orderId: number;
  timelineJourney: OrderTimeLineJourneyStop[];
}

export type OrdersListV2Request = void;

export interface OrdersListV2Response {
  metadata: ListingMetadata;
  orders: Array<{
    orderId: number;
    taskId: number;
    tripId: number;
    pickupCount: number;
    items: {
      itemId: number;
      title: MultilingualString;
      price: number;
      quantity: number;
      notes: string;
      options: [
        {
          optionId: number;
          selections: [
            {
              selectionId: number;
              price: number;
            }
          ];
        }
      ];
    }[];
    customerOrderId: string;
    creationDate: string;
    lastStatusUpdateDate: string;
    lastStatusUpdateDuration: number;
    lastUpdateDate: string;
    acceptanceDate: string;
    customerId: number;
    branchId: number;
    hubId: number;
    branchLabel: string;
    vendorId: number;
    vendorDisplayName: MultilingualString;
    fakeVendor: boolean;
    addressId: number;
    paymentMethod: string;
    change: MoneyWithCurrency;
    notes: string;
    subTotal: number;
    tax: number;
    taxWithoutDeliveryFees: MoneyWithCurrency;
    deliveryFees: number;
    total: number;
    totalWithoutDeliveryFees: MoneyWithCurrency;
    subTotalWithTax: MoneyWithCurrency;
    totalDueAmount: MoneyWithCurrency;
    consumedBalance: MoneyWithCurrency;
    balanceImpact: MoneyWithCurrency;
    customerMobileNo: string;
    requestedPaidCash: MoneyWithCurrency;
    totalPaidCash: MoneyWithCurrency;
    vendorTaskId: string;
    status: string;
    type: string;
    chargingStatus: string;
    refundStatus: string;
    refundReason: string;
    promoCode: {
      definition: {
        id: number;
        name: string;
        usage: string;
        type: string;
        minSpending: MoneyWithCurrency;
        value: MoneyWithCurrency;
        percentage: number;
        ordersCount: number;
        ordersCountOperator: string;
      };
      impact: {
        promotionUsageId: number;
        value: MoneyWithCurrency;
      };
    };
    referralCode: {
      definition: {
        id: number;
        name: string;
        refereeDiscountType: string;
        refereeFixedValue: MoneyWithCurrency;
        refereeMinSpending: MoneyWithCurrency;
        refereePercentage: number;
        refereeCap: MoneyWithCurrency;
        referrerAmount: MoneyWithCurrency;
      };
      impact: {
        referralUsageId: number;
        referrerId: number;
        refereeImpact: MoneyWithCurrency;
        referrerImpact: MoneyWithCurrency;
      };
      valid: boolean;
    };
    cancellationFee: MoneyWithCurrency;
    orderingSystem: string;
    scheduled: boolean;
    scheduledTo: {
      from: string;
      to: string;
    };
    assignedAgent: {
      id: number;
      email: string;
    };
    averagePrepTime: number;
    estimatedDeliveryTimeInMinutes: number;
  }>;
}
interface OrderTimeLineJourneyStop {
  journeyStopStatus: OrderJourneyStopStatus;
  durationInSeconds: number;
  stopDateTime: string;
  actionBy: ActionBy;
  linkedEntity: LinkedEntity;
  data: Record<string, unknown>;
}
interface ActionBy {
  id?: number;
  email?: string;
}
interface LinkedEntity {
  entityId?: number;
  entityName?: string;
}

export interface CancelOrderRequest {
  cancellationReasonId: number;
  requestRefund: boolean;
}

export type CancelOrderResponse = void;

export interface CallCenterAcceptOrderRequest {
  orderId: number;
  vendorOrderId: string;
}

export interface CallCenterAcceptOrderResponse {
  orderId: number;
  orderStatus: string;
}

export interface AssignOrderRequest {
  orderId: number;
}

export type AssignOrderResponse = void;

export interface CallCenterRejectOrderRequest {
  orderId: number;
  rejectionReasonId?: number;
  unavailableItems?: number[];
  unavailableSelections?: number[];
  b2cBranchStatus?: BranchB2CRequestStatus;
  notes?: string;
}

export interface CallCenterRejectOrderResponse {
  orderId: number;
  orderStatus: string;
}
