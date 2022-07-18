import { $sb } from '@survv/commons/test/utils/sandbox';
import {
  ListVendorUsersRequest,
  ListVendorUsersResponse,
} from '@survv/api/definitions/vendors';
import { LocalizationServiceMockImpl } from '@survv/commons/test/mocks/LocalizationServiceMockImpl';
import { Observable } from 'rxjs';
import { ROUTE_NAMES } from '../../../../../src/core/routes/routeNames';
import { RouterServiceMockImpl } from '@survv/commons/test/mocks/RouterServiceMockImpl';
import {
  UsersListAction,
  UsersListMessage,
} from '../../../../../src/core/blocs/users/UsersListMessage';
import { UsersListBloc } from '../../../../../src/core/blocs/users/UsersListBloc';
import { UsersRepoImpl } from '../../../../../src/shell/repositories/users/UsersRepoImpl';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import {
  backendUsersListStub,
  fetchUsersActionMessages,
  initializeActionMessages,
  mappedUsersListStub,
} from './UsersListBlocTestData';
import { createNotification } from '../../../../../src/core/notification';
import { deepEqual } from '@survv/commons/core/utils/checks';
import { expect } from 'chai';
import { kvStorage } from '@survv/pwa/shell/kv-storage-impl';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { successfulOperation } from '@survv/commons/core/notification/notification';
import { take } from 'rxjs/operators';
import { validationMessages } from '@survv/commons/core/validations/form-validators';
import { vendorUserCreationResponse } from '@survv/api/stubs/vendors';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('UsersListBloc Unit', function () {
  let bloc: UsersListBloc;
  const localizationService = new LocalizationServiceMockImpl();
  const routerService = new RouterServiceMockImpl();

  beforeEach(function () {
    bloc = new UsersListBloc({
      usersRepo: new UsersRepoImpl(),
      routerService,
      localizationService,
      notificationService,
    });
  });

  describe('on INITIALIZE', function () {
    it('initializes with given (sort/filter/skip/limit) correctly', function (done) {
      const {
        defaultMessage,
        initializeLoadingMessage,
        initializeUsersListDoneMessage,
      } =
        initializeActionMessages(
          localizationService
        ).inCaseInitializeSucceeded();

      initializeLoadingMessage.action = new UsersListAction({
        type: 'INITIALIZE',
        payload: {
          skip: 100,
          limit: 50,
          sort: { creationDate: 'asc' },
        },
      });
      initializeLoadingMessage.state.skip = 100;
      initializeLoadingMessage.state.limit = 50;
      initializeLoadingMessage.state.sort = { creationDate: 'asc' };

      $sb
        .stub(UsersRepoImpl.prototype, 'listUsers')
        .resolves(mappedUsersListStub());

      const messages: UsersListMessage[] = [];
      (bloc.outbox() as Observable<UsersListMessage>).pipe(take(3)).subscribe({
        next: (message: UsersListMessage) => {
          messages.push(message);
        },
        error: (err: Error) => {
          throw err;
        },
        complete: () => {
          expect(messages[0]).deep.equal(defaultMessage, 'first message');
          expect(messages[1]).deep.equal(
            initializeLoadingMessage,
            'second message'
          );
          expect(
            messages.some((message) => {
              return (
                message.tableStatus === 'IDLE' &&
                deepEqual(
                  message.state.list,
                  initializeUsersListDoneMessage.state.list
                )
              );
            })
          ).to.be.true;
          expect(routerService.route).deep.equal({
            name: ROUTE_NAMES.USERS_LIST,
            query: {
              q: JSON.stringify({
                skip: 100,
                limit: 50,
                sort: { creationDate: 'asc' },
              }),
            },
          });
          done();
        },
      });

      bloc.inbox().next(
        new UsersListAction({
          type: 'INITIALIZE',
          payload: {
            skip: 100,
            limit: 50,
            sort: { creationDate: 'asc' },
          },
        })
      );
    });
    it('initializes with no (sort/filter/skip/limit) given correctly', function (done) {
      const {
        defaultMessage,
        initializeLoadingMessage,
        initializeUsersListDoneMessage,
      } =
        initializeActionMessages(
          localizationService
        ).inCaseInitializeSucceeded();

      $sb
        .stub(UsersRepoImpl.prototype, 'listUsers')
        .resolves(mappedUsersListStub());

      const messages: UsersListMessage[] = [];
      (bloc.outbox() as Observable<UsersListMessage>).pipe(take(3)).subscribe({
        next: (message: UsersListMessage) => {
          messages.push(message);
        },
        error: (err: Error) => {
          throw err;
        },
        complete: () => {
          expect(messages[0]).deep.equal(defaultMessage, 'first message');
          expect(messages[1]).deep.equal(
            initializeLoadingMessage,
            'second message'
          );
          expect(
            messages.some((message) => {
              return (
                message.tableStatus === 'IDLE' &&
                deepEqual(
                  message.state.list,
                  initializeUsersListDoneMessage.state.list
                )
              );
            })
          ).to.be.true;
          done();
        },
      });

      bloc.inbox().next(
        new UsersListAction({
          type: 'INITIALIZE',
        })
      );
    });
    it('handles initialization failure successfully', function (done) {
      const {
        defaultMessage,
        initializeLoadingMessage,
        initializeUsersListProblematicMessage,
      } =
        initializeActionMessages(localizationService).inCaseInitializeFailed();

      $sb
        .stub(UsersRepoImpl.prototype, 'listUsers')
        .rejects(new Error('an error'));

      const messages: UsersListMessage[] = [];
      (bloc.outbox() as Observable<UsersListMessage>).pipe(take(3)).subscribe({
        next: (message: UsersListMessage) => {
          messages.push(message);
        },
        error: (err: Error) => {
          throw err;
        },
        complete: () => {
          expect(messages[0]).deep.equal(defaultMessage, 'first message');
          expect(messages[1]).deep.equal(
            initializeLoadingMessage,
            'second message'
          );
          expect(
            messages.some((message) => {
              return (
                message.tableStatus ===
                initializeUsersListProblematicMessage.tableStatus
              );
            })
          ).to.be.true;

          expect(notificationService.notification).deep.equal(
            createNotification(new Error('an error'))
          );
          done();
        },
      });

      bloc.inbox().next(
        new UsersListAction({
          type: 'INITIALIZE',
        })
      );
    });
  });
  describe('on FETCH_USERS', function () {
    it('fetches users with given (sort/filter/skip/limit) correctly', function (done) {
      const {
        defaultMessage,
        fetchUsersLoadingMessage,
        fetchUsersDoneMessage,
      } =
        fetchUsersActionMessages(
          localizationService
        ).inCaseFetchingUsersSucceeded();

      fetchUsersLoadingMessage.action = new UsersListAction({
        type: 'FETCH_USERS',
        payload: {
          skip: 100,
          limit: 50,
          sort: { creationDate: 'asc' },
        },
      });
      fetchUsersLoadingMessage.state.skip = 100;
      fetchUsersLoadingMessage.state.limit = 50;
      fetchUsersLoadingMessage.state.sort = { creationDate: 'asc' };

      $sb
        .stub(UsersRepoImpl.prototype, 'listUsers')
        .resolves(mappedUsersListStub());

      const messages: UsersListMessage[] = [];
      (bloc.outbox() as Observable<UsersListMessage>).pipe(take(3)).subscribe({
        next: (message: UsersListMessage) => {
          messages.push(message);
        },
        error: (err: Error) => {
          throw err;
        },
        complete: () => {
          expect(messages[0]).deep.equal(defaultMessage, 'first message');
          expect(messages[1]).deep.equal(
            fetchUsersLoadingMessage,
            'second message'
          );
          expect(
            messages.some((message) => {
              return (
                message.tableStatus === 'IDLE' &&
                deepEqual(message.state.list, fetchUsersDoneMessage.state.list)
              );
            })
          ).to.be.true;
          done();
        },
      });

      bloc.inbox().next(
        new UsersListAction({
          type: 'FETCH_USERS',
          payload: {
            skip: 100,
            limit: 50,
            sort: { creationDate: 'asc' },
          },
        })
      );
    });
    it('fetches users with no (sort/filter/skip/limit) given correctly', function (done) {
      const {
        defaultMessage,
        fetchUsersLoadingMessage,
        fetchUsersDoneMessage,
      } =
        fetchUsersActionMessages(
          localizationService
        ).inCaseFetchingUsersSucceeded();

      $sb
        .stub(UsersRepoImpl.prototype, 'listUsers')
        .resolves(mappedUsersListStub());

      const messages: UsersListMessage[] = [];
      (bloc.outbox() as Observable<UsersListMessage>).pipe(take(3)).subscribe({
        next: (message: UsersListMessage) => {
          messages.push(message);
        },
        error: (err: Error) => {
          throw err;
        },
        complete: () => {
          expect(messages[0]).deep.equal(defaultMessage, 'first message');
          expect(messages[1]).deep.equal(
            fetchUsersLoadingMessage,
            'second message'
          );
          expect(
            messages.some((message) => {
              return (
                message.tableStatus === 'IDLE' &&
                deepEqual(message.state.list, fetchUsersDoneMessage.state.list)
              );
            })
          ).to.be.true;
          done();
        },
      });

      bloc.inbox().next(
        new UsersListAction({
          type: 'FETCH_USERS',
        })
      );
    });
    it('handles fetching users failure successfully', function (done) {
      const {
        defaultMessage,
        fetchUsersLoadingMessage,
        fetchUsersProblematicMessage,
      } =
        fetchUsersActionMessages(
          localizationService
        ).inCaseFetchingUsersFailed();

      $sb
        .stub(UsersRepoImpl.prototype, 'listUsers')
        .rejects(new Error('an error'));

      const messages: UsersListMessage[] = [];
      (bloc.outbox() as Observable<UsersListMessage>).pipe(take(3)).subscribe({
        next: (message: UsersListMessage) => {
          messages.push(message);
        },
        error: (err: Error) => {
          throw err;
        },
        complete: () => {
          expect(messages[0]).deep.equal(defaultMessage, 'first message');
          expect(messages[1]).deep.equal(
            fetchUsersLoadingMessage,
            'second message'
          );
          expect(
            messages.some((message) => {
              return (
                message.tableStatus === fetchUsersProblematicMessage.tableStatus
              );
            })
          ).to.be.true;

          expect(notificationService.notification).deep.equal(
            createNotification(new Error('an error'))
          );
          done();
        },
      });

      bloc.inbox().next(
        new UsersListAction({
          type: 'FETCH_USERS',
        })
      );
    });
  });
  describe('on ACTIVATE_USER', function () {
    it('activates user successfully', function (done) {
      $sb
        .stub(UsersRepoImpl.prototype, 'listUsers')
        .resolves(mappedUsersListStub());
      $sb.stub(UsersRepoImpl.prototype, 'activateUser').resolves();

      const messages: UsersListMessage[] = [];
      (bloc.outbox() as Observable<UsersListMessage>).pipe(take(4)).subscribe({
        next: (message: UsersListMessage) => {
          messages.push(message);
        },
        error: (err: Error) => {
          throw err;
        },
        complete: () => {
          expect(messages[0]).deep.equal(
            new UsersListMessage(),
            'first message'
          );
          expect(
            messages[1].tableStatus === 'LOADING' &&
              messages[1].action.type === 'ACTIVATE_USER'
          ).to.be.true;
          expect(
            messages.some((message) => {
              return (
                message.tableStatus === 'IDLE' && message.state.list.length > 0
              );
            })
          ).to.be.true;
          expect(notificationService.notification).to.deep.equal(
            successfulOperation()
          );
          done();
        },
      });

      bloc.inbox().next(
        new UsersListAction({
          type: 'ACTIVATE_USER',
          payload: { userId: 123 },
        })
      );
    });
    it('handles user activation failure successfully', function (done) {
      $sb
        .stub(UsersRepoImpl.prototype, 'activateUser')
        .rejects(new Error('an error'));

      const messages: UsersListMessage[] = [];
      (bloc.outbox() as Observable<UsersListMessage>).pipe(take(3)).subscribe({
        next: (message: UsersListMessage) => {
          messages.push(message);
        },
        error: (err: Error) => {
          throw err;
        },
        complete: () => {
          expect(messages[0]).deep.equal(
            new UsersListMessage(),
            'first message'
          );
          expect(
            messages[1].tableStatus === 'LOADING' &&
              messages[1].action.type === 'ACTIVATE_USER'
          ).to.be.true;
          expect(messages[2].tableStatus === 'PROBLEMATIC').to.be.true;
          expect(notificationService.notification).to.deep.equal(
            createNotification(new Error('an error'))
          );
          done();
        },
      });

      bloc.inbox().next(
        new UsersListAction({
          type: 'ACTIVATE_USER',
          payload: { userId: 123 },
        })
      );
    });
  });
  describe('on DEACTIVATE_USER', function () {
    it('deactivates user successfully', function (done) {
      $sb
        .stub(UsersRepoImpl.prototype, 'listUsers')
        .resolves(mappedUsersListStub());
      $sb.stub(UsersRepoImpl.prototype, 'deactivateUser').resolves();

      const messages: UsersListMessage[] = [];
      (bloc.outbox() as Observable<UsersListMessage>).pipe(take(4)).subscribe({
        next: (message: UsersListMessage) => {
          messages.push(message);
        },
        error: (err: Error) => {
          throw err;
        },
        complete: () => {
          expect(messages[0]).deep.equal(
            new UsersListMessage(),
            'first message'
          );
          expect(
            messages[1].tableStatus === 'LOADING' &&
              messages[1].action.type === 'DEACTIVATE_USER'
          ).to.be.true;
          expect(
            messages.some((message) => {
              return (
                message.tableStatus === 'IDLE' && message.state.list.length > 0
              );
            })
          ).to.be.true;
          expect(notificationService.notification).to.deep.equal(
            successfulOperation()
          );
          done();
        },
      });

      bloc.inbox().next(
        new UsersListAction({
          type: 'DEACTIVATE_USER',
        })
      );
    });
    it('handles user deactivation failure successfully', function (done) {
      $sb
        .stub(UsersRepoImpl.prototype, 'deactivateUser')
        .rejects(new Error('an error'));

      const messages: UsersListMessage[] = [];
      (bloc.outbox() as Observable<UsersListMessage>).pipe(take(3)).subscribe({
        next: (message: UsersListMessage) => {
          messages.push(message);
        },
        error: (err: Error) => {
          throw err;
        },
        complete: () => {
          expect(messages[0]).deep.equal(
            new UsersListMessage(),
            'first message'
          );
          expect(
            messages[1].tableStatus === 'LOADING' &&
              messages[1].action.type === 'DEACTIVATE_USER'
          ).to.be.true;
          expect(messages[2].tableStatus === 'PROBLEMATIC').to.be.true;
          expect(notificationService.notification).to.deep.equal(
            createNotification(new Error('an error'))
          );
          done();
        },
      });

      bloc.inbox().next(
        new UsersListAction({
          type: 'DEACTIVATE_USER',
          payload: { userId: 123 },
        })
      );
    });
  });
  describe('on OPEN_DIALOG', function () {
    it('it opens the dialog and selects user successfully', function (done) {
      $sb
        .stub(UsersRepoImpl.prototype, 'listUsers')
        .resolves(mappedUsersListStub());

      const messages: UsersListMessage[] = [];
      (bloc.outbox() as Observable<UsersListMessage>).pipe(take(2)).subscribe({
        next: (message: UsersListMessage) => {
          messages.push(message);
        },
        error: (err: Error) => {
          throw err;
        },
        complete: () => {
          expect(messages[0]).deep.equal(
            new UsersListMessage(),
            'first message'
          );
          expect(messages[1].dialogStatus).to.equal('OPENED', 'second message');
          expect(messages[1].state.selectedUser).to.deep.equal(
            {
              id: 456,
              name: 'Ahmed',
              email: '',
              mobileNo: '',
              role: '',
            },
            'second message'
          );
          done();
        },
      });

      bloc.inbox().next(
        new UsersListAction({
          type: 'OPEN_DIALOG',
          payload: {
            userId: 456,
            userName: 'Ahmed',
          },
        })
      );
    });
  });
  describe('on CLOSE_DIALOG', function () {
    it('it closes the dialog and clears selected user successfully', function (done) {
      $sb
        .stub(UsersRepoImpl.prototype, 'listUsers')
        .resolves(mappedUsersListStub());

      const messages: UsersListMessage[] = [];
      (bloc.outbox() as Observable<UsersListMessage>).pipe(take(2)).subscribe({
        next: (message: UsersListMessage) => {
          messages.push(message);
        },
        error: (err: Error) => {
          throw err;
        },
        complete: () => {
          expect(messages[0]).deep.equal(
            new UsersListMessage(),
            'first message'
          );
          expect(messages[1].dialogStatus).to.equal('CLOSED', 'second message');
          expect(messages[1].state.selectedUser).to.deep.equal(
            {
              id: 0,
              name: '',
              email: '',
              mobileNo: '',
              role: '',
            },
            'second message'
          );
          done();
        },
      });

      bloc.inbox().next(
        new UsersListAction({
          type: 'CLOSE_DIALOG',
        })
      );
    });
  });
  describe('on OPEN_CREATION_FORM', function () {
    it('it opens the creation form successfully', function (done) {
      $sb
        .stub(UsersRepoImpl.prototype, 'listUsers')
        .resolves(mappedUsersListStub());

      const messages: UsersListMessage[] = [];
      (bloc.outbox() as Observable<UsersListMessage>).pipe(take(2)).subscribe({
        next: (message: UsersListMessage) => {
          messages.push(message);
        },
        error: (err: Error) => {
          throw err;
        },
        complete: () => {
          expect(messages[0]).deep.equal(
            new UsersListMessage(),
            'first message'
          );
          expect(messages[1].creationFormStatus).to.equal(
            'OPENED',
            'second message'
          );
          done();
        },
      });

      bloc.inbox().next(
        new UsersListAction({
          type: 'OPEN_CREATION_FORM',
        })
      );
    });
  });
  describe('on CLOSE_CREATION_FORM', function () {
    it('it closes the creation form and clears the form successfully', function (done) {
      $sb
        .stub(UsersRepoImpl.prototype, 'listUsers')
        .resolves(mappedUsersListStub());

      const messages: UsersListMessage[] = [];
      (bloc.outbox() as Observable<UsersListMessage>).pipe(take(2)).subscribe({
        next: (message: UsersListMessage) => {
          messages.push(message);
        },
        error: (err: Error) => {
          throw err;
        },
        complete: () => {
          expect(messages[0]).deep.equal(
            new UsersListMessage(),
            'first message'
          );
          expect(messages[1].creationFormStatus).to.equal(
            'CLOSED',
            'second message'
          );
          expect(messages[1].state.form).to.deep.equal(
            {
              id: 0,
              name: '',
              email: '',
              mobileNo: '',
              role: '',
            },
            'second message'
          );
          done();
        },
      });

      bloc.inbox().next(
        new UsersListAction({
          type: 'CLOSE_CREATION_FORM',
        })
      );
    });
  });
  describe('on OPEN_UPDATE_FORM', function () {
    it('it opens the update form and fills user successfully', function (done) {
      $sb
        .stub(UsersRepoImpl.prototype, 'listUsers')
        .resolves(mappedUsersListStub());

      const messages: UsersListMessage[] = [];
      (bloc.outbox() as Observable<UsersListMessage>).pipe(take(2)).subscribe({
        next: (message: UsersListMessage) => {
          messages.push(message);
        },
        error: (err: Error) => {
          throw err;
        },
        complete: () => {
          expect(messages[0]).deep.equal(
            new UsersListMessage(),
            'first message'
          );
          expect(messages[1].updateFormStatus).to.equal(
            'OPENED',
            'second message'
          );
          expect(messages[1].state.form).to.deep.equal(
            {
              id: 123,
              name: 'Ahmed',
              email: 'e@e.com',
              mobileNo: '010',
              role: 'VendorCallCenterAgent',
            },
            'second message'
          );
          done();
        },
      });

      bloc.inbox().next(
        new UsersListAction({
          type: 'OPEN_UPDATE_FORM',
          payload: {
            form: {
              id: 123,
              name: 'Ahmed',
              email: 'e@e.com',
              mobileNo: '010',
              role: 'VendorCallCenterAgent',
            },
          },
        })
      );
    });
  });
  describe('on CLOSE_UPDATE_FORM', function () {
    it('it closes the update form and clears the form successfully', function (done) {
      $sb
        .stub(UsersRepoImpl.prototype, 'listUsers')
        .resolves(mappedUsersListStub());

      const messages: UsersListMessage[] = [];
      (bloc.outbox() as Observable<UsersListMessage>).pipe(take(2)).subscribe({
        next: (message: UsersListMessage) => {
          messages.push(message);
        },
        error: (err: Error) => {
          throw err;
        },
        complete: () => {
          expect(messages[0]).deep.equal(
            new UsersListMessage(),
            'first message'
          );
          expect(messages[1].updateFormStatus).to.equal(
            'CLOSED',
            'second message'
          );
          expect(messages[1].state.form).to.deep.equal(
            {
              id: 0,
              name: '',
              email: '',
              mobileNo: '',
              role: '',
            },
            'second message'
          );
          done();
        },
      });

      bloc.inbox().next(
        new UsersListAction({
          type: 'CLOSE_UPDATE_FORM',
        })
      );
    });
  });
  describe('on VALIDATE_CREATION_FORM', function () {
    it('it enables the submit button when the creation form is valid', function (done) {
      $sb
        .stub(UsersRepoImpl.prototype, 'listUsers')
        .resolves(mappedUsersListStub());

      const messages: UsersListMessage[] = [];
      (bloc.outbox() as Observable<UsersListMessage>).pipe(take(2)).subscribe({
        next: (message: UsersListMessage) => {
          messages.push(message);
        },
        error: (err: Error) => {
          throw err;
        },
        complete: () => {
          expect(messages[0]).deep.equal(
            new UsersListMessage(),
            'first message'
          );
          expect(messages[1].creationFormButtonStatus).to.equal(
            'ENABLED',
            'second message'
          );
          done();
        },
      });

      bloc.inbox().next(
        new UsersListAction({
          type: 'VALIDATE_CREATION_FORM',
          payload: {
            form: {
              id: 0,
              name: 'Ahmed',
              email: 'e@e.com',
              mobileNo: '010',
              role: 'VendorCallCenterAgent',
            },
          },
        })
      );
    });
    it('it disables the submit button when the creation form is not valid', function (done) {
      $sb
        .stub(UsersRepoImpl.prototype, 'listUsers')
        .resolves(mappedUsersListStub());

      const messages: UsersListMessage[] = [];
      (bloc.outbox() as Observable<UsersListMessage>).pipe(take(2)).subscribe({
        next: (message: UsersListMessage) => {
          messages.push(message);
        },
        error: (err: Error) => {
          throw err;
        },
        complete: () => {
          expect(messages[0]).deep.equal(
            new UsersListMessage(),
            'first message'
          );
          expect(messages[1].creationFormButtonStatus).to.equal(
            'DISABLED',
            'second message'
          );
          done();
        },
      });

      bloc.inbox().next(
        new UsersListAction({
          type: 'VALIDATE_CREATION_FORM',
          payload: {
            form: {
              id: 0,
              name: '',
              email: 'e@e.com',
              mobileNo: '010',
              role: 'VendorCallCenterAgent',
            },
          },
        })
      );
    });
    it('it returns FORM_INVALID_EMAIL when email entered is invalid', function () {
      const message = new UsersListMessage();

      message.state.form.email = 's123';

      expect(message.creationValidators().email()).equal(
        validationMessages.FORM_INVALID_EMAIL
      );
    });
    it('it returns FORM_REQUIRED_INPUT when email is missing', function () {
      const message = new UsersListMessage();

      message.state.form.email = '';

      expect(message.creationValidators().email()).equal(
        validationMessages.FORM_REQUIRED_INPUT
      );
    });
  });
  describe('on VALIDATE_UPDATE_FORM', function () {
    it('it enables the submit button when the update form is valid', function (done) {
      $sb
        .stub(UsersRepoImpl.prototype, 'listUsers')
        .resolves(mappedUsersListStub());

      const messages: UsersListMessage[] = [];
      (bloc.outbox() as Observable<UsersListMessage>).pipe(take(2)).subscribe({
        next: (message: UsersListMessage) => {
          messages.push(message);
        },
        error: (err: Error) => {
          throw err;
        },
        complete: () => {
          expect(messages[0]).deep.equal(
            new UsersListMessage(),
            'first message'
          );
          expect(messages[1].updateFormButtonStatus).to.equal(
            'ENABLED',
            'second message'
          );
          done();
        },
      });

      bloc.inbox().next(
        new UsersListAction({
          type: 'VALIDATE_UPDATE_FORM',
          payload: {
            form: {
              id: 123,
              name: 'Ahmed',
              email: 'e@e.com',
              mobileNo: '010',
              role: 'VendorCallCenterAgent',
            },
          },
        })
      );
    });
    it('it disables the submit button when the update form is not valid', function (done) {
      $sb
        .stub(UsersRepoImpl.prototype, 'listUsers')
        .resolves(mappedUsersListStub());

      const messages: UsersListMessage[] = [];
      (bloc.outbox() as Observable<UsersListMessage>).pipe(take(2)).subscribe({
        next: (message: UsersListMessage) => {
          messages.push(message);
        },
        error: (err: Error) => {
          throw err;
        },
        complete: () => {
          expect(messages[0]).deep.equal(
            new UsersListMessage(),
            'first message'
          );
          expect(messages[1].updateFormButtonStatus).to.equal(
            'DISABLED',
            'second message'
          );
          done();
        },
      });

      bloc.inbox().next(
        new UsersListAction({
          type: 'VALIDATE_UPDATE_FORM',
          payload: {
            form: {
              id: 123,
              name: '',
              email: 'e@e.com',
              mobileNo: '010',
              role: 'VendorCallCenterAgent',
            },
          },
        })
      );
    });
    it('it returns FORM_INVALID_EMAIL when email entered is invalid', function () {
      const message = new UsersListMessage();

      message.state.form.email = 's123';

      expect(message.updateValidators().email()).equal(
        validationMessages.FORM_INVALID_EMAIL
      );
    });
    it('it returns FORM_REQUIRED_INPUT when email is missing', function () {
      const message = new UsersListMessage();

      message.state.form.email = '';

      expect(message.updateValidators().email()).equal(
        validationMessages.FORM_REQUIRED_INPUT
      );
    });
  });
  describe('on CREATE_USER', function () {
    it('creates the user successfully', function (done) {
      $sb
        .stub(UsersRepoImpl.prototype, 'listUsers')
        .resolves(mappedUsersListStub());
      $sb.stub(UsersRepoImpl.prototype, 'createUser').resolves();

      const messages: UsersListMessage[] = [];
      (bloc.outbox() as Observable<UsersListMessage>).pipe(take(4)).subscribe({
        next: (message: UsersListMessage) => {
          messages.push(message);
        },
        error: (err: Error) => {
          throw err;
        },
        complete: () => {
          expect(messages[0]).deep.equal(
            new UsersListMessage(),
            'first message'
          );
          expect(messages[1].action.type === 'CREATE_USER').to.be.true;
          expect(messages[1].action!.payload!.form).deep.equal({
            id: 0,
            name: 'Ahmed',
            email: 'e@e.com',
            mobileNo: '010',
            role: 'VendorCallCenterAgent',
          });
          expect(
            messages.some((message) => {
              return (
                message.tableStatus === 'IDLE' && message.state.list.length > 0
              );
            })
          ).to.be.true;
          expect(notificationService.notification).to.deep.equal(
            successfulOperation()
          );
          done();
        },
      });

      bloc.inbox().next(
        new UsersListAction({
          type: 'CREATE_USER',
          payload: {
            form: {
              id: 0,
              name: 'Ahmed',
              email: 'e@e.com',
              mobileNo: '010',
              role: 'VendorCallCenterAgent',
            },
          },
        })
      );
    });
    it('handles user creation failure successfully', function (done) {
      $sb.stub(UsersRepoImpl.prototype, 'createUser').rejects();

      const messages: UsersListMessage[] = [];
      (bloc.outbox() as Observable<UsersListMessage>).pipe(take(3)).subscribe({
        next: (message: UsersListMessage) => {
          messages.push(message);
        },
        error: (err: Error) => {
          throw err;
        },
        complete: () => {
          expect(messages[0]).deep.equal(
            new UsersListMessage(),
            'first message'
          );
          expect(messages[1].action.type === 'CREATE_USER').to.be.true;
          expect(messages[1].action!.payload!.form).deep.equal({
            id: 0,
            name: 'Ahmed',
            email: 'e@e.com',
            mobileNo: '010',
            role: 'VendorCallCenterAgent',
          });
          expect(messages[2].tableStatus === 'PROBLEMATIC').to.be.true;
          done();
        },
      });

      bloc.inbox().next(
        new UsersListAction({
          type: 'CREATE_USER',
          payload: {
            form: {
              id: 0,
              name: 'Ahmed',
              email: 'e@e.com',
              mobileNo: '010',
              role: 'VendorCallCenterAgent',
            },
          },
        })
      );
    });
  });
  describe('on UPDATE_USER', function () {
    it('updates the user successfully', function (done) {
      $sb
        .stub(UsersRepoImpl.prototype, 'listUsers')
        .resolves(mappedUsersListStub());
      $sb.stub(UsersRepoImpl.prototype, 'updateUser').resolves();

      const messages: UsersListMessage[] = [];
      (bloc.outbox() as Observable<UsersListMessage>).pipe(take(4)).subscribe({
        next: (message: UsersListMessage) => {
          messages.push(message);
        },
        error: (err: Error) => {
          throw err;
        },
        complete: () => {
          expect(messages[0]).deep.equal(
            new UsersListMessage(),
            'first message'
          );
          expect(messages[1].action.type === 'UPDATE_USER').to.be.true;
          expect(messages[1].action!.payload!.form).deep.equal({
            id: 123,
            name: 'Ahmed',
            email: 'e@e.com',
            mobileNo: '010',
            role: 'VendorCallCenterAgent',
          });
          expect(
            messages.some((message) => {
              return (
                message.tableStatus === 'IDLE' && message.state.list.length > 0
              );
            })
          ).to.be.true;
          expect(notificationService.notification).to.deep.equal(
            successfulOperation()
          );
          done();
        },
      });

      bloc.inbox().next(
        new UsersListAction({
          type: 'UPDATE_USER',
          payload: {
            form: {
              id: 123,
              name: 'Ahmed',
              email: 'e@e.com',
              mobileNo: '010',
              role: 'VendorCallCenterAgent',
            },
          },
        })
      );
    });
    it('handles user update failure successfully', function (done) {
      $sb.stub(UsersRepoImpl.prototype, 'updateUser').rejects();

      const messages: UsersListMessage[] = [];
      (bloc.outbox() as Observable<UsersListMessage>).pipe(take(3)).subscribe({
        next: (message: UsersListMessage) => {
          messages.push(message);
        },
        error: (err: Error) => {
          throw err;
        },
        complete: () => {
          expect(messages[0]).deep.equal(
            new UsersListMessage(),
            'first message'
          );
          expect(messages[1].action.type === 'UPDATE_USER').to.be.true;
          expect(messages[1].action!.payload!.form).deep.equal({
            id: 123,
            name: 'Ahmed',
            email: 'e@e.com',
            mobileNo: '010',
            role: 'VendorCallCenterAgent',
          });
          expect(messages[2].tableStatus === 'PROBLEMATIC').to.be.true;
          done();
        },
      });

      bloc.inbox().next(
        new UsersListAction({
          type: 'UPDATE_USER',
          payload: {
            form: {
              id: 123,
              name: 'Ahmed',
              email: 'e@e.com',
              mobileNo: '010',
              role: 'VendorCallCenterAgent',
            },
          },
        })
      );
    });
  });
});

