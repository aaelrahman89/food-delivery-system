import { BaseListingPM } from '@survv/commons/core/base/BaseListingPM';
import { CustomersRepo } from '../../repositories/CustomersRepo';
import {
  DebitCreditNoteList,
  DebitCreditNotesQuery,
} from '../../models/DebitCreditNotes';
import { EntityId } from '@survv/commons/core/types';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { createNotification } from '../../notification';

export class DebitCreditNotesPM extends BaseListingPM {
  private readonly _customerId: EntityId;
  private readonly _customersRepo: CustomersRepo;
  private readonly _notificationService: NotificationService;

  list: DebitCreditNoteList;

  _shouldOpenDebitNoteForm = false;
  _shouldOpenCreditNoteForm = false;

  constructor(options: DebitCreditNotesPMOptions) {
    super({
      query: options.query,
      defaultQuery: {
        sort: {
          creationDate: 'desc',
        },
        limit: 25,
        skip: 0,
      },
    });

    const { notificationService, customerId, customersRepo } = options;
    this._notificationService = notificationService;
    this._customerId = customerId;
    this._customersRepo = customersRepo;

    this.list = {
      totalItemsCount: 0,
      items: [],
    };
  }

  async _hydrate(): Promise<void> {
    try {
      await this._hydrateList();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  async refresh(): Promise<void> {
    try {
      await this._hydrateList();
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    }
  }

  private async _hydrateList(): Promise<void> {
    this.list = await this._customersRepo.getDebitCreditNotesList(
      this._customerId,
      this._listingQuery as DebitCreditNotesQuery
    );
  }

  get shouldOpenDebitNoteForm(): boolean {
    return this._shouldOpenDebitNoteForm;
  }

  get shouldOpenCreditNoteForm(): boolean {
    return this._shouldOpenCreditNoteForm;
  }

  openDebitNoteForm(): void {
    this._shouldOpenDebitNoteForm = true;
  }

  openCreditNoteForm(): void {
    this._shouldOpenCreditNoteForm = true;
  }

  closeDebitNoteForm(): void {
    this._shouldOpenDebitNoteForm = false;
  }

  closeCreditNoteForm(): void {
    this._shouldOpenCreditNoteForm = false;
  }

  async onDebitNoteFormSubmitted(): Promise<void> {
    this.closeDebitNoteForm();
    await this.refresh();
  }

  async onCreditNoteFormSubmitted(): Promise<void> {
    this.closeCreditNoteForm();
    await this.refresh();
  }
}

interface DebitCreditNotesPMOptions {
  customerId: EntityId;
  customersRepo: CustomersRepo;
  notificationService: NotificationService;
  query?: DebitCreditNotesQuery;
}
