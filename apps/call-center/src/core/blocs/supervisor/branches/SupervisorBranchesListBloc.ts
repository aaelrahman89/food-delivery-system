import { BaseBloc } from '@survv/commons/core/base/BaseBloc';
import { BehaviorSubject } from 'rxjs';
import { BranchB2CStatus } from '@survv/commons/core/models/BranchB2CStatus';
import { BranchesRepo } from '../../../repositories/BranchesRepo';
import { LocalizationService } from '@survv/commons/core/services/LocalizationService';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { ROUTE_NAMES } from '../../../routes/routeNames';
import { RouterService } from '@survv/commons/core/services/RouterService';
import {
  SupervisorBranchesListAction,
  SupervisorBranchesListMessage,
} from './SupervisorBranchesListMessage';
import { createNotification } from '../../../notification';
import { isNotEmpty } from '@survv/commons/core/utils/checks';

export class SupervisorBranchesListBloc extends BaseBloc<
  SupervisorBranchesListAction,
  SupervisorBranchesListMessage
> {
  protected _message: SupervisorBranchesListMessage;
  private _routerService: RouterService;
  private _localizationService: LocalizationService;

  private readonly _branchesRepo: BranchesRepo;
  private readonly _notificationService: NotificationService;

  protected readonly outbox$ =
    new BehaviorSubject<SupervisorBranchesListMessage>(
      new SupervisorBranchesListMessage()
    );

  protected readonly inbox$ = new BehaviorSubject<SupervisorBranchesListAction>(
    new SupervisorBranchesListAction({ type: 'NONE', payload: {} })
  );

  constructor({
    branchesRepo,
    notificationService,
    localizationService,
    routerService,
  }: BranchesListBlocArgsArgs) {
    super();
    this._branchesRepo = branchesRepo;
    this._notificationService = notificationService;
    this._routerService = routerService;
    this._localizationService = localizationService;
    this._message = new SupervisorBranchesListMessage();

    this.inbox().subscribe((action: SupervisorBranchesListAction) => {
      this.handleActions(action);
    });
  }

  protected handleActions(action: SupervisorBranchesListAction): void {
    if (action.type === 'NONE') {
      return;
    }
    const newMessage = this._message.clone();

    switch (action.type) {
      case 'INITIALIZE':
        newMessage.action = action;
        newMessage.tableStatus = 'LOADING';

        newMessage.state.sort = { branchLabel: 'desc' };
        newMessage.state.skip = 0;
        newMessage.state.limit = 25;

        if (isNotEmpty(action.payload)) {
          newMessage.state.skip = action.payload!.skip!;
          newMessage.state.limit = action.payload!.limit!;
          newMessage.state.sort = action.payload!.sort!;
          newMessage.state.filter = action.payload!.filter!;
        }

        newMessage.state.filtersData.statusList = BranchB2CStatus.lookup().map(
          (status) => ({
            label: this._localizationService.localize(status.toString()),
            value: status.valueOf(),
          })
        );

        this._message = newMessage;
        this.outbox$.next(this._message);
        this.fetchBranches();
        this.updateRouteURL();
        break;
      case 'FETCH_BRANCHES':
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
          if ('filter' in action.payload!) {
            newMessage.state.filter = action.payload.filter!;
          }
        }
        this._message = newMessage;
        this.outbox$.next(this._message);
        this.fetchBranches();
        this.updateRouteURL();
        break;
      case 'OPEN_FORM':
        newMessage.action = action;
        newMessage.state.currentBranch.id =
          newMessage.action.payload!.branchId!;
        newMessage.state.currentBranch.label =
          newMessage.action.payload!.label!;
        newMessage.formStatus = 'OPENED';
        this._message = newMessage;
        this.outbox$.next(this._message);
        break;
      case 'CLOSE_FORM':
        newMessage.action = action;
        newMessage.formStatus = 'CLOSED';
        this._message = newMessage;
        this.outbox$.next(this._message);
        break;
      case 'UPDATE_BRANCH_STATUS':
        newMessage.action = action;
        newMessage.tableStatus = 'LOADING';

        this._message = newMessage;
        this.outbox$.next(this._message);
        this.updateBranchStatus(newMessage.action.payload!.form!.status!);
        break;
      case 'NAVIGATE_TO_BRANCH_CATALOGUES':
        newMessage.action = action;
        this.navigateToBranchCatalogues(newMessage.action.payload!.branchId!);
        break;
    }
  }

  private fetchBranches(): void {
    this._branchesRepo
      .listBranches({
        skip: this._message.state.skip,
        sort: this._message.state.sort,
        limit: this._message.state.limit,
        filter: this._message.state.filter,
      })
      .then((branches) => {
        const newMessage = this._message.clone();
        newMessage.tableStatus = 'IDLE';
        newMessage.state.list = branches.map((branch) => {
          return {
            id: branch.id,
            label: branch.label,
            status: this._localizationService.localize(branch.b2cStatus),
          };
        });
        newMessage.state.totalItemsCount = newMessage.state.list.length;
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

  private updateBranchStatus(status: string): void {
    this._branchesRepo
      .updateBranchStatus(this._message.state.currentBranch.id, status)
      .then(() => {
        const newMessage = this._message.clone();
        newMessage.formStatus = 'CLOSED';
        this._message = newMessage;
        this.outbox$.next(this._message);
        this.fetchBranches();
      })
      .catch((error) => {
        const newMessage = this._message.clone();
        this._notificationService.notify(createNotification(error));
        newMessage.tableStatus = 'PROBLEMATIC';
        this._message = newMessage;
        this.outbox$.next(this._message);
      });
  }

  private navigateToBranchCatalogues(branchId: number): void {
    this._routerService
      .redirect({
        name: ROUTE_NAMES.SUPERVISOR_BRANCH_CATALOGUES_LIST,
        params: { branchId: branchId.toString() },
      })
      .catch(() => {});
  }

  private updateRouteURL(): void {
    this._routerService
      .redirect({
        name: ROUTE_NAMES.SUPERVISOR_BRANCHES_LIST,
        query: {
          q: JSON.stringify({
            skip: this._message.state.skip,
            limit: this._message.state.limit,
            sort: this._message.state.sort,
            filter: this._message.state.filter,
          }),
        },
      })
      .catch(() => {});
  }
}

interface BranchesListBlocArgsArgs {
  branchesRepo: BranchesRepo;
  routerService: RouterService;
  localizationService: LocalizationService;
  notificationService: NotificationService;
}
