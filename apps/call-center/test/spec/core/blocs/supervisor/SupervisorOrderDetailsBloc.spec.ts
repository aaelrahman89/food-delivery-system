import { $sb } from '@survv/commons/test/utils/sandbox';
import {
  CallCenterAcceptOrderRequest,
  CallCenterAcceptOrderResponse,
  CallCenterRejectOrderRequest,
  CallCenterRejectOrderResponse,
  ConsumerOrderRequest,
  ConsumerOrderResponse,
  OrderJourneyRequest,
  OrderJourneyResponse,
  OrderRejectionReasonsRequest,
  OrderRejectionReasonsResponse,
} from '@survv/api/definitions/orders';
import { LocalizationServiceMockImpl } from '@survv/commons/test/mocks/LocalizationServiceMockImpl';
import { Observable } from 'rxjs';
import { OrdersRepoImpl } from '../../../../../src/shell/repositories/orders/OrdersRepoImpl';
import { ROUTE_NAMES } from '../../../../../src/core/routes/routeNames';
import { RejectionReasonOrderType } from '../../../../../src/core/models/RejectionReason';
import { RouterServiceMockImpl } from '@survv/commons/test/mocks/RouterServiceMockImpl';
import {
  SupervisorOrderDetailsAction,
  SupervisorOrderDetailsMessage,
} from '../../../../../src/core/blocs/supervisor/order-details/SupervisorOrderDetailsMessage';
import { SupervisorOrderDetailsBloc } from '../../../../../src/core/blocs/supervisor/order-details/SupervisorOrderDetailsBloc';
import {
  backendOrderDetailsStub,
  backendOrderJourneyStub,
  backendRejectionReasonsStub,
  initializeActionMessages,
  mappedOrderDetailsStub,
  mappedOrderJourneyStub,
  mappedRejectionReasonsStub,
} from './SupervisorOrderDetailsBlocTestData';
import { createNotification } from '../../../../../src/core/notification';
import { deepEqual } from '@survv/commons/core/utils/checks';
import { expect } from 'chai';
import { kvStorage } from '@survv/pwa/shell/kv-storage-impl';
import { mapRejectionFormToRejectOrderRequest } from '../../../../../src/shell/repositories/orders/mappers/requests';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { take } from 'rxjs/operators';
import { wiremock } from '@survv/commons/test/utils/wiremock';

const flushPromises = () => new Promise((resolve) => setImmediate(resolve));

