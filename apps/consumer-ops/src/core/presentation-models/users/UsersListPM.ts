import { BaseListingPM } from '@survv/commons/core/base/BaseListingPM';
import { EntityId } from '@survv/commons/core/types';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { ListingQuery } from '@survv/commons/core/models/Query';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { User } from '../../models/User';
import { UsersRepo } from '../../repositories/UsersRepo';
import { createNotification } from '../../notification';
import { successfulOperation } from '@survv/commons/core/notification/notification';

export class UsersListPM extends BaseListingPM {
  private readonly _usersRepo: UsersRepo;
  private readonly _notificationService: NotificationService;
  list: ItemsList<User>;

  constructor({ query, usersRepo, notificationService }: ConstructorOptions) {
    super({
      query,
      defaultQuery: {
        sort: {
          lastUpdateDate: 'desc',
        },
        skip: 0,
        limit: 25,
      },
    });

    this._usersRepo = usersRepo;
    this._notificationService = notificationService;

    this.list = { totalItemsCount: 0, items: [] };
  }

  async _hydrate(): Promise<void> {
    try {
      this.list = await this._usersRepo.listUsers(this._backendQuery);
    } catch (error) {
      this._notificationService.notify(createNotification(error));
    }
  }

  async deactivateUser(userId: EntityId): Promise<void> {
    try {
      await this._usersRepo.deactivateUser(userId);
      this._notificationService.notify(successfulOperation());
    } catch (error) {
      this._notificationService.notify(createNotification(error));
    }
  }

  async refresh(): Promise<void> {
    await this._hydrate();
  }
}

interface ConstructorOptions {
  query?: ListingQuery;
  usersRepo: UsersRepo;
  notificationService: NotificationService;
}
