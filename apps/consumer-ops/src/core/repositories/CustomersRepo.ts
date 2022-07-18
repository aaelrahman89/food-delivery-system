import { Customer, SimplifiedCustomer } from '../models/Customer';
import {
  DebitCreditNoteList,
  DebitCreditNotesQuery,
  DebitNoteForm,
} from '../models/DebitCreditNotes';
import { EntityId } from '@survv/commons/core/types';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { ListingQuery } from '@survv/commons/core/models/Query';

class CreditNoteForm {}

export interface CustomersRepo {
  getCustomerById(customerId: EntityId): Promise<Customer>;
  listCustomers(query?: ListingQuery): Promise<ItemsList<SimplifiedCustomer>>;
  addCreditNote(
    customerId: EntityId,
    creditNoteForm: CreditNoteForm
  ): Promise<void>;
  addDebitNote(
    customerId: EntityId,
    debitNoteForm: DebitNoteForm
  ): Promise<void>;
  getDebitCreditNotesList(
    customerId: EntityId,
    query?: DebitCreditNotesQuery
  ): Promise<DebitCreditNoteList>;
}