describe('SupervisorOrderDetailsBloc Unit', function () {
  let bloc: SupervisorOrderDetailsBloc;
  const dummyOrderId = 123;
  const routerService = new RouterServiceMockImpl();
  const localizationService = new LocalizationServiceMockImpl();

  beforeEach(function () {
    bloc = new SupervisorOrderDetailsBloc({
      orderId: dummyOrderId,
      ordersRepo: new OrdersRepoImpl(),
      routerService,
      notificationService,
      localizationService,
    });
  });

  describe('on INITIALIZE', function () {
    it('initializes correctly', function (done) {
      const {
        defaultMessage,
        initializeLoadingMessage,
        initializeOrderDetailsDoneMessage,
        initializeOrderJourneyDoneMessage,
      } =
        initializeActionMessages(
          localizationService
        ).inCaseInitializeSucceeded();

      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .resolves(mappedOrderDetailsStub());
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrderJourney')
        .resolves(mappedOrderJourneyStub());
      $sb
        .stub(kvStorage, 'getItem')
        .withArgs('user-id')
        .resolves(mappedOrderDetailsStub().assignedAgent.id);

      const messages: SupervisorOrderDetailsMessage[] = [];
      (bloc.outbox() as Observable<SupervisorOrderDetailsMessage>)
        .pipe(take(4))
        .subscribe({
          next: (message: SupervisorOrderDetailsMessage) => {
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
                  message.orderStatus === 'IDLE' &&
                  deepEqual(
                    message.state.order,
                    initializeOrderDetailsDoneMessage.state.order
                  )
                );
              })
            ).to.be.true;
            expect(
              messages.some((message) => {
                return (
                  message.journeyStatus === 'IDLE' &&
                  deepEqual(
                    message.state.journey,
                    initializeOrderJourneyDoneMessage.state.journey
                  )
                );
              })
            ).to.be.true;
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'INITIALIZE',
        })
      );
    });
    it('handles fetching order failure successfully', function (done) {
      const {
        defaultMessage,
        initializeLoadingMessage,
        initializeOrderDetailsProblematicMessage,
      } =
        initializeActionMessages(localizationService).inCaseInitializeFailed();

      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .rejects(new Error('an error'));
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrderJourney')
        .resolves(mappedOrderJourneyStub());

      const messages: SupervisorOrderDetailsMessage[] = [];
      (bloc.outbox() as Observable<SupervisorOrderDetailsMessage>)
        .pipe(take(4))
        .subscribe({
          next: (message: SupervisorOrderDetailsMessage) => {
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
                  message.orderStatus ===
                  initializeOrderDetailsProblematicMessage.orderStatus
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
        new SupervisorOrderDetailsAction({
          type: 'INITIALIZE',
        })
      );
    });
    it('handles fetching order journey failure successfully', function (done) {
      const {
        defaultMessage,
        initializeLoadingMessage,
        initializeOrderJourneyProblematicMessage,
      } =
        initializeActionMessages(localizationService).inCaseInitializeFailed();

      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .resolves(mappedOrderDetailsStub());
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrderJourney')
        .rejects(new Error('an error'));

      const messages: SupervisorOrderDetailsMessage[] = [];
      (bloc.outbox() as Observable<SupervisorOrderDetailsMessage>)
        .pipe(take(4))
        .subscribe({
          next: (message: SupervisorOrderDetailsMessage) => {
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
                  message.journeyStatus ===
                  initializeOrderJourneyProblematicMessage.journeyStatus
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
        new SupervisorOrderDetailsAction({
          type: 'INITIALIZE',
        })
      );
    });
  });
  describe('on VALIDATE_ACCEPT_FORM', function () {
    it('it enables the submit button when order id is entered', function (done) {
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .resolves(mappedOrderDetailsStub());
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrderJourney')
        .resolves(mappedOrderJourneyStub());

      const messages: SupervisorOrderDetailsMessage[] = [];
      (bloc.outbox() as Observable<SupervisorOrderDetailsMessage>)
        .pipe(take(2))
        .subscribe({
          next: (message: SupervisorOrderDetailsMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorOrderDetailsMessage(),
              'first message'
            );
            expect(messages[1].acceptButtonStatus).to.equal(
              'ENABLED',
              'second message'
            );
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'VALIDATE_ACCEPT_FORM',
          payload: {
            acceptOrderForm: {
              vendorOrderId: 'X321',
            },
          },
        })
      );
    });
    it('it disabled the submit button when order id is not entered', function (done) {
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .resolves(mappedOrderDetailsStub());
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrderJourney')
        .resolves(mappedOrderJourneyStub());

      const messages: SupervisorOrderDetailsMessage[] = [];
      (bloc.outbox() as Observable<SupervisorOrderDetailsMessage>)
        .pipe(take(2))
        .subscribe({
          next: (message: SupervisorOrderDetailsMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorOrderDetailsMessage(),
              'first message'
            );
            expect(messages[1].acceptButtonStatus).to.equal(
              'DISABLED',
              'second message'
            );
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'VALIDATE_ACCEPT_FORM',
          payload: {
            acceptOrderForm: {
              vendorOrderId: '',
            },
          },
        })
      );
    });
  });
  describe('on VALIDATE_REJECT_FORM', function () {
    it('it enables the submit button when a rejection reason is selected', function (done) {
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .resolves(mappedOrderDetailsStub());
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrderJourney')
        .resolves(mappedOrderJourneyStub());

      const messages: SupervisorOrderDetailsMessage[] = [];
      (bloc.outbox() as Observable<SupervisorOrderDetailsMessage>)
        .pipe(take(2))
        .subscribe({
          next: (message: SupervisorOrderDetailsMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorOrderDetailsMessage(),
              'first message'
            );
            expect(messages[1].rejectButtonStatus).to.equal(
              'ENABLED',
              'second message'
            );
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'VALIDATE_REJECT_FORM',
          payload: {
            rejectOrderForm: {
              reasonId: 12345,
            },
          },
        })
      );
    });
    it('it disables the submit button when no rejection reason is selected', function (done) {
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .resolves(mappedOrderDetailsStub());
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrderJourney')
        .resolves(mappedOrderJourneyStub());

      const messages: SupervisorOrderDetailsMessage[] = [];
      (bloc.outbox() as Observable<SupervisorOrderDetailsMessage>)
        .pipe(take(2))
        .subscribe({
          next: (message: SupervisorOrderDetailsMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorOrderDetailsMessage(),
              'first message'
            );
            expect(messages[1].rejectButtonStatus).to.equal(
              'DISABLED',
              'second message'
            );
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'VALIDATE_REJECT_FORM',
          payload: {
            rejectOrderForm: {
              reasonId: 0,
            },
          },
        })
      );
    });
  });
  describe('on OPEN_ACCEPT_FORM', function () {
    it('it opens the form successfully', function (done) {
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .resolves(mappedOrderDetailsStub());
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrderJourney')
        .resolves(mappedOrderJourneyStub());

      const messages: SupervisorOrderDetailsMessage[] = [];
      (bloc.outbox() as Observable<SupervisorOrderDetailsMessage>)
        .pipe(take(2))
        .subscribe({
          next: (message: SupervisorOrderDetailsMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorOrderDetailsMessage(),
              'first message'
            );
            expect(messages[1].acceptFormStatus).to.equal(
              'OPENED',
              'second message'
            );
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'OPEN_ACCEPT_FORM',
        })
      );
    });
  });
  describe('on CLOSE_ACCEPT_FORM', function () {
    it('it closes the form successfully', function (done) {
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .resolves(mappedOrderDetailsStub());
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrderJourney')
        .resolves(mappedOrderJourneyStub());

      const messages: SupervisorOrderDetailsMessage[] = [];
      (bloc.outbox() as Observable<SupervisorOrderDetailsMessage>)
        .pipe(take(2))
        .subscribe({
          next: (message: SupervisorOrderDetailsMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorOrderDetailsMessage(),
              'first message'
            );
            expect(messages[1].acceptFormStatus).to.equal(
              'CLOSED',
              'second message'
            );
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'CLOSE_ACCEPT_FORM',
        })
      );
    });
  });
  describe('on OPEN_REJECT_FORM', function () {
    it('it opens the form successfully', function (done) {
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .resolves(mappedOrderDetailsStub());
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrderJourney')
        .resolves(mappedOrderJourneyStub());

      const messages: SupervisorOrderDetailsMessage[] = [];
      (bloc.outbox() as Observable<SupervisorOrderDetailsMessage>)
        .pipe(take(2))
        .subscribe({
          next: (message: SupervisorOrderDetailsMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorOrderDetailsMessage(),
              'first message'
            );
            expect(messages[1].rejectFormStatus).to.equal(
              'OPENED',
              'second message'
            );
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'OPEN_REJECT_FORM',
        })
      );
    });
    it('hydrates rejection reasons successfully', function (done) {
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .resolves(mappedOrderDetailsStub());
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrderJourney')
        .resolves(mappedOrderJourneyStub());
      $sb
        .stub(OrdersRepoImpl.prototype, 'getRejectionReasons')
        .resolves(mappedRejectionReasonsStub());

      const messages: SupervisorOrderDetailsMessage[] = [];
      (bloc.outbox() as Observable<SupervisorOrderDetailsMessage>)
        .pipe(take(3))
        .subscribe({
          next: (message: SupervisorOrderDetailsMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorOrderDetailsMessage(),
              'first message'
            );
            expect(messages[1].rejectFormStatus).to.equal(
              'OPENED',
              'second message'
            );
            expect(messages[2].state.rejectionReasons).to.deep.equal(
              mappedRejectionReasonsStub()
            );
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'OPEN_REJECT_FORM',
        })
      );
    });
    it('notifies error on rejection reasons hydration failure', function (done) {
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .resolves(mappedOrderDetailsStub());
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrderJourney')
        .resolves(mappedOrderJourneyStub());
      $sb
        .stub(OrdersRepoImpl.prototype, 'getRejectionReasons')
        .rejects(new Error('an error'));

      const messages: SupervisorOrderDetailsMessage[] = [];
      (bloc.outbox() as Observable<SupervisorOrderDetailsMessage>)
        .pipe(take(3))
        .subscribe({
          next: (message: SupervisorOrderDetailsMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorOrderDetailsMessage(),
              'first message'
            );
            expect(messages[1].rejectFormStatus).to.equal(
              'OPENED',
              'second message'
            );
            expect(messages[2].state.rejectionReasons).to.deep.equal([]);
            expect(notificationService.notification).deep.equal(
              createNotification(new Error('an error'))
            );
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'OPEN_REJECT_FORM',
        })
      );
    });
  });
  describe('on CLOSE_REJECT_FORM', function () {
    it('it closes the form successfully', function (done) {
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .resolves(mappedOrderDetailsStub());
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrderJourney')
        .resolves(mappedOrderJourneyStub());

      const messages: SupervisorOrderDetailsMessage[] = [];
      (bloc.outbox() as Observable<SupervisorOrderDetailsMessage>)
        .pipe(take(2))
        .subscribe({
          next: (message: SupervisorOrderDetailsMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorOrderDetailsMessage(),
              'first message'
            );
            expect(messages[1].rejectFormStatus).to.equal(
              'CLOSED',
              'second message'
            );
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'CLOSE_REJECT_FORM',
        })
      );
    });
  });
  describe('on OPEN_BRANCH_BUSY_FORM', function () {
    it('it opens the form successfully', function (done) {
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .resolves(mappedOrderDetailsStub());
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrderJourney')
        .resolves(mappedOrderJourneyStub());

      const messages: SupervisorOrderDetailsMessage[] = [];
      (bloc.outbox() as Observable<SupervisorOrderDetailsMessage>)
        .pipe(take(2))
        .subscribe({
          next: (message: SupervisorOrderDetailsMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorOrderDetailsMessage(),
              'first message'
            );
            expect(messages[1].branchBusyFormStatus).to.equal(
              'OPENED',
              'second message'
            );
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'OPEN_BRANCH_BUSY_FORM',
        })
      );
    });
  });
  describe('on CLOSE_BRANCH_BUSY_FORM', function () {
    it('it closes and clears the form successfully', function (done) {
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .resolves(mappedOrderDetailsStub());
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrderJourney')
        .resolves(mappedOrderJourneyStub());

      const messages: SupervisorOrderDetailsMessage[] = [];
      (bloc.outbox() as Observable<SupervisorOrderDetailsMessage>)
        .pipe(take(2))
        .subscribe({
          next: (message: SupervisorOrderDetailsMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorOrderDetailsMessage(),
              'first message'
            );
            expect(messages[1].branchBusyFormStatus).to.equal(
              'CLOSED',
              'second message'
            );
            expect(messages[1].state.rejectOrderForm).to.deep.equal({
              reasonId: 0,
              b2cBranchStatus: '',
              unavailableItems: [],
              unavailableSelections: [],
              notes: '',
            });
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'CLOSE_BRANCH_BUSY_FORM',
        })
      );
    });
  });
  describe('on OPEN_UNAVAILABLE_ITEMS_FORM', function () {
    it('it opens the form successfully', function (done) {
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .resolves(mappedOrderDetailsStub());
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrderJourney')
        .resolves(mappedOrderJourneyStub());

      const messages: SupervisorOrderDetailsMessage[] = [];
      (bloc.outbox() as Observable<SupervisorOrderDetailsMessage>)
        .pipe(take(2))
        .subscribe({
          next: (message: SupervisorOrderDetailsMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorOrderDetailsMessage(),
              'first message'
            );
            expect(messages[1].unavailableItemsFormStatus).to.equal(
              'OPENED',
              'second message'
            );
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'OPEN_UNAVAILABLE_ITEMS_FORM',
        })
      );
    });
  });
  describe('on CLOSE_UNAVAILABLE_ITEMS_FORM', function () {
    it('it closes the form successfully', function (done) {
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .resolves(mappedOrderDetailsStub());
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrderJourney')
        .resolves(mappedOrderJourneyStub());

      const messages: SupervisorOrderDetailsMessage[] = [];
      (bloc.outbox() as Observable<SupervisorOrderDetailsMessage>)
        .pipe(take(2))
        .subscribe({
          next: (message: SupervisorOrderDetailsMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorOrderDetailsMessage(),
              'first message'
            );
            expect(messages[1].unavailableItemsFormStatus).to.equal(
              'CLOSED',
              'second message'
            );
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'CLOSE_UNAVAILABLE_ITEMS_FORM',
        })
      );
    });
  });
  describe('on ACCEPT_ORDER', function () {
    it('accepts the order successfully', function (done) {
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .resolves(mappedOrderDetailsStub());
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrderJourney')
        .resolves(mappedOrderJourneyStub());
      $sb.stub(OrdersRepoImpl.prototype, 'acceptOrder').resolves();

      const messages: SupervisorOrderDetailsMessage[] = [];
      (bloc.outbox() as Observable<SupervisorOrderDetailsMessage>)
        .pipe(take(3))
        .subscribe({
          next: (message: SupervisorOrderDetailsMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorOrderDetailsMessage(),
              'first message'
            );
            expect(
              messages[1].orderStatus === 'LOADING' &&
                messages[1].journeyStatus === 'LOADING' &&
                messages[1].action.type === 'ACCEPT_ORDER' &&
                messages[1].action.payload?.acceptOrderForm?.vendorOrderId ===
                  'X321'
            ).to.be.true;
            expect(routerService.route).deep.equal({
              name: ROUTE_NAMES.SUPERVISOR_LIVE_ORDER_EMPTY,
            });
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'ACCEPT_ORDER',
          payload: {
            acceptOrderForm: { vendorOrderId: 'X321' },
          },
        })
      );
    });
    it('handles accepting order failure successfully', function (done) {
      $sb.stub(OrdersRepoImpl.prototype, 'acceptOrder').rejects();

      const messages: SupervisorOrderDetailsMessage[] = [];
      (bloc.outbox() as Observable<SupervisorOrderDetailsMessage>)
        .pipe(take(3))
        .subscribe({
          next: (message: SupervisorOrderDetailsMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorOrderDetailsMessage(),
              'first message'
            );
            expect(
              messages[1].orderStatus === 'LOADING' &&
                messages[1].journeyStatus === 'LOADING' &&
                messages[1].action.type === 'ACCEPT_ORDER' &&
                messages[1].action.payload?.acceptOrderForm?.vendorOrderId ===
                  'X321'
            ).to.be.true;
            expect(
              messages[2].orderStatus === 'ERROR' &&
                messages[2].journeyStatus === 'ERROR'
            ).to.be.true;
            expect(
              messages.some((message) => {
                return message.orderStatus === 'IDLE';
              })
            ).to.be.true;
            expect(
              messages.some((message) => {
                return message.journeyStatus === 'IDLE';
              })
            ).to.be.true;
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'ACCEPT_ORDER',
          payload: {
            acceptOrderForm: { vendorOrderId: 'X321' },
          },
        })
      );
    });
  });
  describe('on REJECT_ORDER', function () {
    it('rejects the order successfully', function (done) {
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .resolves(mappedOrderDetailsStub());
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrderJourney')
        .resolves(mappedOrderJourneyStub());
      $sb.stub(OrdersRepoImpl.prototype, 'rejectOrder').resolves();

      const messages: SupervisorOrderDetailsMessage[] = [];
      (bloc.outbox() as Observable<SupervisorOrderDetailsMessage>)
        .pipe(take(3))
        .subscribe({
          next: (message: SupervisorOrderDetailsMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorOrderDetailsMessage(),
              'first message'
            );
            expect(
              messages[1].orderStatus === 'LOADING' &&
                messages[1].journeyStatus === 'LOADING' &&
                messages[1].action.type === 'REJECT_ORDER' &&
                messages[1].action.payload?.rejectOrderForm?.reasonId === 12345
            ).to.be.true;
            expect(routerService.route).deep.equal({
              name: ROUTE_NAMES.SUPERVISOR_LIVE_ORDER_EMPTY,
            });
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'REJECT_ORDER',
          payload: {
            rejectOrderForm: { reasonId: 12345 },
          },
        })
      );
    });
    it('rejects the order with branch busy reason successfully', function (done) {
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .resolves(mappedOrderDetailsStub());
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrderJourney')
        .resolves(mappedOrderJourneyStub());
      $sb.stub(OrdersRepoImpl.prototype, 'rejectOrder').resolves();

      const messages: SupervisorOrderDetailsMessage[] = [];
      (bloc.outbox() as Observable<SupervisorOrderDetailsMessage>)
        .pipe(take(3))
        .subscribe({
          next: (message: SupervisorOrderDetailsMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorOrderDetailsMessage(),
              'first message'
            );
            expect(
              messages[1].orderStatus === 'LOADING' &&
                messages[1].journeyStatus === 'LOADING' &&
                messages[1].action.type === 'REJECT_ORDER' &&
                messages[1].action.payload?.rejectOrderForm?.reasonId ===
                  12345 &&
                messages[1].action.payload?.rejectOrderForm?.b2cBranchStatus ===
                  'BUSY_ONE_HOUR'
            ).to.be.true;
            expect(routerService.route).deep.equal({
              name: ROUTE_NAMES.SUPERVISOR_LIVE_ORDER_EMPTY,
            });
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'REJECT_ORDER',
          payload: {
            rejectOrderForm: {
              reasonId: 12345,
              b2cBranchStatus: 'BUSY_ONE_HOUR',
            },
          },
        })
      );
    });
    it('maps rejection form to rejection reason request', function () {
      const orderId = 12345;
      const rejectionReasonsForm1 = {
        reasonId: 123,
        b2cBranchStatus: 'AVAILABLE',
        unavailableItems: [12345],
        unavailableSelections: [123456],
        notes: 'notes',
      };
      expect(
        mapRejectionFormToRejectOrderRequest(orderId, rejectionReasonsForm1)
      ).to.deep.equal({
        orderId,
        rejectionReasonId: 123,
        b2cBranchStatus: 'AVAILABLE',
        unavailableItems: [12345],
        unavailableSelections: [123456],
        notes: 'notes',
      });

      const rejectionReasonsForm2 = {
        reasonId: 123,
      };
      expect(
        mapRejectionFormToRejectOrderRequest(orderId, rejectionReasonsForm2)
      ).to.deep.equal({
        orderId,
        rejectionReasonId: 123,
        b2cBranchStatus: undefined,
        unavailableItems: undefined,
        unavailableSelections: undefined,
        notes: undefined,
      });
    });
    it('handles order rejection failure successfully', function (done) {
      $sb.stub(OrdersRepoImpl.prototype, 'rejectOrder').rejects();

      const messages: SupervisorOrderDetailsMessage[] = [];
      (bloc.outbox() as Observable<SupervisorOrderDetailsMessage>)
        .pipe(take(3))
        .subscribe({
          next: (message: SupervisorOrderDetailsMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorOrderDetailsMessage(),
              'first message'
            );
            expect(
              messages[1].orderStatus === 'LOADING' &&
                messages[1].journeyStatus === 'LOADING' &&
                messages[1].action.type === 'REJECT_ORDER' &&
                messages[1].action.payload?.rejectOrderForm?.reasonId === 12345
            ).to.be.true;
            expect(
              messages[2].orderStatus === 'ERROR' &&
                messages[2].journeyStatus === 'ERROR'
            ).to.be.true;
            expect(
              messages.some((message) => {
                return message.orderStatus === 'IDLE';
              })
            ).to.be.true;
            expect(
              messages.some((message) => {
                return message.journeyStatus === 'IDLE';
              })
            ).to.be.true;
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'REJECT_ORDER',
          payload: {
            rejectOrderForm: { reasonId: 12345 },
          },
        })
      );
    });
  });
  describe('on SEARCH_REJECTION_REASONS', function () {
    it('searches rejection reasons successfully', function (done) {
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .resolves(mappedOrderDetailsStub());
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrderJourney')
        .resolves(mappedOrderJourneyStub());
      $sb
        .stub(OrdersRepoImpl.prototype, 'getRejectionReasons')
        .resolves(mappedRejectionReasonsStub());

      const messages: SupervisorOrderDetailsMessage[] = [];
      (bloc.outbox() as Observable<SupervisorOrderDetailsMessage>)
        .pipe(take(5))
        .subscribe({
          next: (message: SupervisorOrderDetailsMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorOrderDetailsMessage(),
              'first message'
            );
            expect(messages[1].rejectFormStatus).to.equal(
              'OPENED',
              'second message'
            );
            expect(messages[2].state.rejectionReasons).to.deep.equal(
              mappedRejectionReasonsStub()
            );

            done();
          },
        });
      bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'OPEN_REJECT_FORM',
        })
      );
      setTimeout(() => {
        bloc.inbox().next(
          new SupervisorOrderDetailsAction({
            type: 'SEARCH_REJECTION_REASONS',
            payload: { searchToken: 'Vendor' },
          })
        );
      }, 0);
    });
  });
  describe('on UPDATE_UNAVAILABLE_ITEMS', function () {
    it('it updates unavailable items correctly', function (done) {
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .resolves(mappedOrderDetailsStub());
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrderJourney')
        .resolves(mappedOrderJourneyStub());

      const messages: SupervisorOrderDetailsMessage[] = [];
      (bloc.outbox() as Observable<SupervisorOrderDetailsMessage>)
        .pipe(take(2))
        .subscribe({
          next: (message: SupervisorOrderDetailsMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorOrderDetailsMessage(),
              'first message'
            );
            expect(
              messages[1].state.rejectOrderForm.unavailableItems
            ).to.deep.equal([12345]);
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'UPDATE_UNAVAILABLE_ITEMS',
          payload: {
            rejectOrderForm: {
              unavailableItems: [12345],
            },
          },
        })
      );
    });
  });
  describe('on UPDATE_UNAVAILABLE_SELECTIONS', function () {
    it('it updates unavailable selections correctly', function (done) {
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .resolves(mappedOrderDetailsStub());
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrderJourney')
        .resolves(mappedOrderJourneyStub());

      const messages: SupervisorOrderDetailsMessage[] = [];
      (bloc.outbox() as Observable<SupervisorOrderDetailsMessage>)
        .pipe(take(2))
        .subscribe({
          next: (message: SupervisorOrderDetailsMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorOrderDetailsMessage(),
              'first message'
            );
            expect(
              messages[1].state.rejectOrderForm.unavailableSelections
            ).to.deep.equal([12345]);
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'UPDATE_UNAVAILABLE_SELECTIONS',
          payload: {
            rejectOrderForm: {
              unavailableSelections: [12345],
            },
          },
        })
      );
    });
  });
  describe('on UPDATE_NOTES', function () {
    it('it updates unavailable notes correctly', function (done) {
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrder')
        .resolves(mappedOrderDetailsStub());
      $sb
        .stub(OrdersRepoImpl.prototype, 'getOrderJourney')
        .resolves(mappedOrderJourneyStub());

      const messages: SupervisorOrderDetailsMessage[] = [];
      (bloc.outbox() as Observable<SupervisorOrderDetailsMessage>)
        .pipe(take(2))
        .subscribe({
          next: (message: SupervisorOrderDetailsMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(
              new SupervisorOrderDetailsMessage(),
              'first message'
            );
            expect(messages[1].state.rejectOrderForm.notes).to.equal('note');
            done();
          },
        });

      bloc.inbox().next(
        new SupervisorOrderDetailsAction({
          type: 'UPDATE_NOTES',
          payload: {
            rejectOrderForm: {
              notes: 'note',
            },
          },
        })
      );
    });
  });
});

