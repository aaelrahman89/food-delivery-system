import {
  AddCreditNoteRequest,
  AddCreditNoteResponse,
  AddDebitNoteRequest,
  AddDebitNoteResponse,
  CustomersListRequest,
  CustomersListResponse,
  DebitCreditNotesListRequest,
  DebitCreditNotesListResponse,
  GetConsumerCustomerByIdRequest,
  GetConsumerCustomerByIdResponse,
} from '@survv/api/definitions/customers';
import {
  CreditNoteForm,
  DebitCreditNoteList,
  DebitCreditNotesQuery,
  DebitNoteForm,
} from '../../../core/models/DebitCreditNotes';
import { Customer, SimplifiedCustomer } from '../../../core/models/Customer';
import { CustomersRepo } from '../../../core/repositories/CustomersRepo';
import { EntityId } from '@survv/commons/core/types';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import {
  ListingQuery,
  filterOperators,
  queryMapper,
} from '@survv/commons/core/models/Query';
import {
  NetworkService,
  networkService,
} from '@survv/commons/shell/backend/networkService';
import {
  SingleFileRequest,
  SingleFileResponse,
} from '@survv/api/definitions/files';
import {
  mapCustomerByIdResponseToCustomer,
  mapCustomerListResponseToCustomers,
  mapDebitCreditNotesToList,
} from './mappers/responses';

export class CustomersRepoImpl implements CustomersRepo {
  private readonly _networkService: NetworkService = networkService;

  async getCustomerById(customerId: EntityId): Promise<Customer> {
    const customer = await this._networkService.request<
      GetConsumerCustomerByIdRequest,
      GetConsumerCustomerByIdResponse
    >({
      requestLine: 'get /consumer/api/v1/customers/:customerId',
      params: { customerId },
    });

    if (customer.imageId !== 0) {
      return this._handleImage(customer);
    }

    return mapCustomerByIdResponseToCustomer(customer, '');
  }

  async listCustomers(
    query?: ListingQuery
  ): Promise<ItemsList<SimplifiedCustomer>> {
    const beQuery = queryMapper({
      ...query,
      filterMap: {
        name: {
          fieldName: 'firstName',
          operator: filterOperators.REGEX,
        },
        mobileNo: {
          fieldName: 'mobileNo',
          operator: filterOperators.REGEX,
        },
        creationDateFrom: {
          fieldName: 'creationDate',
          operator: filterOperators.GTE,
        },
        creationDateTo: {
          fieldName: 'creationDate',
          operator: filterOperators.LTE,
        },
      },
    });

    return mapCustomerListResponseToCustomers(
      await this._networkService.request<
        CustomersListRequest,
        CustomersListResponse
      >({
        requestLine: 'get /consumer/api/v1/customers',
        query: { query: beQuery },
      })
    );
  }

  async addDebitNote(
    customerId: EntityId,
    debitNoteForm: DebitNoteForm
  ): Promise<void> {
    await this._networkService.request<
      AddDebitNoteRequest,
      AddDebitNoteResponse
    >({
      requestLine: 'post /consumer/api/v1/customers/:customerId/debit',
      params: { customerId },
      body: {
        description: debitNoteForm.description,
        amount: debitNoteForm.amount,
      },
    });
  }

  async addCreditNote(
    customerId: EntityId,
    creditNoteForm: CreditNoteForm
  ): Promise<void> {
    await this._networkService.request<
      AddCreditNoteRequest,
      AddCreditNoteResponse
    >({
      requestLine: 'post /consumer/api/v1/customers/:customerId/credit',
      params: { customerId },
      body: {
        description: creditNoteForm.description,
        amount: creditNoteForm.amount,
      },
    });
  }

  async getDebitCreditNotesList(
    customerId: EntityId,
    query: DebitCreditNotesQuery
  ): Promise<DebitCreditNoteList> {
    const beQuery = queryMapper({
      ...query,
      filterMap: {
        from: {
          fieldName: 'creationDate',
          operator: filterOperators.GTE,
        },
        to: {
          fieldName: 'creationDate',
          operator: filterOperators.LTE,
        },
        createdBy: {
          fieldName: 'createdBy.email',
          operator: filterOperators.REGEX,
        },
        serialNumber: {
          fieldName: 'serialNumber',
          operator: filterOperators.EQUAL,
        },
      },
    });

    return mapDebitCreditNotesToList(
      await this._networkService.request<
        DebitCreditNotesListRequest,
        DebitCreditNotesListResponse
      >({
        requestLine:
          'get /consumer/api/v1/customers/:customerId/debit-credit-notes',
        params: { customerId },
        query: { query: beQuery },
      })
    );
  }

  async _handleImage(
    customer: GetConsumerCustomerByIdResponse
  ): Promise<Customer> {
    const { signedUrl } = await this._networkService.request<
      SingleFileRequest,
      SingleFileResponse
    >({
      requestLine: 'get /api/v1/files/:fileId',
      params: { fileId: customer.imageId },
    });

    return mapCustomerByIdResponseToCustomer(customer, signedUrl);
  }
}
