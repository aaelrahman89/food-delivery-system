import { Area } from '../../../../core/models/Area';
import { City } from '../../../../core/models/City';
import { Country } from '../../../../core/models/Country';
import { Customer, SimplifiedCustomer } from '../../../../core/models/Customer';
import {
  CustomerAddress,
  CustomerAddressStatus,
} from '../../../../core/models/CustomerAddress';
import {
  CustomersListResponse,
  DebitCreditNotesListResponse,
  GetConsumerCustomerByIdResponse,
  ListConsumerCustomerAddressesResponse,
} from '@survv/api/definitions/customers';
import { Datetime } from '@survv/commons/core/utils/datetime';
import {
  DebitCreditNoteList,
  DebitCreditNoteListItem,
  DebitCreditNoteType,
} from '../../../../core/models/DebitCreditNotes';
import { Gender } from '../../../../core/models/Gender';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { Money } from '@survv/commons/core/models/money';

export function mapListBusinessCustomerAddressesResponseToCustomerAddressList(
  response: ListConsumerCustomerAddressesResponse
): CustomerAddress[] {
  return response.map(
    (address) =>
      new CustomerAddress({
        id: address.customerAddress.id,
        title: address.customerAddress.title,
        country: new Country({
          ...address.customerAddress.country,
          id: address.customerAddress.country.countryId,
        }),
        city: new City({
          ...address.customerAddress.city,
          id: address.customerAddress.city.cityId,
        }),
        area: new Area({
          ...address.customerAddress.area,
          id: address.customerAddress.area.areaId,
        }),
        addressLine1: address.customerAddress.addressLine1,
        building: address.customerAddress.building,
        floor: address.customerAddress.floor,
        apartmentNo: address.customerAddress.apartmentNo,
        companyName: address.customerAddress.companyName,
        landmark: address.customerAddress.landmark,
        status: new CustomerAddressStatus(address.customerAddress.status),
        pinnedLocation: {
          type: 'Feature',
          geometry: address.customerAddress.pinnedLocation,
          properties: {
            dataType: 'CUSTOMER_LOCATION',
          },
        },
      })
  );
}

export function mapCustomerByIdResponseToCustomer(
  customer: GetConsumerCustomerByIdResponse,
  signedUrl: string
): Customer {
  return new Customer({
    id: customer.id,
    name: customer.name,
    mobileNo: customer.mobileNo,
    balance: new Money(customer.balance),
    birthDate: new Datetime(customer.birthDate),
    email: customer.email,
    gender: new Gender(customer.gender),
    imageUrl: signedUrl,
    creationDate: new Datetime(customer.creationDate),
  });
}

export function mapCustomerListResponseToCustomers(
  response: CustomersListResponse
): ItemsList<SimplifiedCustomer> {
  return {
    totalItemsCount: response.metadata.totalCount,
    items: response.customers.map(
      (customer) =>
        new SimplifiedCustomer({
          id: customer.id,
          name: customer.name,
          mobileNo: customer.mobileNo,
          creationDate: new Datetime(customer.creationDate),
        })
    ),
  };
}

export function mapDebitCreditNotesToList(
  list: DebitCreditNotesListResponse
): DebitCreditNoteList {
  return {
    totalItemsCount: list.metadata.totalCount,
    items: list.notes.map((note) => {
      return new DebitCreditNoteListItem({
        amount: new Money(note.amount),
        createdBy: note.createdBy,
        creationDate: new Datetime(note.creationDate),
        description: note.description,
        id: note.id,
        serialNumber: Number(note.serialNumber),
        type: new DebitCreditNoteType(note.type),
        pdfGenerated: note.pdfStatus === 'GENERATED',
      });
    }),
  };
}
