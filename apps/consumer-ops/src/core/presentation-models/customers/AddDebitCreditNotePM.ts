import { BasePM } from '@survv/commons/core/base/BasePM';
import { CreditNoteForm, DebitNoteForm } from '../../models/DebitCreditNotes';
import { CustomersRepo } from '../../repositories/CustomersRepo';
import { EntityId } from '@survv/commons/core/types';
import { LocalError } from '@survv/commons/core/errors/errors';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { createNotification } from '../../notification';
import { successfulOperation } from '@survv/commons/core/notification/notification';

export class AddDebitCreditNotePM extends BasePM {
  private readonly _customerId: EntityId;
  private readonly _customersRepo: CustomersRepo;
  private readonly _notificationService: NotificationService;

  debitForm: DebitNoteForm;
  creditForm: CreditNoteForm;

  constructor(options: AddDebitCreditNotePMOptions) {
    super();

    const { customerId, customersRepo, notificationService } = options;
    this._customerId = customerId;
    this._customersRepo = customersRepo;
    this._notificationService = notificationService;

    this.debitForm = new DebitNoteForm();
    this.creditForm = new CreditNoteForm();
    this._assignFormHandlers();
  }

  reset(): void {
    this.debitForm.reset();
    this.creditForm.reset();
  }

  private _assignFormHandlers(): void {
    this._assignDebitFormHandler();
    this._assignCreditFormHandler();
  }

  private _assignDebitFormHandler(): void {
    this.debitForm
      .assignSubmitHandler(async () => {
        await this._longProcess(async () => {
          await this._customersRepo.addDebitNote(
            this._customerId,
            this.debitForm
          );
        });
      })
      .assignSuccessHandler(() => {
        this._notificationService.notify(successfulOperation());
      })
      .assignErrorHandler((err: LocalError) => {
        this._notificationService.notify(createNotification(err));
      });
  }

  private _assignCreditFormHandler(): void {
    this.creditForm
      .assignSubmitHandler(async () => {
        await this._longProcess(async () => {
          await this._customersRepo.addCreditNote(
            this._customerId,
            this.creditForm
          );
        });
      })
      .assignSuccessHandler(() => {
        this._notificationService.notify(successfulOperation());
      })
      .assignErrorHandler((err: LocalError) => {
        this._notificationService.notify(createNotification(err));
      });
  }
}

interface AddDebitCreditNotePMOptions {
  customerId: EntityId;
  customersRepo: CustomersRepo;
  notificationService: NotificationService;
}
