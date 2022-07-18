import { BasePM } from '@survv/commons/core/base/BasePM';
import {
  FormSelectionOption,
  mapEnumsToSelections,
} from '@survv/commons/core/forms/selection';
import { LocalError } from '@survv/commons/core/errors/errors';
import { Notification } from '@survv/commons/core/notification/notification';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { OpsUserRoles, User, UserForm } from '../../models/User';
import { UserRole } from '@survv/commons/core/models/UserRole';
import { UsersRepo } from '../../repositories/UsersRepo';
import { createNotification } from '../../notification';

export class UserCreationPM extends BasePM {
  private readonly _notificationService: NotificationService;
  private readonly _usersRepo: UsersRepo;

  _user: User;
  form: UserForm;
  userRoles: Array<FormSelectionOption<UserRole>>;

  constructor({ notificationService, usersRepo }: options) {
    super();
    this._notificationService = notificationService;
    this._usersRepo = usersRepo;

    this._user = new User();
    this.form = new UserForm();
    this.userRoles = mapEnumsToSelections(OpsUserRoles);

    this.form
      .assignSubmitHandler(() => {
        return this._longProcess(async () => {
          await this._usersRepo.createUser(this.form);
        });
      })
      .assignSuccessHandler(() => {
        this._notificationService.notify(Notification.successfulOperation());
      })
      .assignErrorHandler((err) => {
        this._notificationService.notify(createNotification(err));
      });
  }

  onIconLoadingFailure(errModel: LocalError): void {
    this._notificationService.notify(createNotification(errModel));
  }
}

interface options {
  notificationService: NotificationService;
  usersRepo: UsersRepo;
}
