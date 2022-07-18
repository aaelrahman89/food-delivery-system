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
  SupervisorAgentsListAction,
  SupervisorAgentsListMessage,
} from '../../../../../src/core/blocs/supervisor/agents/SupervisorAgentsListMessage';
import { SupervisorAgentsListBloc } from '../../../../../src/core/blocs/supervisor/agents/SupervisorAgentsListBloc';
import { UsersRepoImpl } from '../../../../../src/shell/repositories/users/UsersRepoImpl';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import {
  backendAgentsListStub,
  fetchUsersActionMessages,
  initializeActionMessages,
  mappedAgentsListStub,
} from './SupervisorAgentsListBlocTestData';
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

describe('SupervisorAgentsListBloc Unit', function () {
  let bloc: SupervisorAgentsListBloc;
  const localizationService = new LocalizationServiceMockImpl();
  const routerService = new RouterServiceMockImpl();

  beforeEach(function () {
    bloc = new SupervisorAgentsListBloc({
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
        initializeAgentsListDoneMessage,
      } =
        initializeActionMessages(
          localizationService
        ).inCaseInitializeSucceeded();

      initializeLoadingMessage.action = new SupervisorAgentsListAction({
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
        .stub(UsersRepoImpl.prototype, 'listAgents')
        .resolves(mappedAgentsListStub());

      const messages: SupervisorAgentsListMessage[] = [];
      (bloc.outbox() as Observable<SupervisorAgentsListMessage>)
        .pipe(take(3))
        .subscribe({
          next: (message: SupervisorAgentsListMessage) => {
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
                    initializeAgentsListDoneMessage.state.list
                  )
                );
              })
            ).to.be.true;
            expect(routerService.route).deep.equal({
              name: ROUTE_NAMES.SUPERVISOR_AGENTS_LIST,
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
        new SupervisorAgentsListAction({
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
        initializeAgentsListDoneMessage,
      } =
        initializeActionMessages(
          localizationService
        ).inCaseInitializeSucceeded();

      $sb
        .stub(UsersRepoImpl.prototype, 'listAgents')
        .resolves(mappedAgentsListStub());

      const messages: SupervisorAgentsListMessage[] = [];
      (bloc.outbox() as Observable<SupervisorAgentsListMessage>)
        .pipe(take(3))
        .subscribe({
          next: (message: SupervisorAgentsListMessage) => {
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
                    initializeAgentsListDoneMessage.state.list
                  )
                );
              })
            ).to.be.true;
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorAgentsListAction({
          type: 'INITIALIZE',
        })
      );
    });
    it('handles initialization failure successfully', function (done) {
      const {
        defaultMessage,
        initializeLoadingMessage,
        initializeAgentsListProblematicMessage,
      } =
        initializeActionMessages(localizationService).inCaseInitializeFailed();

      $sb
        .stub(UsersRepoImpl.prototype, 'listAgents')
        .rejects(new Error('an error'));

      const messages: SupervisorAgentsListMessage[] = [];
      (bloc.outbox() as Observable<SupervisorAgentsListMessage>)
        .pipe(take(3))
        .subscribe({
          next: (message: SupervisorAgentsListMessage) => {
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
                  initializeAgentsListProblematicMessage.tableStatus
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
        new SupervisorAgentsListAction({
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

      fetchUsersLoadingMessage.action = new SupervisorAgentsListAction({
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
        .stub(UsersRepoImpl.prototype, 'listAgents')
        .resolves(mappedAgentsListStub());

      const messages: SupervisorAgentsListMessage[] = [];
      (bloc.outbox() as Observable<SupervisorAgentsListMessage>)
        .pipe(take(3))
        .subscribe({
          next: (message: SupervisorAgentsListMessage) => {
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
                  deepEqual(
                    message.state.list,
                    fetchUsersDoneMessage.state.list
                  )
                );
              })
            ).to.be.true;
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorAgentsListAction({
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
        .stub(UsersRepoImpl.prototype, 'listAgents')
        .resolves(mappedAgentsListStub());

      const messages: SupervisorAgentsListMessage[] = [];
      (bloc.outbox() as Observable<SupervisorAgentsListMessage>)
        .pipe(take(3))
        .subscribe({
          next: (message: SupervisorAgentsListMessage) => {
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
                  deepEqual(
                    message.state.list,
                    fetchUsersDoneMessage.state.list
                  )
                );
              })
            ).to.be.true;
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorAgentsListAction({
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
        .stub(UsersRepoImpl.prototype, 'listAgents')
        .rejects(new Error('an error'));

      const messages: SupervisorAgentsListMessage[] = [];
      (bloc.outbox() as Observable<SupervisorAgentsListMessage>)
        .pipe(take(3))
        .subscribe({
          next: (message: SupervisorAgentsListMessage) => {
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
                  message.tableStatus ===
                  fetchUsersProblematicMessage.tableStatus
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
        new SupervisorAgentsListAction({
          type: 'FETCH_USERS',
        })
      );
    });
  });
  describe('on ACTIVATE_USER', function () {
    it('activates user successfully', function (done) {
      $sb
        .stub(UsersRepoImpl.prototype, 'listAgents')
        .resolves(mappedAgentsListStub());
      $sb.stub(UsersRepoImpl.prototype, 'activateUser').resolves();

      const messages: SupervisorAgentsListMessage[] = [];
      (bloc.outbox() as Observable<SupervisorAgentsListMessage>)
        .pipe(take(4))
        .subscribe({
          next: (message: SupervisorAgentsListMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorAgentsListMessage(),
              'first message'
            );
            expect(
              messages[1].tableStatus === 'LOADING' &&
                messages[1].action.type === 'ACTIVATE_USER'
            ).to.be.true;
            expect(
              messages.some((message) => {
                return (
                  message.tableStatus === 'IDLE' &&
                  message.state.list.length > 0
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
        new SupervisorAgentsListAction({
          type: 'ACTIVATE_USER',
          payload: { userId: 123 },
        })
      );
    });
    it('handles user activation failure successfully', function (done) {
      $sb
        .stub(UsersRepoImpl.prototype, 'activateUser')
        .rejects(new Error('an error'));

      const messages: SupervisorAgentsListMessage[] = [];
      (bloc.outbox() as Observable<SupervisorAgentsListMessage>)
        .pipe(take(3))
        .subscribe({
          next: (message: SupervisorAgentsListMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorAgentsListMessage(),
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
        new SupervisorAgentsListAction({
          type: 'ACTIVATE_USER',
          payload: { userId: 123 },
        })
      );
    });
  });
  describe('on DEACTIVATE_USER', function () {
    it('deactivates user successfully', function (done) {
      $sb
        .stub(UsersRepoImpl.prototype, 'listAgents')
        .resolves(mappedAgentsListStub());
      $sb.stub(UsersRepoImpl.prototype, 'deactivateUser').resolves();

      const messages: SupervisorAgentsListMessage[] = [];
      (bloc.outbox() as Observable<SupervisorAgentsListMessage>)
        .pipe(take(4))
        .subscribe({
          next: (message: SupervisorAgentsListMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorAgentsListMessage(),
              'first message'
            );
            expect(
              messages[1].tableStatus === 'LOADING' &&
                messages[1].action.type === 'DEACTIVATE_USER'
            ).to.be.true;
            expect(
              messages.some((message) => {
                return (
                  message.tableStatus === 'IDLE' &&
                  message.state.list.length > 0
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
        new SupervisorAgentsListAction({
          type: 'DEACTIVATE_USER',
        })
      );
    });
    it('handles user deactivation failure successfully', function (done) {
      $sb
        .stub(UsersRepoImpl.prototype, 'deactivateUser')
        .rejects(new Error('an error'));

      const messages: SupervisorAgentsListMessage[] = [];
      (bloc.outbox() as Observable<SupervisorAgentsListMessage>)
        .pipe(take(3))
        .subscribe({
          next: (message: SupervisorAgentsListMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorAgentsListMessage(),
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
        new SupervisorAgentsListAction({
          type: 'DEACTIVATE_USER',
          payload: { userId: 123 },
        })
      );
    });
  });
  describe('on OPEN_DIALOG', function () {
    it('it opens the dialog and selects agent successfully', function (done) {
      $sb
        .stub(UsersRepoImpl.prototype, 'listAgents')
        .resolves(mappedAgentsListStub());

      const messages: SupervisorAgentsListMessage[] = [];
      (bloc.outbox() as Observable<SupervisorAgentsListMessage>)
        .pipe(take(2))
        .subscribe({
          next: (message: SupervisorAgentsListMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorAgentsListMessage(),
              'first message'
            );
            expect(messages[1].dialogStatus).to.equal(
              'OPENED',
              'second message'
            );
            expect(messages[1].state.selectedAgent).to.deep.equal(
              {
                id: 456,
                name: 'Ahmed',
                email: '',
                mobileNo: '',
              },
              'second message'
            );
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorAgentsListAction({
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
    it('it closes the dialog and clears selected agent successfully', function (done) {
      $sb
        .stub(UsersRepoImpl.prototype, 'listAgents')
        .resolves(mappedAgentsListStub());

      const messages: SupervisorAgentsListMessage[] = [];
      (bloc.outbox() as Observable<SupervisorAgentsListMessage>)
        .pipe(take(2))
        .subscribe({
          next: (message: SupervisorAgentsListMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorAgentsListMessage(),
              'first message'
            );
            expect(messages[1].dialogStatus).to.equal(
              'CLOSED',
              'second message'
            );
            expect(messages[1].state.selectedAgent).to.deep.equal(
              {
                id: 0,
                name: '',
                email: '',
                mobileNo: '',
              },
              'second message'
            );
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorAgentsListAction({
          type: 'CLOSE_DIALOG',
        })
      );
    });
  });
  describe('on OPEN_CREATION_FORM', function () {
    it('it opens the creation form successfully', function (done) {
      $sb
        .stub(UsersRepoImpl.prototype, 'listAgents')
        .resolves(mappedAgentsListStub());

      const messages: SupervisorAgentsListMessage[] = [];
      (bloc.outbox() as Observable<SupervisorAgentsListMessage>)
        .pipe(take(2))
        .subscribe({
          next: (message: SupervisorAgentsListMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorAgentsListMessage(),
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
        new SupervisorAgentsListAction({
          type: 'OPEN_CREATION_FORM',
        })
      );
    });
  });
  describe('on CLOSE_CREATION_FORM', function () {
    it('it closes the creation form and clears the form successfully', function (done) {
      $sb
        .stub(UsersRepoImpl.prototype, 'listAgents')
        .resolves(mappedAgentsListStub());

      const messages: SupervisorAgentsListMessage[] = [];
      (bloc.outbox() as Observable<SupervisorAgentsListMessage>)
        .pipe(take(2))
        .subscribe({
          next: (message: SupervisorAgentsListMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorAgentsListMessage(),
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
              },
              'second message'
            );
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorAgentsListAction({
          type: 'CLOSE_CREATION_FORM',
        })
      );
    });
  });
  describe('on OPEN_UPDATE_FORM', function () {
    it('it opens the update form and fills agent successfully', function (done) {
      $sb
        .stub(UsersRepoImpl.prototype, 'listAgents')
        .resolves(mappedAgentsListStub());

      const messages: SupervisorAgentsListMessage[] = [];
      (bloc.outbox() as Observable<SupervisorAgentsListMessage>)
        .pipe(take(2))
        .subscribe({
          next: (message: SupervisorAgentsListMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorAgentsListMessage(),
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
              },
              'second message'
            );
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorAgentsListAction({
          type: 'OPEN_UPDATE_FORM',
          payload: {
            form: {
              id: 123,
              name: 'Ahmed',
              email: 'e@e.com',
              mobileNo: '010',
            },
          },
        })
      );
    });
  });
  describe('on CLOSE_UPDATE_FORM', function () {
    it('it closes the update form and clears the form successfully', function (done) {
      $sb
        .stub(UsersRepoImpl.prototype, 'listAgents')
        .resolves(mappedAgentsListStub());

      const messages: SupervisorAgentsListMessage[] = [];
      (bloc.outbox() as Observable<SupervisorAgentsListMessage>)
        .pipe(take(2))
        .subscribe({
          next: (message: SupervisorAgentsListMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorAgentsListMessage(),
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
              },
              'second message'
            );
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorAgentsListAction({
          type: 'CLOSE_UPDATE_FORM',
        })
      );
    });
  });
  describe('on VALIDATE_CREATION_FORM', function () {
    it('it enables the submit button when the creation form is valid', function (done) {
      $sb
        .stub(UsersRepoImpl.prototype, 'listAgents')
        .resolves(mappedAgentsListStub());

      const messages: SupervisorAgentsListMessage[] = [];
      (bloc.outbox() as Observable<SupervisorAgentsListMessage>)
        .pipe(take(2))
        .subscribe({
          next: (message: SupervisorAgentsListMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorAgentsListMessage(),
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
        new SupervisorAgentsListAction({
          type: 'VALIDATE_CREATION_FORM',
          payload: {
            form: {
              id: 0,
              name: 'Ahmed',
              email: 'e@e.com',
              mobileNo: '010',
            },
          },
        })
      );
    });
    it('it disables the submit button when the creation form is not valid', function (done) {
      $sb
        .stub(UsersRepoImpl.prototype, 'listAgents')
        .resolves(mappedAgentsListStub());

      const messages: SupervisorAgentsListMessage[] = [];
      (bloc.outbox() as Observable<SupervisorAgentsListMessage>)
        .pipe(take(2))
        .subscribe({
          next: (message: SupervisorAgentsListMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorAgentsListMessage(),
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
        new SupervisorAgentsListAction({
          type: 'VALIDATE_CREATION_FORM',
          payload: {
            form: {
              id: 0,
              name: '',
              email: 'e@e.com',
              mobileNo: '010',
            },
          },
        })
      );
    });
    it('it returns FORM_INVALID_EMAIL when email entered is invalid', function () {
      const message = new SupervisorAgentsListMessage();

      message.state.form.email = 's123';

      expect(message.creationValidators().email()).equal(
        validationMessages.FORM_INVALID_EMAIL
      );
    });
    it('it returns FORM_REQUIRED_INPUT when email is missing', function () {
      const message = new SupervisorAgentsListMessage();

      message.state.form.email = '';

      expect(message.creationValidators().email()).equal(
        validationMessages.FORM_REQUIRED_INPUT
      );
    });
  });
  describe('on VALIDATE_UPDATE_FORM', function () {
    it('it enables the submit button when the update form is valid', function (done) {
      $sb
        .stub(UsersRepoImpl.prototype, 'listAgents')
        .resolves(mappedAgentsListStub());

      const messages: SupervisorAgentsListMessage[] = [];
      (bloc.outbox() as Observable<SupervisorAgentsListMessage>)
        .pipe(take(2))
        .subscribe({
          next: (message: SupervisorAgentsListMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorAgentsListMessage(),
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
        new SupervisorAgentsListAction({
          type: 'VALIDATE_UPDATE_FORM',
          payload: {
            form: {
              id: 123,
              name: 'Ahmed',
              email: 'e@e.com',
              mobileNo: '010',
            },
          },
        })
      );
    });
    it('it disables the submit button when the update form is not valid', function (done) {
      $sb
        .stub(UsersRepoImpl.prototype, 'listAgents')
        .resolves(mappedAgentsListStub());

      const messages: SupervisorAgentsListMessage[] = [];
      (bloc.outbox() as Observable<SupervisorAgentsListMessage>)
        .pipe(take(2))
        .subscribe({
          next: (message: SupervisorAgentsListMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorAgentsListMessage(),
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
        new SupervisorAgentsListAction({
          type: 'VALIDATE_UPDATE_FORM',
          payload: {
            form: {
              id: 123,
              name: '',
              email: 'e@e.com',
              mobileNo: '010',
            },
          },
        })
      );
    });
    it('it returns FORM_INVALID_EMAIL when email entered is invalid', function () {
      const message = new SupervisorAgentsListMessage();

      message.state.form.email = 's123';

      expect(message.updateValidators().email()).equal(
        validationMessages.FORM_INVALID_EMAIL
      );
    });
    it('it returns FORM_REQUIRED_INPUT when email is missing', function () {
      const message = new SupervisorAgentsListMessage();

      message.state.form.email = '';

      expect(message.updateValidators().email()).equal(
        validationMessages.FORM_REQUIRED_INPUT
      );
    });
  });
  describe('on CREATE_USER', function () {
    it('creates the user successfully', function (done) {
      $sb
        .stub(UsersRepoImpl.prototype, 'listAgents')
        .resolves(mappedAgentsListStub());
      $sb.stub(UsersRepoImpl.prototype, 'createUser').resolves();

      const messages: SupervisorAgentsListMessage[] = [];
      (bloc.outbox() as Observable<SupervisorAgentsListMessage>)
        .pipe(take(4))
        .subscribe({
          next: (message: SupervisorAgentsListMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorAgentsListMessage(),
              'first message'
            );
            expect(messages[1].action.type === 'CREATE_USER').to.be.true;
            expect(messages[1].action!.payload!.form).deep.equal({
              id: 0,
              name: 'Ahmed',
              email: 'e@e.com',
              mobileNo: '010',
            });
            expect(
              messages.some((message) => {
                return (
                  message.tableStatus === 'IDLE' &&
                  message.state.list.length > 0
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
        new SupervisorAgentsListAction({
          type: 'CREATE_USER',
          payload: {
            form: {
              id: 0,
              name: 'Ahmed',
              email: 'e@e.com',
              mobileNo: '010',
            },
          },
        })
      );
    });
    it('handles user creation failure successfully', function (done) {
      $sb.stub(UsersRepoImpl.prototype, 'createUser').rejects();

      const messages: SupervisorAgentsListMessage[] = [];
      (bloc.outbox() as Observable<SupervisorAgentsListMessage>)
        .pipe(take(3))
        .subscribe({
          next: (message: SupervisorAgentsListMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorAgentsListMessage(),
              'first message'
            );
            expect(messages[1].action.type === 'CREATE_USER').to.be.true;
            expect(messages[1].action!.payload!.form).deep.equal({
              id: 0,
              name: 'Ahmed',
              email: 'e@e.com',
              mobileNo: '010',
            });
            expect(messages[2].tableStatus === 'PROBLEMATIC').to.be.true;
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorAgentsListAction({
          type: 'CREATE_USER',
          payload: {
            form: {
              id: 0,
              name: 'Ahmed',
              email: 'e@e.com',
              mobileNo: '010',
            },
          },
        })
      );
    });
  });
  describe('on UPDATE_USER', function () {
    it('updates the user successfully', function (done) {
      $sb
        .stub(UsersRepoImpl.prototype, 'listAgents')
        .resolves(mappedAgentsListStub());
      $sb.stub(UsersRepoImpl.prototype, 'updateUser').resolves();

      const messages: SupervisorAgentsListMessage[] = [];
      (bloc.outbox() as Observable<SupervisorAgentsListMessage>)
        .pipe(take(4))
        .subscribe({
          next: (message: SupervisorAgentsListMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorAgentsListMessage(),
              'first message'
            );
            expect(messages[1].action.type === 'UPDATE_USER').to.be.true;
            expect(messages[1].action!.payload!.form).deep.equal({
              id: 123,
              name: 'Ahmed',
              email: 'e@e.com',
              mobileNo: '010',
            });
            expect(
              messages.some((message) => {
                return (
                  message.tableStatus === 'IDLE' &&
                  message.state.list.length > 0
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
        new SupervisorAgentsListAction({
          type: 'UPDATE_USER',
          payload: {
            form: {
              id: 123,
              name: 'Ahmed',
              email: 'e@e.com',
              mobileNo: '010',
            },
          },
        })
      );
    });
    it('handles user update failure successfully', function (done) {
      $sb.stub(UsersRepoImpl.prototype, 'updateUser').rejects();

      const messages: SupervisorAgentsListMessage[] = [];
      (bloc.outbox() as Observable<SupervisorAgentsListMessage>)
        .pipe(take(3))
        .subscribe({
          next: (message: SupervisorAgentsListMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorAgentsListMessage(),
              'first message'
            );
            expect(messages[1].action.type === 'UPDATE_USER').to.be.true;
            expect(messages[1].action!.payload!.form).deep.equal({
              id: 123,
              name: 'Ahmed',
              email: 'e@e.com',
              mobileNo: '010',
            });
            expect(messages[2].tableStatus === 'PROBLEMATIC').to.be.true;
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorAgentsListAction({
          type: 'UPDATE_USER',
          payload: {
            form: {
              id: 123,
              name: 'Ahmed',
              email: 'e@e.com',
              mobileNo: '010',
            },
          },
        })
      );
    });
  });
});

describe('SupervisorAgentsListBloc Integration', function () {
  let bloc: SupervisorAgentsListBloc;
  const dummyUserId = 123;
  const dummyUserName = 'Ahmed';
  const localizationService = new LocalizationServiceMockImpl();
  const routerService = new RouterServiceMockImpl();

  beforeEach(function () {
    bloc = new SupervisorAgentsListBloc({
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
      initializeAgentsListDoneMessage,
    } =
      initializeActionMessages(localizationService).inCaseInitializeSucceeded();

    const saveTokenPromise = authTokenRepo.saveToken(
      'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXJ2diIsInN1YiI6IjEyMyJ9.R36RdWYK1-v31uZCkYGv8G6B8432MhZY7HKZ21w-OZs'
    );

    $sb.stub(kvStorage, 'getItem').withArgs('vendor-id').resolves(123);

    const agentsListingMockPromise = wiremock
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
                {
                  field: 'roles',
                  operator: 'in',
                  value: ['VendorCallCenterAgent'],
                },
              ],
            },
          },
        },
      })
      .response({
        status: 200,
        body: backendAgentsListStub(),
      });

    saveTokenPromise
      .then(() => {
        agentsListingMockPromise
          .then(() => {
            const messages: SupervisorAgentsListMessage[] = [];
            (bloc.outbox() as Observable<SupervisorAgentsListMessage>)
              .pipe(take(3))
              .subscribe({
                next: (message: SupervisorAgentsListMessage) => {
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
                    initializeAgentsListDoneMessage,
                    'third message'
                  );

                  expect(routerService.route).deep.equal({
                    name: ROUTE_NAMES.SUPERVISOR_AGENTS_LIST,
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
              new SupervisorAgentsListAction({
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

    const agentsListingMockPromise = wiremock
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
                {
                  field: 'roles',
                  operator: 'in',
                  value: ['VendorCallCenterAgent'],
                },
              ],
            },
          },
        },
      })
      .response({
        status: 200,
        body: backendAgentsListStub(),
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
        Promise.all([agentsListingMockPromise, activateUserMockPromise])
          .then(() => {
            const messages: SupervisorAgentsListMessage[] = [];
            (bloc.outbox() as Observable<SupervisorAgentsListMessage>)
              .pipe(take(4))
              .subscribe({
                next: (message: SupervisorAgentsListMessage) => {
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
              new SupervisorAgentsListAction({
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

    const agentsListingMockPromise = wiremock
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
                {
                  field: 'roles',
                  operator: 'in',
                  value: ['VendorCallCenterAgent'],
                },
              ],
            },
          },
        },
      })
      .response({
        status: 200,
        body: backendAgentsListStub(),
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
        Promise.all([agentsListingMockPromise, deactivateUserMockPromise])
          .then(() => {
            const messages: SupervisorAgentsListMessage[] = [];
            (bloc.outbox() as Observable<SupervisorAgentsListMessage>)
              .pipe(take(5))
              .subscribe({
                next: (message: SupervisorAgentsListMessage) => {
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
              new SupervisorAgentsListAction({
                type: 'OPEN_DIALOG',
                payload: {
                  userId: dummyUserId,
                  userName: dummyUserName,
                },
              })
            );

            setTimeout(() => {
              bloc.inbox().next(
                new SupervisorAgentsListAction({
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

    const agentsListingMockPromise = wiremock
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
                {
                  field: 'roles',
                  operator: 'in',
                  value: ['VendorCallCenterAgent'],
                },
              ],
            },
          },
        },
      })
      .response({
        status: 200,
        body: backendAgentsListStub(),
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
        Promise.all([agentsListingMockPromise, createUserMockPromise])
          .then(() => {
            const messages: SupervisorAgentsListMessage[] = [];
            (bloc.outbox() as Observable<SupervisorAgentsListMessage>)
              .pipe(take(5))
              .subscribe({
                next: (message: SupervisorAgentsListMessage) => {
                  messages.push(message);
                },
                error: (err: Error) => {
                  throw err;
                },
                complete: () => {
                  expect(messages[0]).deep.equal(
                    new SupervisorAgentsListMessage(),
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
              new SupervisorAgentsListAction({
                type: 'OPEN_CREATION_FORM',
              })
            );

            setTimeout(() => {
              bloc.inbox().next(
                new SupervisorAgentsListAction({
                  type: 'CREATE_USER',
                  payload: {
                    form: {
                      id: 0,
                      name: 'Ahmed',
                      email: 'e@e.com',
                      mobileNo: '010',
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

    const agentsListingMockPromise = wiremock
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
                {
                  field: 'roles',
                  operator: 'in',
                  value: ['VendorCallCenterAgent'],
                },
              ],
            },
          },
        },
      })
      .response({
        status: 200,
        body: backendAgentsListStub(),
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
        Promise.all([agentsListingMockPromise, updateUserMockPromise])
          .then(() => {
            const messages: SupervisorAgentsListMessage[] = [];
            (bloc.outbox() as Observable<SupervisorAgentsListMessage>)
              .pipe(take(5))
              .subscribe({
                next: (message: SupervisorAgentsListMessage) => {
                  messages.push(message);
                },
                error: (err: Error) => {
                  throw err;
                },
                complete: () => {
                  expect(messages[0]).deep.equal(
                    new SupervisorAgentsListMessage(),
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
              new SupervisorAgentsListAction({
                type: 'OPEN_UPDATE_FORM',
                payload: {
                  form: {
                    id: 123,
                    name: 'Ahmed',
                    email: 'e@e.com',
                    mobileNo: '010',
                  },
                },
              })
            );

            setTimeout(() => {
              bloc.inbox().next(
                new SupervisorAgentsListAction({
                  type: 'UPDATE_USER',
                  payload: {
                    form: {
                      id: 123,
                      name: 'Ahmed',
                      email: 'e@e.com',
                      mobileNo: '010',
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
