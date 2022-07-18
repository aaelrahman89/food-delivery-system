import { BaseBloc } from '@survv/commons/core/base/BaseBloc';
import { BehaviorSubject } from 'rxjs';
import { LocalizationService } from '@survv/commons/core/services/LocalizationService';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { ROUTE_NAMES } from '../../../routes/routeNames';
import { RouterService } from '@survv/commons/core/services/RouterService';
import {
  SupervisorAgentsListAction,
  SupervisorAgentsListMessage,
} from './SupervisorAgentsListMessage';
import { UserStatus } from '../../../models/UserStatus';
import { UsersRepo } from '../../../repositories/UsersRepo';
import { createNotification } from '../../../notification';
import { isNotEmpty } from '@survv/commons/core/utils/checks';
import { successfulOperation } from '@survv/commons/core/notification/notification';

export class SupervisorAgentsListBloc extends BaseBloc<
  SupervisorAgentsListAction,
  SupervisorAgentsListMessage
> {
  private readonly _usersRepo: UsersRepo;
  private readonly _routerService: RouterService;
  private readonly _localizationService: LocalizationService;
  private readonly _notificationService: NotificationService;

  protected _message: SupervisorAgentsListMessage;

  protected readonly outbox$ = new BehaviorSubject<SupervisorAgentsListMessage>(
    new SupervisorAgentsListMessage()
  );

  protected readonly inbox$ = new BehaviorSubject<SupervisorAgentsListAction>(
    new SupervisorAgentsListAction({ type: 'NONE', payload: {} })
  );

  constructor({
    usersRepo,
    notificationService,
    localizationService,
    routerService,
  }: BranchesListBlocArgsArgs) {
    super();

    this._usersRepo = usersRepo;
    this._routerService = routerService;
    this._localizationService = localizationService;
    this._notificationService = notificationService;

    this._message = new SupervisorAgentsListMessage();

    this.inbox().subscribe((action: SupervisorAgentsListAction) => {
      this.handleActions(action);
    });
  }

  protected handleActions(action: SupervisorAgentsListAction): void {
    if (action.type === 'NONE') {
      return;
    }
    const newMessage = this._message.clone();

    switch (action.type) {
      case 'INITIALIZE':
        newMessage.action = action;
        newMessage.tableStatus = 'LOADING';

        newMessage.state.sort = { creationDate: 'desc' };
        newMessage.state.skip = 0;
        newMessage.state.limit = 25;

        if (isNotEmpty(action.payload)) {
          newMessage.state.skip = action.payload!.skip!;
          newMessage.state.limit = action.payload!.limit!;
          newMessage.state.sort = action.payload!.sort!;
        }

        this._message = newMessage;
        this.outbox$.next(this._message);
        this.fetchUsers();
        this.updateRouteURL();
        break;
      case 'FETCH_USERS':
        newMessage.action = action;
        newMessage.tableStatus = 'LOADING';
        if (isNotEmpty(action.payload)) {
          if ('skip' in action.payload!) {
            newMessage.state.skip = action.payload.skip!;
          }
          if ('limit' in action.payload!) {
            newMessage.state.limit = action.payload.limit!;
          }
          if ('sort' in action.payload!) {
            newMessage.state.sort = action.payload.sort!;
          }
        }
        this._message = newMessage;
        this.outbox$.next(this._message);
        this.fetchUsers();
        this.updateRouteURL();
        break;
      case 'ACTIVATE_USER':
        newMessage.action = action;
        newMessage.tableStatus = 'LOADING';

        this._message = newMessage;
        this.outbox$.next(this._message);
        this.activateUser(newMessage.action.payload!.userId!);
        break;
      case 'DEACTIVATE_USER':
        newMessage.action = action;
        newMessage.tableStatus = 'LOADING';

        this._message = newMessage;
        this.outbox$.next(this._message);
        this.deactivateUser(newMessage.state.selectedAgent.id);
        break;
      case 'UPDATE_USER':
        newMessage.action = action;

        this._message = newMessage;
        this.outbox$.next(this._message);
        this.updateUser(action.payload!.form!);
        break;
      case 'CREATE_USER':
        newMessage.action = action;

        this._message = newMessage;
        this.outbox$.next(this._message);
        this.createUser(action.payload!.form!);
        break;
      case 'OPEN_DIALOG':
        newMessage.dialogStatus = 'OPENED';
        newMessage.action = action;
        newMessage.state.selectedAgent = {
          id: action!.payload!.userId as number,
          name: action!.payload!.userName as string,
          email: '',
          mobileNo: '',
        };

        this._message = newMessage;
        this.outbox$.next(this._message);
        break;
      case 'CLOSE_DIALOG':
        newMessage.dialogStatus = 'CLOSED';
        newMessage.action = action;
        newMessage.state.selectedAgent = {
          id: 0,
          name: '',
          email: '',
          mobileNo: '',
        };

        this._message = newMessage;
        this.outbox$.next(this._message);
        break;
      case 'OPEN_UPDATE_FORM':
        newMessage.updateFormStatus = 'OPENED';
        newMessage.action = action;
        newMessage.state.form = action!.payload!.form!;

        this._message = newMessage;
        this.outbox$.next(this._message);
        break;
      case 'CLOSE_UPDATE_FORM':
        newMessage.updateFormStatus = 'CLOSED';
        newMessage.updateFormButtonStatus = 'DISABLED';
        newMessage.action = action;
        newMessage.state.form = {
          id: 0,
          name: '',
          email: '',
          mobileNo: '',
        };

        this._message = newMessage;
        this.outbox$.next(this._message);
        break;
      case 'OPEN_CREATION_FORM':
        newMessage.creationFormStatus = 'OPENED';
        newMessage.action = action;

        this._message = newMessage;
        this.outbox$.next(this._message);
        break;
      case 'CLOSE_CREATION_FORM':
        newMessage.creationFormStatus = 'CLOSED';
        newMessage.creationFormButtonStatus = 'DISABLED';
        newMessage.action = action;
        newMessage.state.form = {
          id: 0,
          name: '',
          email: '',
          mobileNo: '',
        };

        this._message = newMessage;
        this.outbox$.next(this._message);
        break;
      case 'VALIDATE_UPDATE_FORM':
        newMessage.action = action;
        newMessage.state.form = {
          ...newMessage.state.form,
          ...action.payload?.form,
        };

        if (this.isUpdateValid(newMessage)) {
          newMessage.updateFormButtonStatus = 'ENABLED';
        } else {
          newMessage.updateFormButtonStatus = 'DISABLED';
        }

        this._message = newMessage;
        this.outbox$.next(this._message);
        break;
      case 'VALIDATE_CREATION_FORM':
        newMessage.action = action;
        newMessage.state.form = {
          ...newMessage.state.form,
          ...action.payload?.form,
        };

        if (this.isCreationValid(newMessage)) {
          newMessage.creationFormButtonStatus = 'ENABLED';
        } else {
          newMessage.creationFormButtonStatus = 'DISABLED';
        }

        this._message = newMessage;
        this.outbox$.next(this._message);
        break;
    }
  }

  private fetchUsers(): void {
    this._usersRepo
      .listAgents({
        skip: this._message.state.skip,
        sort: this._message.state.sort,
        limit: this._message.state.limit,
      })
      .then((users) => {
        const newMessage = this._message.clone();
        newMessage.tableStatus = 'IDLE';
        newMessage.state.totalItemsCount = users.totalItemsCount;
        newMessage.state.list = users.items.map((user) => {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            mobileNo: user.mobileNo,
            status: this._localizationService.localize(user.status),
            active: user.status.equals(UserStatus.ACTIVE),
            creationDate: user.creationDate.toDatetimeString(),
          };
        });
        this._message = newMessage;
        this.outbox$.next(this._message);
      })
      .catch((error) => {
        const newMessage = this._message.clone();
        this._notificationService.notify(createNotification(error));
        newMessage.tableStatus = 'PROBLEMATIC';
        this._message = newMessage;
        this.outbox$.next(this._message);
      });
  }

  private activateUser(userId: number): void {
    this._usersRepo
      .activateUser(userId)
      .then(() => {
        const newMessage = this._message.clone();
        this._notificationService.notify(successfulOperation());
        newMessage.tableStatus = 'IDLE';
        this._message = newMessage;
        this.outbox$.next(this._message);
        this.fetchUsers();
      })
      .catch((error) => {
        const newMessage = this._message.clone();
        this._notificationService.notify(createNotification(error));
        newMessage.tableStatus = 'PROBLEMATIC';
        this._message = newMessage;
        this.outbox$.next(this._message);
      });
  }

  private deactivateUser(userId: number): void {
    this._usersRepo
      .deactivateUser(userId)
      .then(() => {
        const newMessage = this._message.clone();
        this._notificationService.notify(successfulOperation());
        newMessage.tableStatus = 'IDLE';
        newMessage.dialogStatus = 'CLOSED';
        this._message = newMessage;
        this.outbox$.next(this._message);
        this.fetchUsers();
      })
      .catch((error) => {
        const newMessage = this._message.clone();
        this._notificationService.notify(createNotification(error));
        newMessage.tableStatus = 'PROBLEMATIC';
        this._message = newMessage;
        this.outbox$.next(this._message);
      });
  }

  private updateUser(form: {
    id: number;
    name: string;
    email: string;
    mobileNo: string;
  }): void {
    this._usersRepo
      .updateUser({ ...form, roles: ['VendorCallCenterAgent'] })
      .then(() => {
        const newMessage = this._message.clone();
        newMessage.state.form = {
          id: 0,
          name: '',
          email: '',
          mobileNo: '',
        };
        this._notificationService.notify(successfulOperation());
        newMessage.updateFormStatus = 'CLOSED';
        newMessage.updateFormButtonStatus = 'DISABLED';
        this._message = newMessage;
        this.outbox$.next(this._message);
        this.fetchUsers();
      })
      .catch((error) => {
        const newMessage = this._message.clone();
        this._notificationService.notify(createNotification(error));
        newMessage.tableStatus = 'PROBLEMATIC';
        this._message = newMessage;
        this.outbox$.next(this._message);
      });
  }

  private createUser(form: {
    id: number;
    name: string;
    email: string;
    mobileNo: string;
  }): void {
    this._usersRepo
      .createUser({ ...form, roles: ['VendorCallCenterAgent'] })
      .then(() => {
        const newMessage = this._message.clone();
        newMessage.state.form = {
          id: 0,
          name: '',
          email: '',
          mobileNo: '',
        };
        this._notificationService.notify(successfulOperation());
        newMessage.creationFormStatus = 'CLOSED';
        newMessage.creationFormButtonStatus = 'DISABLED';
        this._message = newMessage;
        this.outbox$.next(this._message);
        this.fetchUsers();
      })
      .catch((error) => {
        const newMessage = this._message.clone();
        this._notificationService.notify(createNotification(error));
        newMessage.tableStatus = 'PROBLEMATIC';
        this._message = newMessage;
        this.outbox$.next(this._message);
      });
  }

  private updateRouteURL(): void {
    this._routerService
      .redirect({
        name: ROUTE_NAMES.SUPERVISOR_AGENTS_LIST,
        query: {
          q: JSON.stringify({
            skip: this._message.state.skip,
            limit: this._message.state.limit,
            sort: this._message.state.sort,
          }),
        },
      })
      .catch(() => {});
  }

  isUpdateValid(message: SupervisorAgentsListMessage): boolean {
    return Object.entries(message.updateValidators()).every(
      ([, fn]) => fn() === true
    );
  }

  isCreationValid(message: SupervisorAgentsListMessage): boolean {
    return Object.entries(message.creationValidators()).every(
      ([, fn]) => fn() === true
    );
  }
}

interface BranchesListBlocArgsArgs {
  usersRepo: UsersRepo;
  routerService: RouterService;
  localizationService: LocalizationService;
  notificationService: NotificationService;
}