describe('UsersListBloc Integration', function () {
  let bloc: UsersListBloc;
  const dummyUserId = 123;
  const dummyUserName = 'Ahmed';
  const localizationService = new LocalizationServiceMockImpl();
  const routerService = new RouterServiceMockImpl();

  beforeEach(function () {
    bloc = new UsersListBloc({
      usersRepo: new UsersRepoImpl(),
      routerService,
      localizationService,
      notificationService,
    });
  });

  it('should initialize successfully', function (done) {
    const {
      defaultMessage,
      initializeLoadingMessage,
      initializeUsersListDoneMessage,
    } =
      initializeActionMessages(localizationService).inCaseInitializeSucceeded();

    const saveTokenPromise = authTokenRepo.saveToken(
      'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXJ2diIsInN1YiI6IjEyMyJ9.R36RdWYK1-v31uZCkYGv8G6B8432MhZY7HKZ21w-OZs'
    );

    $sb.stub(kvStorage, 'getItem').withArgs('vendor-id').resolves(123);

    const usersListingMockPromise = wiremock
      .stub<ListVendorUsersRequest, ListVendorUsersResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/vendor-users',
        query: {
          query: {
            vgql: 'v1',
            skip: 0,
            limit: 25,
            sort: {
              elements: [
                {
                  field: 'creationDate',
                  order: 'Desc',
                },
              ],
            },
            filter: {
              elements: [
                {
                  field: 'vendorId',
                  operator: 'eq',
                  value: 123,
                },
              ],
            },
          },
        },
      })
      .response({
        status: 200,
        body: backendUsersListStub(),
      });

    saveTokenPromise
      .then(() => {
        usersListingMockPromise
          .then(() => {
            const messages: UsersListMessage[] = [];
            (bloc.outbox() as Observable<UsersListMessage>)
              .pipe(take(3))
              .subscribe({
                next: (message: UsersListMessage) => {
                  messages.push(message);
                },
                error: (err: Error) => {
                  throw err;
                },
                complete: () => {
                  expect(messages[0]).deep.equal(
                    defaultMessage,
                    'first message'
                  );
                  expect(messages[1]).deep.equal(
                    initializeLoadingMessage,
                    'second message'
                  );
                  expect(messages[2]).deep.equal(
                    initializeUsersListDoneMessage,
                    'third message'
                  );

                  expect(routerService.route).deep.equal({
                    name: ROUTE_NAMES.USERS_LIST,
                    query: {
                      q: JSON.stringify({
                        skip: 0,
                        limit: 25,
                        sort: { creationDate: 'desc' },
                      }),
                    },
                  });
                  done();
                },
              });

            bloc.inbox().next(
              new UsersListAction({
                type: 'INITIALIZE',
              })
            );
          })
          .catch((err: Error) => {
            throw err;
          });
      })
      .catch((err: Error) => {
        throw err;
      });
  });
  it('should activate user successfully', function (done) {
    const { defaultMessage, fetchUsersDoneMessage } =
      fetchUsersActionMessages(
        localizationService
      ).inCaseFetchingUsersSucceeded();

    const saveTokenPromise = authTokenRepo.saveToken(
      'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXJ2diIsInN1YiI6IjEyMyJ9.R36RdWYK1-v31uZCkYGv8G6B8432MhZY7HKZ21w-OZs'
    );

    $sb.stub(kvStorage, 'getItem').withArgs('vendor-id').resolves(123);

    const usersListingMockPromise = wiremock
      .stub<ListVendorUsersRequest, ListVendorUsersResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/vendor-users',
        query: {
          query: {
            vgql: 'v1',
            skip: 0,
            limit: 25,
            sort: {
              elements: [
                {
                  field: 'creationDate',
                  order: 'Desc',
                },
              ],
            },
            filter: {
              elements: [
                {
                  field: 'vendorId',
                  operator: 'eq',
                  value: 123,
                },
              ],
            },
          },
        },
      })
      .response({
        status: 200,
        body: backendUsersListStub(),
      });

    const activateUserMockPromise = wiremock
      .stub()
      .request({
        requestLine: 'put /consumer/api/v1/vendor-users/:userId/activate',
        params: { userId: dummyUserId },
      })
      .response({ status: 200 });

    saveTokenPromise
      .then(() => {
        Promise.all([usersListingMockPromise, activateUserMockPromise])
          .then(() => {
            const messages: UsersListMessage[] = [];
            (bloc.outbox() as Observable<UsersListMessage>)
              .pipe(take(4))
              .subscribe({
                next: (message: UsersListMessage) => {
                  messages.push(message);
                },
                error: (err: Error) => {
                  throw err;
                },
                complete: () => {
                  expect(messages[0]).deep.equal(
                    defaultMessage,
                    'first message'
                  );
                  expect(
                    messages.some((message) => {
                      return (
                        message.tableStatus === 'LOADING' &&
                        message.action.type === 'ACTIVATE_USER' &&
                        message.action.payload?.userId === 123
                      );
                    })
                  ).to.be.true;
                  expect(
                    messages.some((message) => {
                      return (
                        message.tableStatus === 'IDLE' &&
                        deepEqual(
                          message.state.list,
                          fetchUsersDoneMessage.state.list
                        )
                      );
                    })
                  ).to.be.true;
                  expect(notificationService.notification).to.deep.equal(
                    successfulOperation()
                  );
                  done();
                },
              });

            bloc.inbox().next(
              new UsersListAction({
                type: 'ACTIVATE_USER',
                payload: {
                  userId: dummyUserId,
                },
              })
            );
          })
          .catch((err: Error) => {
            throw err;
          });
      })
      .catch((err: Error) => {
        throw err;
      });
  });
  it('should deactivate user successfully', function (done) {
    const { defaultMessage, fetchUsersDoneMessage } =
      fetchUsersActionMessages(
        localizationService
      ).inCaseFetchingUsersSucceeded();

    const saveTokenPromise = authTokenRepo.saveToken(
      'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXJ2diIsInN1YiI6IjEyMyJ9.R36RdWYK1-v31uZCkYGv8G6B8432MhZY7HKZ21w-OZs'
    );

    $sb.stub(kvStorage, 'getItem').withArgs('vendor-id').resolves(123);

    const usersListingMockPromise = wiremock
      .stub<ListVendorUsersRequest, ListVendorUsersResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/vendor-users',
        query: {
          query: {
            vgql: 'v1',
            skip: 0,
            limit: 25,
            sort: {
              elements: [
                {
                  field: 'creationDate',
                  order: 'Desc',
                },
              ],
            },
            filter: {
              elements: [
                {
                  field: 'vendorId',
                  operator: 'eq',
                  value: 123,
                },
              ],
            },
          },
        },
      })
      .response({
        status: 200,
        body: backendUsersListStub(),
      });

    const deactivateUserMockPromise = wiremock
      .stub()
      .request({
        requestLine: 'put /consumer/api/v1/vendor-users/:userId/deactivate',
        params: { userId: dummyUserId },
      })
      .response({ status: 200 });

    saveTokenPromise
      .then(() => {
        Promise.all([usersListingMockPromise, deactivateUserMockPromise])
          .then(() => {
            const messages: UsersListMessage[] = [];
            (bloc.outbox() as Observable<UsersListMessage>)
              .pipe(take(5))
              .subscribe({
                next: (message: UsersListMessage) => {
                  messages.push(message);
                },
                error: (err: Error) => {
                  throw err;
                },
                complete: () => {
                  expect(messages[0]).deep.equal(
                    defaultMessage,
                    'first message'
                  );
                  expect(
                    messages.some((message) => {
                      return (
                        message.action.type === 'OPEN_DIALOG' &&
                        message.action.payload?.userId === 123
                      );
                    })
                  ).to.be.true;
                  expect(
                    messages.some((message) => {
                      return (
                        message.tableStatus === 'LOADING' &&
                        message.action.type === 'DEACTIVATE_USER'
                      );
                    })
                  ).to.be.true;
                  expect(
                    messages.some((message) => {
                      return (
                        message.tableStatus === 'IDLE' &&
                        message.dialogStatus === 'CLOSED' &&
                        message.action.type === 'DEACTIVATE_USER'
                      );
                    })
                  ).to.be.true;
                  expect(
                    messages.some((message) => {
                      return (
                        message.tableStatus === 'IDLE' &&
                        deepEqual(
                          message.state.list,
                          fetchUsersDoneMessage.state.list
                        )
                      );
                    })
                  ).to.be.true;
                  expect(notificationService.notification).to.deep.equal(
                    successfulOperation()
                  );
                  done();
                },
              });

            bloc.inbox().next(
              new UsersListAction({
                type: 'OPEN_DIALOG',
                payload: {
                  userId: dummyUserId,
                  userName: dummyUserName,
                },
              })
            );

            setTimeout(() => {
              bloc.inbox().next(
                new UsersListAction({
                  type: 'DEACTIVATE_USER',
                })
              );
            }, 0);
          })
          .catch((err: Error) => {
            throw err;
          });
      })
      .catch((err: Error) => {
        throw err;
      });
  });
  it('should create user successfully', function (done) {
    const saveTokenPromise = authTokenRepo.saveToken(
      'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXJ2diIsInN1YiI6IjEyMyJ9.R36RdWYK1-v31uZCkYGv8G6B8432MhZY7HKZ21w-OZs'
    );

    $sb.stub(kvStorage, 'getItem').withArgs('vendor-id').resolves(123);

    const usersListingMockPromise = wiremock
      .stub<ListVendorUsersRequest, ListVendorUsersResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/vendor-users',
        query: {
          query: {
            vgql: 'v1',
            skip: 0,
            limit: 25,
            sort: {
              elements: [
                {
                  field: 'creationDate',
                  order: 'Desc',
                },
              ],
            },
            filter: {
              elements: [
                {
                  field: 'vendorId',
                  operator: 'eq',
                  value: 123,
                },
              ],
            },
          },
        },
      })
      .response({
        status: 200,
        body: backendUsersListStub(),
      });

    const createUserMockPromise = wiremock
      .stub()
      .request({
        requestLine: 'post /consumer/api/v1/vendor-users',
        body: {
          name: 'Ahmed',
          email: 'e@e.com',
          mobileNo: '010',
          roles: ['VendorCallCenterAgent'],
          vendorId: 123,
        },
      })
      .response({ status: 200, body: vendorUserCreationResponse() });

    saveTokenPromise
      .then(() => {
        Promise.all([usersListingMockPromise, createUserMockPromise])
          .then(() => {
            const messages: UsersListMessage[] = [];
            (bloc.outbox() as Observable<UsersListMessage>)
              .pipe(take(5))
              .subscribe({
                next: (message: UsersListMessage) => {
                  messages.push(message);
                },
                error: (err: Error) => {
                  throw err;
                },
                complete: () => {
                  expect(messages[0]).deep.equal(
                    new UsersListMessage(),
                    'first message'
                  );
                  expect(
                    messages.some((message) => {
                      return message.action.type === 'OPEN_CREATION_FORM';
                    })
                  ).to.be.true;
                  expect(
                    messages.some((message) => {
                      return (
                        message.action.type === 'CREATE_USER' &&
                        deepEqual(message.action!.payload!.form, {
                          id: 0,
                          name: 'Ahmed',
                          email: 'e@e.com',
                          mobileNo: '010',
                          role: 'VendorCallCenterAgent',
                        })
                      );
                    })
                  ).to.be.true;
                  expect(
                    messages.some((message) => {
                      return (
                        message.tableStatus === 'IDLE' &&
                        message.creationFormStatus === 'CLOSED' &&
                        message.action.type === 'CREATE_USER'
                      );
                    })
                  ).to.be.true;
                  expect(notificationService.notification).to.deep.equal(
                    successfulOperation()
                  );
                  done();
                },
              });

            bloc.inbox().next(
              new UsersListAction({
                type: 'OPEN_CREATION_FORM',
              })
            );

            setTimeout(() => {
              bloc.inbox().next(
                new UsersListAction({
                  type: 'CREATE_USER',
                  payload: {
                    form: {
                      id: 0,
                      name: 'Ahmed',
                      email: 'e@e.com',
                      mobileNo: '010',
                      role: 'VendorCallCenterAgent',
                    },
                  },
                })
              );
            }, 0);
          })
          .catch((err: Error) => {
            throw err;
          });
      })
      .catch((err: Error) => {
        throw err;
      });
  });
  it('should update user successfully', function (done) {
    const saveTokenPromise = authTokenRepo.saveToken(
      'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXJ2diIsInN1YiI6IjEyMyJ9.R36RdWYK1-v31uZCkYGv8G6B8432MhZY7HKZ21w-OZs'
    );

    $sb.stub(kvStorage, 'getItem').withArgs('vendor-id').resolves(123);

    const usersListingMockPromise = wiremock
      .stub<ListVendorUsersRequest, ListVendorUsersResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/vendor-users',
        query: {
          query: {
            vgql: 'v1',
            skip: 0,
            limit: 25,
            sort: {
              elements: [
                {
                  field: 'creationDate',
                  order: 'Desc',
                },
              ],
            },
            filter: {
              elements: [
                {
                  field: 'vendorId',
                  operator: 'eq',
                  value: 123,
                },
              ],
            },
          },
        },
      })
      .response({
        status: 200,
        body: backendUsersListStub(),
      });

    const updateUserMockPromise = wiremock
      .stub()
      .request({
        requestLine: 'put /consumer/api/v1/vendor-users/:userId',
        params: { userId: dummyUserId },
        body: {
          name: 'Ahmed',
          mobileNo: '010',
          roles: ['VendorCallCenterAgent'],
          vendorId: 123,
        },
      })
      .response({ status: 200 });

    saveTokenPromise
      .then(() => {
        Promise.all([usersListingMockPromise, updateUserMockPromise])
          .then(() => {
            const messages: UsersListMessage[] = [];
            (bloc.outbox() as Observable<UsersListMessage>)
              .pipe(take(5))
              .subscribe({
                next: (message: UsersListMessage) => {
                  messages.push(message);
                },
                error: (err: Error) => {
                  throw err;
                },
                complete: () => {
                  expect(messages[0]).deep.equal(
                    new UsersListMessage(),
                    'first message'
                  );
                  expect(
                    messages.some((message) => {
                      return message.action.type === 'OPEN_UPDATE_FORM';
                    })
                  ).to.be.true;
                  expect(
                    messages.some((message) => {
                      return (
                        message.action.type === 'UPDATE_USER' &&
                        deepEqual(message.action!.payload!.form, {
                          id: 123,
                          name: 'Ahmed',
                          email: 'e@e.com',
                          mobileNo: '010',
                          role: 'VendorCallCenterAgent',
                        })
                      );
                    })
                  ).to.be.true;
                  expect(
                    messages.some((message) => {
                      return (
                        message.tableStatus === 'IDLE' &&
                        message.creationFormStatus === 'CLOSED' &&
                        message.action.type === 'UPDATE_USER'
                      );
                    })
                  ).to.be.true;
                  expect(notificationService.notification).to.deep.equal(
                    successfulOperation()
                  );
                  done();
                },
              });

            bloc.inbox().next(
              new UsersListAction({
                type: 'OPEN_UPDATE_FORM',
                payload: {
                  form: {
                    id: 123,
                    name: 'Ahmed',
                    email: 'e@e.com',
                    mobileNo: '010',
                    role: 'VendorCallCenterAgent',
                  },
                },
              })
            );

            setTimeout(() => {
              bloc.inbox().next(
                new UsersListAction({
                  type: 'UPDATE_USER',
                  payload: {
                    form: {
                      id: 123,
                      name: 'Ahmed',
                      email: 'e@e.com',
                      mobileNo: '010',
                      role: 'VendorCallCenterAgent',
                    },
                  },
                })
              );
            }, 0);
          })
          .catch((err: Error) => {
            throw err;
          });
      })
      .catch((err: Error) => {
        throw err;
      });
  });
});
