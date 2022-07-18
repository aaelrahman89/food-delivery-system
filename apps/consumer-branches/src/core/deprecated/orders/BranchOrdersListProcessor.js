import BaseProcessor from '../base/BaseProcessor';
import NetworkService from '../../../shell/services-deprecated/network/NetworkService';
import { CustomerOrderId } from '@survv/commons/core/models/CustomerOrderId';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { HoursRange } from '@survv/commons/core/models/HoursRange';
import { Money } from '@survv/commons/core/models/money';
import { Time } from '@survv/commons/core/models/Time';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import { createConsumerUrl, survvEndpoints } from '../survv.nc';
import { filterOperators, queryMapper } from '@survv/commons/core/models/Query';

class BranchOrdersListProcessor extends BaseProcessor {
  constructor({ query }) {
    super();
    this._query = queryMapper({
      ...query,
      filterMap: {
        orderId: {
          fieldName: 'customerOrderId',
          operator: filterOperators.EQUAL,
        },
        statuses: {
          fieldName: 'status',
          operator: filterOperators.IN,
        },
        scheduledTo: {
          fieldName: 'scheduledTo',
          operator: filterOperators.IN,
        },
        totalFrom: {
          fieldName: 'pickups.0.branchPayableAmount.amount',
          operator: filterOperators.GTE,
        },
        totalTo: {
          fieldName: 'pickups.0.branchPayableAmount.amount',
          operator: filterOperators.LTE,
        },
        from: {
          fieldName: 'creationDate',
          operator: filterOperators.GTE,
        },
        to: {
          fieldName: 'creationDate',
          operator: filterOperators.LTE,
        },
      },
    });
    this._branchId = 0;
  }

  async process() {
    this._branchId = await authTokenRepo.getUserId();

    const vgQuery = this._query ? { query: this._query } : undefined;
    const response = await NetworkService.get(
      createConsumerUrl(
        survvEndpoints.BRANCH_ORDERS,
        { branchId: this._branchId },
        vgQuery
      )
    );

    return {
      totalCount: response.metadata.totalCount,
      orders: response.orders.map(
        ({
          orderId,
          items,
          customerOrderId,
          creationDate,
          lastUpdateDate,
          customerId,
          branchId,
          vendorId,
          addressId,
          paymentMethod,
          notes,
          subTotal,
          tax,
          deliveryFees,
          totalWithoutDeliveryFees,
          total,
          vendorTaskId,
          status,
          type,
          scheduled,
          scheduledTo,
        }) => ({
          orderId,
          items: items.map(
            ({ itemId, price, quantity, notes: itemNotes, options }) => {
              return {
                itemId,
                price,
                quantity,
                notes: itemNotes,
                options,
              };
            }
          ),
          customerOrderId: new CustomerOrderId(customerOrderId),
          status,
          lastUpdateDate: new Datetime(lastUpdateDate),
          customerId,
          branchId,
          vendorId,
          addressId,
          paymentMethod,
          notes,
          subTotal,
          tax,
          deliveryFees: new Money({ amount: deliveryFees, currency: 'EGP' }),
          totalWithoutDeliveryFees: new Money(totalWithoutDeliveryFees),
          total: new Money({ amount: total, currency: 'EGP' }),
          vendorTaskId,
          isB2C: type == 'B2C',
          isC2C: type == 'C2C',
          creationDate: new Datetime(creationDate),
          scheduled,
          scheduledTo: new HoursRange({
            from: new Time(scheduledTo.from),
            to: new Time(scheduledTo.to),
          }),
        })
      ),
    };
  }
}

export default BranchOrdersListProcessor;
