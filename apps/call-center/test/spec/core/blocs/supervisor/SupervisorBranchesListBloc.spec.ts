import { $sb } from '@survv/commons/test/utils/sandbox';
import { BranchB2CStatus } from '@survv/commons/core/models/BranchB2CStatus';
import { BranchesRepoImpl } from '../../../../../src/shell/repositories/branches/BranchesRepoImpl';
import {
  ConsumerB2CBranchesListRequest,
  ConsumerB2CBranchesListResponse,
  SetBranchB2CStatusRequest,
  SetBranchB2CStatusResponse,
} from '@survv/api/definitions/branches';
import { LocalizationServiceMockImpl } from '@survv/commons/test/mocks/LocalizationServiceMockImpl';
import { Observable } from 'rxjs';
import { OrderStatus } from '../../../../../src/core/models/Order';
import { ROUTE_NAMES } from '../../../../../src/core/routes/routeNames';
import { RouterServiceMockImpl } from '@survv/commons/test/mocks/RouterServiceMockImpl';
import {
  SupervisorBranchesListAction,
  SupervisorBranchesListMessage,
} from '../../../../../src/core/blocs/supervisor/branches/SupervisorBranchesListMessage';
import { SupervisorBranchesListBloc } from '../../../../../src/core/blocs/supervisor/branches/SupervisorBranchesListBloc';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import {
  backendBranchesListStub,
  fetchBranchesActionMessages,
  initializeActionMessages,
  mappedBranchesListStub,
} from './SupervisorBranchesListBlocTestData';
import { createNotification } from '../../../../../src/core/notification';
import { deepEqual } from '@survv/commons/core/utils/checks';
import { expect } from 'chai';
import { kvStorage } from '@survv/pwa/shell/kv-storage-impl';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { take } from 'rxjs/operators';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('SupervisorBranchesListBloc Unit', function () {
  let bloc: SupervisorBranchesListBloc;
  const localizationService = new LocalizationServiceMockImpl();
  const routerService = new RouterServiceMockImpl();

  beforeEach(function () {
    bloc = new SupervisorBranchesListBloc({
      branchesRepo: new BranchesRepoImpl(),
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
        initializeBranchesListDoneMessage,
      } =
        initializeActionMessages(
          localizationService
        ).inCaseInitializeSucceeded();

      initializeLoadingMessage.action = new SupervisorBranchesListAction({
        type: 'INITIALIZE',
        payload: {
          skip: 100,
          limit: 50,
          sort: { branchLabel: 'asc' },
          filter: {
            statuses: [OrderStatus.REQUESTED.valueOf()],
          },
        },
      });
      initializeLoadingMessage.state.skip = 100;
      initializeLoadingMessage.state.limit = 50;
      initializeLoadingMessage.state.sort = { branchLabel: 'asc' };
      initializeLoadingMessage.state.filter = {
        statuses: [OrderStatus.REQUESTED.valueOf()],
      };

      $sb
        .stub(BranchesRepoImpl.prototype, 'listBranches')
        .resolves(mappedBranchesListStub());

      const messages: SupervisorBranchesListMessage[] = [];
      (bloc.outbox() as Observable<SupervisorBranchesListMessage>)
        .pipe(take(3))
        .subscribe({
          next: (message: SupervisorBranchesListMessage) => {
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
                    initializeBranchesListDoneMessage.state.list
                  )
                );
              })
            ).to.be.true;
            expect(routerService.route).deep.equal({
              name: ROUTE_NAMES.SUPERVISOR_BRANCHES_LIST,
              query: {
                q: JSON.stringify({
                  skip: 100,
                  limit: 50,
                  sort: { branchLabel: 'asc' },
                  filter: {
                    statuses: [OrderStatus.REQUESTED.valueOf()],
                  },
                }),
              },
            });
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorBranchesListAction({
          type: 'INITIALIZE',
          payload: {
            skip: 100,
            limit: 50,
            sort: { branchLabel: 'asc' },
            filter: {
              statuses: [OrderStatus.REQUESTED.valueOf()],
            },
          },
        })
      );
    });
    it('initializes with no (sort/filter/skip/limit) given correctly', function (done) {
      const {
        defaultMessage,
        initializeLoadingMessage,
        initializeBranchesListDoneMessage,
      } =
        initializeActionMessages(
          localizationService
        ).inCaseInitializeSucceeded();

      $sb
        .stub(BranchesRepoImpl.prototype, 'listBranches')
        .resolves(mappedBranchesListStub());

      const messages: SupervisorBranchesListMessage[] = [];
      (bloc.outbox() as Observable<SupervisorBranchesListMessage>)
        .pipe(take(3))
        .subscribe({
          next: (message: SupervisorBranchesListMessage) => {
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
                    initializeBranchesListDoneMessage.state.list
                  )
                );
              })
            ).to.be.true;
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorBranchesListAction({
          type: 'INITIALIZE',
        })
      );
    });
    it('handles initialization failure successfully', function (done) {
      const {
        defaultMessage,
        initializeLoadingMessage,
        initializeBranchesListProblematicMessage,
      } =
        initializeActionMessages(localizationService).inCaseInitializeFailed();

      $sb
        .stub(BranchesRepoImpl.prototype, 'listBranches')
        .rejects(new Error('an error'));

      const messages: SupervisorBranchesListMessage[] = [];
      (bloc.outbox() as Observable<SupervisorBranchesListMessage>)
        .pipe(take(3))
        .subscribe({
          next: (message: SupervisorBranchesListMessage) => {
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
                  initializeBranchesListProblematicMessage.tableStatus
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
        new SupervisorBranchesListAction({
          type: 'INITIALIZE',
        })
      );
    });
  });
  describe('on FETCH_BRANCHES', function () {
    it('fetches branches with given (sort/filter/skip/limit) correctly', function (done) {
      const {
        defaultMessage,
        fetchBranchesLoadingMessage,
        fetchBranchesDoneMessage,
      } =
        fetchBranchesActionMessages(
          localizationService
        ).inCaseFetchingBranchesSucceeded();

      fetchBranchesLoadingMessage.action = new SupervisorBranchesListAction({
        type: 'FETCH_BRANCHES',
        payload: {
          skip: 100,
          limit: 50,
          sort: { branchLabel: 'asc' },
          filter: {
            statuses: [OrderStatus.REQUESTED.valueOf()],
          },
        },
      });
      fetchBranchesLoadingMessage.state.skip = 100;
      fetchBranchesLoadingMessage.state.limit = 50;
      fetchBranchesLoadingMessage.state.sort = { branchLabel: 'asc' };
      fetchBranchesLoadingMessage.state.filter = {
        statuses: [OrderStatus.REQUESTED.valueOf()],
      };

      $sb
        .stub(BranchesRepoImpl.prototype, 'listBranches')
        .resolves(mappedBranchesListStub());

      const messages: SupervisorBranchesListMessage[] = [];
      (bloc.outbox() as Observable<SupervisorBranchesListMessage>)
        .pipe(take(3))
        .subscribe({
          next: (message: SupervisorBranchesListMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(defaultMessage, 'first message');
            expect(messages[1]).deep.equal(
              fetchBranchesLoadingMessage,
              'second message'
            );
            expect(
              messages.some((message) => {
                return (
                  message.tableStatus === 'IDLE' &&
                  deepEqual(
                    message.state.list,
                    fetchBranchesDoneMessage.state.list
                  )
                );
              })
            ).to.be.true;
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorBranchesListAction({
          type: 'FETCH_BRANCHES',
          payload: {
            skip: 100,
            limit: 50,
            sort: { branchLabel: 'asc' },
            filter: {
              statuses: [OrderStatus.REQUESTED.valueOf()],
            },
          },
        })
      );
    });
    it('fetches branches with no (sort/filter/skip/limit) given correctly', function (done) {
      const {
        defaultMessage,
        fetchBranchesLoadingMessage,
        fetchBranchesDoneMessage,
      } =
        fetchBranchesActionMessages(
          localizationService
        ).inCaseFetchingBranchesSucceeded();

      $sb
        .stub(BranchesRepoImpl.prototype, 'listBranches')
        .resolves(mappedBranchesListStub());

      const messages: SupervisorBranchesListMessage[] = [];
      (bloc.outbox() as Observable<SupervisorBranchesListMessage>)
        .pipe(take(3))
        .subscribe({
          next: (message: SupervisorBranchesListMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(defaultMessage, 'first message');
            expect(messages[1]).deep.equal(
              fetchBranchesLoadingMessage,
              'second message'
            );
            expect(
              messages.some((message) => {
                return (
                  message.tableStatus === 'IDLE' &&
                  deepEqual(
                    message.state.list,
                    fetchBranchesDoneMessage.state.list
                  )
                );
              })
            ).to.be.true;
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorBranchesListAction({
          type: 'FETCH_BRANCHES',
        })
      );
    });
    it('handles fetching branches failure successfully', function (done) {
      const {
        defaultMessage,
        fetchBranchesLoadingMessage,
        fetchBranchesProblematicMessage,
      } =
        fetchBranchesActionMessages(
          localizationService
        ).inCaseFetchingBranchesFailed();

      $sb
        .stub(BranchesRepoImpl.prototype, 'listBranches')
        .rejects(new Error('an error'));

      const messages: SupervisorBranchesListMessage[] = [];
      (bloc.outbox() as Observable<SupervisorBranchesListMessage>)
        .pipe(take(3))
        .subscribe({
          next: (message: SupervisorBranchesListMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(defaultMessage, 'first message');
            expect(messages[1]).deep.equal(
              fetchBranchesLoadingMessage,
              'second message'
            );
            expect(
              messages.some((message) => {
                return (
                  message.tableStatus ===
                  fetchBranchesProblematicMessage.tableStatus
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
        new SupervisorBranchesListAction({
          type: 'FETCH_BRANCHES',
        })
      );
    });
  });
  describe('on OPEN_FORM', function () {
    it('it opens the form and selects current branch successfully', function (done) {
      $sb
        .stub(BranchesRepoImpl.prototype, 'listBranches')
        .resolves(mappedBranchesListStub());

      const messages: SupervisorBranchesListMessage[] = [];
      (bloc.outbox() as Observable<SupervisorBranchesListMessage>)
        .pipe(take(2))
        .subscribe({
          next: (message: SupervisorBranchesListMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorBranchesListMessage(),
              'first message'
            );
            expect(messages[1].formStatus).to.equal('OPENED', 'second message');
            expect(messages[1].state.currentBranch).to.deep.equal(
              {
                id: 456,
                label: 'Mac',
              },
              'second message'
            );
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorBranchesListAction({
          type: 'OPEN_FORM',
          payload: {
            branchId: 456,
            label: 'Mac',
          },
        })
      );
    });
  });
  describe('on CLOSE_FORM', function () {
    it('it closes the form and clears current branch successfully', function (done) {
      $sb
        .stub(BranchesRepoImpl.prototype, 'listBranches')
        .resolves(mappedBranchesListStub());

      const messages: SupervisorBranchesListMessage[] = [];
      (bloc.outbox() as Observable<SupervisorBranchesListMessage>)
        .pipe(take(2))
        .subscribe({
          next: (message: SupervisorBranchesListMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorBranchesListMessage(),
              'first message'
            );
            expect(messages[1].formStatus).to.equal('CLOSED', 'second message');
            expect(messages[1].state.currentBranch).to.deep.equal(
              {
                id: 0,
                label: '',
              },
              'second message'
            );
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorBranchesListAction({
          type: 'CLOSE_FORM',
        })
      );
    });
  });
  describe('on UPDATE_BRANCH_STATUS', function () {
    it('updates branch status successfully', function (done) {
      $sb
        .stub(BranchesRepoImpl.prototype, 'listBranches')
        .resolves(mappedBranchesListStub());
      $sb.stub(BranchesRepoImpl.prototype, 'updateBranchStatus').resolves();

      const messages: SupervisorBranchesListMessage[] = [];
      (bloc.outbox() as Observable<SupervisorBranchesListMessage>)
        .pipe(take(4))
        .subscribe({
          next: (message: SupervisorBranchesListMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorBranchesListMessage(),
              'first message'
            );
            expect(
              messages[1].tableStatus === 'LOADING' &&
                messages[1].action.type === 'UPDATE_BRANCH_STATUS' &&
                messages[1].action.payload?.form?.status === 'AVAILABLE'
            ).to.be.true;
            expect(
              messages[2].tableStatus === 'LOADING' &&
                messages[2].formStatus === 'CLOSED'
            ).to.be.true;
            expect(
              messages.some((message) => {
                return message.tableStatus === 'IDLE';
              })
            ).to.be.true;
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorBranchesListAction({
          type: 'UPDATE_BRANCH_STATUS',
          payload: {
            form: { status: 'AVAILABLE' },
          },
        })
      );
    });
    it('handles updating branch status failure successfully', function (done) {
      $sb.stub(BranchesRepoImpl.prototype, 'updateBranchStatus').rejects();

      const messages: SupervisorBranchesListMessage[] = [];
      (bloc.outbox() as Observable<SupervisorBranchesListMessage>)
        .pipe(take(3))
        .subscribe({
          next: (message: SupervisorBranchesListMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorBranchesListMessage(),
              'first message'
            );
            expect(
              messages[1].tableStatus === 'LOADING' &&
                messages[1].action.type === 'UPDATE_BRANCH_STATUS' &&
                messages[1].action.payload?.form?.status === 'AVAILABLE'
            ).to.be.true;
            expect(
              messages[2].tableStatus === 'PROBLEMATIC' &&
                messages[2].formStatus === 'CLOSED'
            ).to.be.true;
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorBranchesListAction({
          type: 'UPDATE_BRANCH_STATUS',
          payload: {
            form: { status: 'AVAILABLE' },
          },
        })
      );
    });
  });
  describe('on NAVIGATE_TO_BRANCH_CATALOGUES', function () {
    it('navigates to branch catalogues successfully', function () {
      bloc.inbox().next(
        new SupervisorBranchesListAction({
          type: 'NAVIGATE_TO_BRANCH_CATALOGUES',
          payload: {
            branchId: 456,
          },
        })
      );

      expect(routerService.route).deep.equal({
        name: ROUTE_NAMES.SUPERVISOR_BRANCH_CATALOGUES_LIST,
        params: { branchId: '456' },
      });
    });
    it('handles failed navigation branch catalogues successfully', function () {
      $sb.stub(routerService, 'redirect').rejects();

      bloc.inbox().next(
        new SupervisorBranchesListAction({
          type: 'NAVIGATE_TO_BRANCH_CATALOGUES',
          payload: {
            branchId: 456,
          },
        })
      );

      expect(notificationService.notification).deep.equal(undefined);
    });
  });
});

describe('SupervisorBranchesListBloc Integration', function () {
  let bloc: SupervisorBranchesListBloc;
  const dummyBranchId = 123;
  const localizationService = new LocalizationServiceMockImpl();
  const routerService = new RouterServiceMockImpl();

  beforeEach(function () {
    bloc = new SupervisorBranchesListBloc({
      branchesRepo: new BranchesRepoImpl(),
      routerService,
      localizationService,
      notificationService,
    });
  });

  it('should initialize successfully', function (done) {
    const defaultMessage = new SupervisorBranchesListMessage();
    const initializeLoadingMessage =
      (function constructMessage(): SupervisorBranchesListMessage {
        const msg = defaultMessage.clone();
        msg.action = new SupervisorBranchesListAction({
          type: 'INITIALIZE',
          payload: {
            skip: 100,
            limit: 50,
            sort: { branchLabel: 'asc' },
            filter: {
              statuses: [OrderStatus.REQUESTED.valueOf()],
            },
          },
        });
        msg.tableStatus = 'LOADING';
        msg.state.filter = {
          statuses: [OrderStatus.REQUESTED.valueOf()],
        };
        msg.state.skip = 100;
        msg.state.limit = 50;
        msg.state.sort = { branchLabel: 'asc' };
        msg.state.filtersData.statusList = BranchB2CStatus.lookup().map(
          (status) => ({
            label: localizationService.localize(status.toString()),
            value: status.valueOf(),
          })
        );
        return msg;
      })();
    const initializeTableDoneMessage =
      (function constructMessage(): SupervisorBranchesListMessage {
        const msg = initializeLoadingMessage.clone();
        msg.tableStatus = 'IDLE';
        msg.state.totalItemsCount = 1;
        msg.state.list = [
          {
            id: 123,
            label: 'KFC',
            status: localizationService.localize(BranchB2CStatus.AVAILABLE),
          },
        ];
        return msg;
      })();

    const saveTokenPromise = authTokenRepo.saveToken(
      'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXJ2diIsInN1YiI6IjEyMyJ9.R36RdWYK1-v31uZCkYGv8G6B8432MhZY7HKZ21w-OZs'
    );

    $sb.stub(kvStorage, 'getItem').withArgs('vendor-id').resolves(123);

    const branchesListingMockPromise = wiremock
      .stub<ConsumerB2CBranchesListRequest, ConsumerB2CBranchesListResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/b2c-branches',
        query: {
          query: {
            vgql: 'v1',
            skip: 100,
            limit: 50,
            sort: {
              elements: [
                {
                  field: 'branchLabel',
                  order: 'Asc',
                },
              ],
            },
            filter: {
              elements: [
                {
                  field: 'b2cStatus',
                  operator: 'in',
                  value: ['REQUESTED'],
                },
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
        body: backendBranchesListStub(),
      });

    saveTokenPromise
      .then(() => {
        branchesListingMockPromise
          .then(() => {
            const messages: SupervisorBranchesListMessage[] = [];
            (bloc.outbox() as Observable<SupervisorBranchesListMessage>)
              .pipe(take(3))
              .subscribe({
                next: (message: SupervisorBranchesListMessage) => {
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
                    initializeTableDoneMessage,
                    'third message'
                  );

                  expect(routerService.route).deep.equal({
                    name: ROUTE_NAMES.SUPERVISOR_BRANCHES_LIST,
                    query: {
                      q: JSON.stringify({
                        skip: 100,
                        limit: 50,
                        sort: { branchLabel: 'asc' },
                        filter: {
                          statuses: [OrderStatus.REQUESTED.valueOf()],
                        },
                      }),
                    },
                  });
                  done();
                },
              });

            bloc.inbox().next(
              new SupervisorBranchesListAction({
                type: 'INITIALIZE',
                payload: {
                  skip: 100,
                  limit: 50,
                  sort: {
                    branchLabel: 'asc',
                  },
                  filter: {
                    statuses: [OrderStatus.REQUESTED.valueOf()],
                  },
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
  it('should update branch status successfully', function (done) {
    const defaultMessage = new SupervisorBranchesListMessage();
    const initializeLoadingMessage =
      (function constructMessage(): SupervisorBranchesListMessage {
        const msg = defaultMessage.clone();
        msg.action = new SupervisorBranchesListAction({
          type: 'INITIALIZE',
          payload: {
            skip: 100,
            limit: 50,
            sort: { branchLabel: 'asc' },
            filter: {
              statuses: [OrderStatus.REQUESTED.valueOf()],
            },
          },
        });
        msg.tableStatus = 'LOADING';
        msg.state.filter = {
          statuses: [OrderStatus.REQUESTED.valueOf()],
        };
        msg.state.skip = 100;
        msg.state.limit = 50;
        msg.state.sort = { branchLabel: 'asc' };
        msg.state.filtersData.statusList = BranchB2CStatus.lookup().map(
          (status) => ({
            label: localizationService.localize(status.toString()),
            value: status.valueOf(),
          })
        );
        return msg;
      })();
    const initializeTableDoneMessage =
      (function constructMessage(): SupervisorBranchesListMessage {
        const msg = initializeLoadingMessage.clone();
        msg.tableStatus = 'IDLE';
        msg.state.totalItemsCount = 1;
        msg.state.list = [
          {
            id: 123,
            label: 'KFC',
            status: localizationService.localize(BranchB2CStatus.AVAILABLE),
          },
        ];
        return msg;
      })();

    const saveTokenPromise = authTokenRepo.saveToken(
      'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXJ2diIsInN1YiI6IjEyMyJ9.R36RdWYK1-v31uZCkYGv8G6B8432MhZY7HKZ21w-OZs'
    );

    $sb.stub(kvStorage, 'getItem').withArgs('vendor-id').resolves(123);

    const branchesListingMockPromise = wiremock
      .stub<ConsumerB2CBranchesListRequest, ConsumerB2CBranchesListResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/b2c-branches',
        query: {
          query: {
            vgql: 'v1',
            skip: 100,
            limit: 50,
            sort: {
              elements: [
                {
                  field: 'branchLabel',
                  order: 'Asc',
                },
              ],
            },
            filter: {
              elements: [
                {
                  field: 'b2cStatus',
                  operator: 'in',
                  value: ['REQUESTED'],
                },
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
        body: backendBranchesListStub(),
      });

    const updateBranchStatusMockPromise = wiremock
      .stub<SetBranchB2CStatusRequest, SetBranchB2CStatusResponse>()
      .request({
        requestLine: 'post /consumer/api/v1/branches/:branchId/b2c-status',
        params: { branchId: dummyBranchId },
        body: { b2cStatus: 'AVAILABLE' },
      })
      .response({ status: 200 });

    saveTokenPromise
      .then(() => {
        Promise.all([branchesListingMockPromise, updateBranchStatusMockPromise])
          .then(() => {
            const messages: SupervisorBranchesListMessage[] = [];
            (bloc.outbox() as Observable<SupervisorBranchesListMessage>)
              .pipe(take(5))
              .subscribe({
                next: (message: SupervisorBranchesListMessage) => {
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
                        message.action.type === 'UPDATE_BRANCH_STATUS' &&
                        message.action.payload?.form?.status === 'AVAILABLE'
                      );
                    })
                  ).to.be.true;
                  expect(
                    messages.some((message) => {
                      return message.formStatus === 'CLOSED';
                    })
                  ).to.be.true;
                  expect(
                    messages.some((message) => {
                      return (
                        message.tableStatus === 'IDLE' &&
                        deepEqual(
                          message.state.list,
                          initializeTableDoneMessage.state.list
                        )
                      );
                    })
                  ).to.be.true;
                  done();
                },
              });

            bloc.inbox().next(
              new SupervisorBranchesListAction({
                type: 'INITIALIZE',
                payload: {
                  skip: 100,
                  limit: 50,
                  sort: {
                    branchLabel: 'asc',
                  },
                  filter: {
                    statuses: [OrderStatus.REQUESTED.valueOf()],
                  },
                },
              })
            );

            setTimeout(() => {
              bloc.inbox().next(
                new SupervisorBranchesListAction({
                  type: 'UPDATE_BRANCH_STATUS',
                  payload: {
                    form: {
                      status: 'AVAILABLE',
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
