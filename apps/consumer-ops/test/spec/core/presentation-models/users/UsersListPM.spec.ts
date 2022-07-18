import { $sb } from '@survv/commons/test/utils/sandbox';
import { Datetime } from '@survv/commons/core/utils/datetime';
import {
  ListUsersRequest,
  ListUsersResponse,
} from '@survv/api/definitions/users';
import { LocalError } from '@survv/commons/core/errors/errors';
import { UserRole } from '@survv/commons/core/models/UserRole';
import { UsersListPM } from '../../../../../src/core/presentation-models/users/UsersListPM';
import { UsersRepoImpl } from '../../../../../src/shell/repositories/users/UsersRepoImpl';
import { assert } from 'chai';
import { createNotification } from '../../../../../src/core/notification';
import { listUsersResponseStub } from '@survv/api/stubs/users';
import { mapListUsersResponseToItemsList } from '../../../../../src/shell/repositories/users/mappers/responses';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { successfulOperation } from '@survv/commons/core/notification/notification';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('UsersListPM', function () {
  describe('init()', function () {
    it('hydrates users list successfully', async function () {
      const pm = new UsersListPM({
        query: { skip: 25, limit: 25 },
        notificationService,
        usersRepo: new UsersRepoImpl(),
      });

      const usersList = listUsersResponseStub();
      usersList.metadata = {
        limit: 25,
        skipped: 25,
        totalReturned: 1,
        totalCount: 1,
      };
      usersList.users = [
        {
          id: 1111,
          fullName: 'user name',
          email: 'user email',
          mobileNo: '01001234567',
          active: true,
          userRoles: ['OpsUser'],
          lastUpdateDate: '2018-09-01T18:04:53.178Z',
          creationDate: '2018-09-01T18:04:53.178Z',
        },
      ];

      await wiremock
        .stub<ListUsersRequest, ListUsersResponse>()
        .request({
          requestLine: 'get /api/v1/users',
          query: { querySpec: { vgql: 'v1', skip: 25, limit: 25 } },
        })
        .response({ status: 200, body: usersList });

      await pm.init();

      assert.equal(pm.list.totalItemsCount, 1);
      assert.equal(pm.list.items[0].id, 1111);
      assert.equal(pm.list.items[0].name, 'user name');
      assert.equal(pm.list.items[0].email, 'user email');
      assert.equal(pm.list.items[0].mobileNo, '01001234567');
      assert.equal(pm.list.items[0].active, true);
      assert.deepEqual(pm.list.items[0].userRoles, [UserRole.OPS_USER]);
      assert.deepEqual(
        pm.list.items[0].lastUpdateDate,
        new Datetime('2018-09-01T18:04:53.178Z')
      );
      assert.deepEqual(
        pm.list.items[0].creationDate,
        new Datetime('2018-09-01T18:04:53.178Z')
      );

      assert.isUndefined(notificationService.notification);
    });
    it('by default, hydrates users list sorted by "lastUpdateDate" & with no skip & limit 25', async function () {
      const pm = new UsersListPM({
        notificationService,
        usersRepo: new UsersRepoImpl(),
      });

      const usersListStub = $sb
        .stub(UsersRepoImpl.prototype, 'listUsers')
        .resolves(mapListUsersResponseToItemsList(listUsersResponseStub()));

      await pm.init();

      assert.isTrue(
        usersListStub.calledOnceWithExactly({
          vgql: 'v1',
          sort: { elements: [{ field: 'lastUpdateDate', order: 'Desc' }] },
          skip: 0,
          limit: 25,
        })
      );
    });
    it('notifies error if failed', async function () {
      const pm = new UsersListPM({
        notificationService,
        usersRepo: new UsersRepoImpl(),
      });

      $sb
        .stub(UsersRepoImpl.prototype, 'listUsers')
        .rejects(new LocalError({ message: 'an error', code: 'TEST_ERROR' }));

      await pm.init();

      assert.deepEqual(
        notificationService.notification,
        createNotification(
          new LocalError({ message: 'an error', code: 'TEST_ERROR' })
        )
      );
    });
  });
  describe('onPaginationUpdated()', function () {
    it('hydrates users list with new query successfully', async function () {
      const pm = new UsersListPM({
        query: { skip: 25, limit: 25 },
        notificationService,
        usersRepo: new UsersRepoImpl(),
      });

      const usersList = listUsersResponseStub();
      usersList.metadata = {
        limit: 25,
        skipped: 25,
        totalReturned: 1,
        totalCount: 1,
      };
      usersList.users = [
        {
          id: 1111,
          fullName: 'user name',
          email: 'user email',
          mobileNo: '01001234567',
          active: true,
          userRoles: ['OpsUser'],
          creationDate: '2018-09-01T18:04:53.178Z',
          lastUpdateDate: '2018-09-01T18:04:53.178Z',
        },
      ];

      await wiremock
        .stub<ListUsersRequest, ListUsersResponse>()
        .request({
          requestLine: 'get /api/v1/users',
          query: { querySpec: { vgql: 'v1', skip: 0, limit: 50 } },
        })
        .response({ status: 200, body: usersList });

      await pm.onPaginationUpdate({ skip: 0, limit: 50 });

      assert.equal(pm.list.totalItemsCount, 1);
      assert.equal(pm.list.items[0].id, 1111);
      assert.equal(pm.list.items[0].name, 'user name');
      assert.equal(pm.list.items[0].email, 'user email');
      assert.equal(pm.list.items[0].mobileNo, '01001234567');
      assert.equal(pm.list.items[0].active, true);
      assert.deepEqual(pm.list.items[0].userRoles, [UserRole.OPS_USER]);
      assert.deepEqual(
        pm.list.items[0].creationDate,
        new Datetime('2018-09-01T18:04:53.178Z')
      );

      assert.isUndefined(notificationService.notification);
    });
    it('notifies error if failed', async function () {
      const pm = new UsersListPM({
        notificationService,
        usersRepo: new UsersRepoImpl(),
      });

      $sb
        .stub(UsersRepoImpl.prototype, 'listUsers')
        .rejects(new LocalError({ message: 'an error', code: 'TEST_ERROR' }));

      await pm.onPaginationUpdate({ skip: 0, limit: 25 });

      assert.deepEqual(
        notificationService.notification,
        createNotification(
          new LocalError({ message: 'an error', code: 'TEST_ERROR' })
        )
      );
    });
  });
  describe('deactivateUser()', function () {
    it('deactivates user successfully', async function () {
      const pm = new UsersListPM({
        usersRepo: new UsersRepoImpl(),
        notificationService,
      });

      await wiremock
        .stub()
        .request({
          requestLine: 'post /api/v1/users/:userId/deactivate',
          params: { userId: 123 },
        })
        .response({ status: 200 });

      await pm.deactivateUser(123);

      assert.deepEqual(notificationService.notification, successfulOperation());
    });
    it('notifies error if deactivation action fails', async function () {
      const pm = new UsersListPM({
        usersRepo: new UsersRepoImpl(),
        notificationService,
      });

      const error = new LocalError({ message: '123', code: 'ACTION_FAILED' });
      $sb.stub(UsersRepoImpl.prototype, 'deactivateUser').rejects(error);

      await pm.deactivateUser(123);

      assert.deepEqual(
        notificationService.notification,
        createNotification(error)
      );
    });
  });
});