describe('SupervisorOrderDetailsBloc Integration', function () {
  let bloc: SupervisorOrderDetailsBloc;
  const dummyOrderId = 123;
  const dummyVendorOrderId = 'X321';
  const routerService = new RouterServiceMockImpl();
  const localizationService = new LocalizationServiceMockImpl();

  beforeEach(function () {
    bloc = new SupervisorOrderDetailsBloc({
      orderId: dummyOrderId,
      ordersRepo: new OrdersRepoImpl(),
      routerService,
      notificationService,
      localizationService,
    });
  });

  it('initializes correctly', function (done) {
    const {
      defaultMessage,
      initializeLoadingMessage,
      initializeOrderDetailsDoneMessage,
      initializeOrderJourneyDoneMessage,
    } =
      initializeActionMessages(localizationService).inCaseInitializeSucceeded();

    const fetchOrderMockPromise = wiremock
      .stub<ConsumerOrderRequest, ConsumerOrderResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/orders/:orderId',
        params: { orderId: dummyOrderId },
      })
      .response({ status: 200, body: backendOrderDetailsStub() });

    const fetchOrderJourneyMockPromise = wiremock
      .stub<OrderJourneyRequest, OrderJourneyResponse>()
      .request({
        requestLine: 'get /api/v1.1/orders/:orderId/timeline',
        params: { orderId: dummyOrderId },
      })
      .response({ status: 200, body: backendOrderJourneyStub() });

    Promise.all([fetchOrderMockPromise, fetchOrderJourneyMockPromise])
      .then(() => {
        const messages: SupervisorOrderDetailsMessage[] = [];
        (bloc.outbox() as Observable<SupervisorOrderDetailsMessage>)
          .pipe(take(4))
          .subscribe({
            next: (message: SupervisorOrderDetailsMessage) => {
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
                    message.orderStatus === 'IDLE' &&
                    deepEqual(
                      message.state.order,
                      initializeOrderDetailsDoneMessage.state.order
                    )
                  );
                })
              ).to.be.true;
              expect(
                messages.some((message) => {
                  return (
                    message.journeyStatus === 'IDLE' &&
                    deepEqual(
                      message.state.journey,
                      initializeOrderJourneyDoneMessage.state.journey
                    )
                  );
                })
              ).to.be.true;
              done();
            },
          });

        bloc.inbox().next(
          new SupervisorOrderDetailsAction({
            type: 'INITIALIZE',
          })
        );
      })
      .catch((err: Error) => {
        throw err;
      });
  });
  it('accepts order correctly', function (done) {
    const {
      initializeOrderDetailsDoneMessage,
      initializeOrderJourneyDoneMessage,
    } =
      initializeActionMessages(localizationService).inCaseInitializeSucceeded();

    const fetchOrderMockPromise = wiremock
      .stub<ConsumerOrderRequest, ConsumerOrderResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/orders/:orderId',
        params: { orderId: dummyOrderId },
      })
      .response({ status: 200, body: backendOrderDetailsStub() });

    const fetchOrderJourneyMockPromise = wiremock
      .stub<OrderJourneyRequest, OrderJourneyResponse>()
      .request({
        requestLine: 'get /api/v1.1/orders/:orderId/timeline',
        params: { orderId: dummyOrderId },
      })
      .response({ status: 200, body: backendOrderJourneyStub() });

    const acceptOrderMockPromise = wiremock
      .stub<CallCenterAcceptOrderRequest, CallCenterAcceptOrderResponse>()
      .request({
        requestLine: 'post /consumer/api/v1/branches/:branchId/accept-order',
        params: { branchId: 0 },
        body: {
          orderId: dummyOrderId,
          vendorOrderId: dummyVendorOrderId,
        },
      })
      .response({
        status: 200,
        body: {
          orderId: 123,
          orderStatus: 'CONFIRMED',
        },
      });

    Promise.all([
      fetchOrderMockPromise,
      fetchOrderJourneyMockPromise,
      acceptOrderMockPromise,
    ])
      .then(() => {
        const messages: SupervisorOrderDetailsMessage[] = [];
        (bloc.outbox() as Observable<SupervisorOrderDetailsMessage>)
          .pipe(take(6))
          .subscribe({
            next: (message: SupervisorOrderDetailsMessage) => {
              messages.push(message);
            },
            error: (err: Error) => {
              throw err;
            },
            complete: () => {
              expect(messages[0]).deep.equal(
                new SupervisorOrderDetailsMessage(),
                'first message'
              );
              expect(
                messages.some((message) => {
                  return (
                    message.orderStatus === 'LOADING' &&
                    message.journeyStatus === 'LOADING' &&
                    message.action.type === 'ACCEPT_ORDER' &&
                    message.action.payload?.acceptOrderForm?.vendorOrderId ===
                      dummyVendorOrderId
                  );
                })
              ).to.be.true;
              expect(
                messages.some((message) => {
                  return message.acceptFormStatus === 'CLOSED';
                })
              ).to.be.true;
              expect(
                messages.some((message) => {
                  return (
                    message.orderStatus === 'IDLE' &&
                    deepEqual(
                      message.state.order,
                      initializeOrderDetailsDoneMessage.state.order
                    )
                  );
                })
              ).to.be.true;
              expect(
                messages.some((message) => {
                  return (
                    message.journeyStatus === 'IDLE' &&
                    deepEqual(
                      message.state.journey,
                      initializeOrderJourneyDoneMessage.state.journey
                    )
                  );
                })
              ).to.be.true;
              expect(routerService.route).deep.equal({
                name: ROUTE_NAMES.SUPERVISOR_LIVE_ORDER_EMPTY,
              });
              done();
            },
          });

        bloc.inbox().next(
          new SupervisorOrderDetailsAction({
            type: 'INITIALIZE',
          })
        );
        flushPromises()
          .then(() => {
            bloc.inbox().next(
              new SupervisorOrderDetailsAction({
                type: 'ACCEPT_ORDER',
                payload: {
                  acceptOrderForm: {
                    vendorOrderId: dummyVendorOrderId,
                  },
                },
              })
            );
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err: Error) => {
        throw err;
      });
  });
  it('hydrates rejection reasons correctly', function (done) {
    const defaultMessage = new SupervisorOrderDetailsMessage();

    const openRejectionFormMessage = new SupervisorOrderDetailsMessage();
    openRejectionFormMessage.rejectFormStatus = 'OPENED';
    openRejectionFormMessage.action = new SupervisorOrderDetailsAction({
      type: 'OPEN_REJECT_FORM',
    });

    const fetchRejectionReasonsSuccessMessage =
      openRejectionFormMessage.clone();
    fetchRejectionReasonsSuccessMessage.state.rejectionReasons =
      mappedRejectionReasonsStub();
    fetchRejectionReasonsSuccessMessage.state.clonedRejectionReasons =
      mappedRejectionReasonsStub();

    const fetchRejectionReasonsMockPromise = wiremock
      .stub<OrderRejectionReasonsRequest, OrderRejectionReasonsResponse>()
      .request({
        requestLine: 'get /api/v1/orders/rejection-reasons',
        query: {
          query: {
            vgql: 'v1',
            filter: {
              elements: [
                {
                  field: 'orderTypes',
                  operator: 'in',
                  value: [RejectionReasonOrderType.B2C.valueOf()],
                },
              ],
            },
            sort: {
              elements: [
                {
                  field: 'creationDate',
                  order: 'Desc',
                },
              ],
            },
            skip: 0,
            limit: 200,
          },
        },
      })
      .response({ status: 200, body: backendRejectionReasonsStub() });

    fetchRejectionReasonsMockPromise
      .then(() => {
        const messages: SupervisorOrderDetailsMessage[] = [];
        (bloc.outbox() as Observable<SupervisorOrderDetailsMessage>)
          .pipe(take(3))
          .subscribe({
            next: (message: SupervisorOrderDetailsMessage) => {
              messages.push(message);
            },
            error: (err: Error) => {
              throw err;
            },
            complete: () => {
              expect(messages[0]).deep.equal(defaultMessage, 'first message');
              expect(messages[1]).deep.equal(
                openRejectionFormMessage,
                'second message'
              );

              expect(messages[2]).deep.equal(
                fetchRejectionReasonsSuccessMessage,
                'third message'
              );

              done();
            },
          });

        bloc.inbox().next(
          new SupervisorOrderDetailsAction({
            type: 'OPEN_REJECT_FORM',
          })
        );
      })
      .catch((err: Error) => {
        throw err;
      });
  });
  it('rejects order correctly', function (done) {
    const {
      defaultMessage,
      initializeLoadingMessage,
      initializeOrderDetailsDoneMessage,
      initializeOrderJourneyDoneMessage,
    } =
      initializeActionMessages(localizationService).inCaseInitializeSucceeded();

    const fetchOrderMockPromise = wiremock
      .stub<ConsumerOrderRequest, ConsumerOrderResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/orders/:orderId',
        params: { orderId: dummyOrderId },
      })
      .response({ status: 200, body: backendOrderDetailsStub() });

    const fetchOrderJourneyMockPromise = wiremock
      .stub<OrderJourneyRequest, OrderJourneyResponse>()
      .request({
        requestLine: 'get /api/v1.1/orders/:orderId/timeline',
        params: { orderId: dummyOrderId },
      })
      .response({ status: 200, body: backendOrderJourneyStub() });

    const rejectOrderMockPromise = wiremock
      .stub<CallCenterRejectOrderRequest, CallCenterRejectOrderResponse>()
      .request({
        requestLine: 'post /consumer/api/v1/branches/:branchId/reject-order',
        params: { branchId: 123 },
        body: {
          orderId: 123,
          rejectionReasonId: 456,
          unavailableItems: [12345],
          unavailableSelections: [12345],
          notes: 'notes',
        },
      })
      .response({
        status: 200,
        body: {
          orderId: 2165529378315486700,
          orderStatus: 'REQUESTED',
        },
      });

    Promise.all([
      fetchOrderMockPromise,
      fetchOrderJourneyMockPromise,
      rejectOrderMockPromise,
    ])
      .then(() => {
        const messages: SupervisorOrderDetailsMessage[] = [];
        (bloc.outbox() as Observable<SupervisorOrderDetailsMessage>)
          .pipe(take(6))
          .subscribe({
            next: (message: SupervisorOrderDetailsMessage) => {
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
                    message.orderStatus === 'IDLE' &&
                    deepEqual(
                      message.state.order,
                      initializeOrderDetailsDoneMessage.state.order
                    )
                  );
                })
              ).to.be.true;
              expect(
                messages.some((message) => {
                  return (
                    message.journeyStatus === 'IDLE' &&
                    deepEqual(
                      message.state.journey,
                      initializeOrderJourneyDoneMessage.state.journey
                    )
                  );
                })
              ).to.be.true;
              expect(
                messages.some((message) => {
                  return (
                    message.journeyStatus === 'LOADING' &&
                    message.orderStatus === 'LOADING' &&
                    deepEqual(
                      message.action,
                      new SupervisorOrderDetailsAction({
                        type: 'REJECT_ORDER',
                        payload: {
                          rejectOrderForm: {
                            reasonId: 456,
                          },
                        },
                      })
                    )
                  );
                })
              ).to.be.true;
              expect(
                messages.some((message) => {
                  return (
                    message.orderStatus === 'IDLE' &&
                    message.journeyStatus === 'IDLE' &&
                    message.rejectFormStatus === 'CLOSED'
                  );
                })
              ).to.be.true;

              expect(routerService.route).deep.equal({
                name: ROUTE_NAMES.SUPERVISOR_LIVE_ORDER_EMPTY,
              });
              done();
            },
          });

        bloc.inbox().next(
          new SupervisorOrderDetailsAction({
            type: 'INITIALIZE',
          })
        );

        flushPromises()
          .then(() => {
            bloc.inbox().next(
              new SupervisorOrderDetailsAction({
                type: 'REJECT_ORDER',
                payload: {
                  rejectOrderForm: {
                    reasonId: 456,
                  },
                },
              })
            );
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err: Error) => {
        throw err;
      });
  });
  it('reject order with branch busy reason correctly', function (done) {
    const {
      defaultMessage,
      initializeLoadingMessage,
      initializeOrderDetailsDoneMessage,
      initializeOrderJourneyDoneMessage,
    } =
      initializeActionMessages(localizationService).inCaseInitializeSucceeded();

    const fetchOrderMockPromise = wiremock
      .stub<ConsumerOrderRequest, ConsumerOrderResponse>()
      .request({
        requestLine: 'get /consumer/api/v1/orders/:orderId',
        params: { orderId: dummyOrderId },
      })
      .response({ status: 200, body: backendOrderDetailsStub() });

    const fetchOrderJourneyMockPromise = wiremock
      .stub<OrderJourneyRequest, OrderJourneyResponse>()
      .request({
        requestLine: 'get /api/v1.1/orders/:orderId/timeline',
        params: { orderId: dummyOrderId },
      })
      .response({ status: 200, body: backendOrderJourneyStub() });

    const rejectOrderMockPromise = wiremock
      .stub<CallCenterRejectOrderRequest, CallCenterRejectOrderResponse>()
      .request({
        requestLine: 'post /consumer/api/v1/branches/:branchId/reject-order',
        params: { branchId: 0 },
        body: {
          orderId: 123,
          rejectionReasonId: 456,
          b2cBranchStatus: 'BUSY_ONE_HOUR',
        },
      })
      .response({
        status: 200,
        body: {
          orderId: 2165529378315486700,
          orderStatus: 'REQUESTED',
        },
      });

    Promise.all([
      fetchOrderMockPromise,
      fetchOrderJourneyMockPromise,
      rejectOrderMockPromise,
    ])
      .then(() => {
        const messages: SupervisorOrderDetailsMessage[] = [];
        (bloc.outbox() as Observable<SupervisorOrderDetailsMessage>)
          .pipe(take(6))
          .subscribe({
            next: (message: SupervisorOrderDetailsMessage) => {
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
                    message.orderStatus === 'IDLE' &&
                    deepEqual(
                      message.state.order,
                      initializeOrderDetailsDoneMessage.state.order
                    )
                  );
                })
              ).to.be.true;
              expect(
                messages.some((message) => {
                  return (
                    message.journeyStatus === 'IDLE' &&
                    deepEqual(
                      message.state.journey,
                      initializeOrderJourneyDoneMessage.state.journey
                    )
                  );
                })
              ).to.be.true;
              expect(
                messages.some((message) => {
                  return (
                    message.journeyStatus === 'LOADING' &&
                    message.orderStatus === 'LOADING' &&
                    deepEqual(
                      message.action,
                      new SupervisorOrderDetailsAction({
                        type: 'REJECT_ORDER',
                        payload: {
                          rejectOrderForm: {
                            reasonId: 12345,
                            b2cBranchStatus: 'BUSY_ONE_HOUR',
                            unavailableSelections: [12345],
                            unavailableItems: [12345],
                            notes: 'notes',
                          },
                        },
                      })
                    )
                  );
                })
              ).to.be.true;
              expect(
                messages.some((message) => {
                  return (
                    message.orderStatus === 'IDLE' &&
                    message.journeyStatus === 'IDLE' &&
                    message.rejectFormStatus === 'CLOSED'
                  );
                })
              ).to.be.true;

              expect(routerService.route).deep.equal({
                name: ROUTE_NAMES.SUPERVISOR_LIVE_ORDER_EMPTY,
              });
              done();
            },
          });

        bloc.inbox().next(
          new SupervisorOrderDetailsAction({
            type: 'INITIALIZE',
          })
        );

        flushPromises()
          .then(() => {
            bloc.inbox().next(
              new SupervisorOrderDetailsAction({
                type: 'REJECT_ORDER',
                payload: {
                  rejectOrderForm: {
                    reasonId: 12345,
                    b2cBranchStatus: 'BUSY_ONE_HOUR',
                    unavailableSelections: [12345],
                    unavailableItems: [12345],
                    notes: 'notes',
                  },
                },
              })
            );
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err: Error) => {
        throw err;
      });
  });
});
