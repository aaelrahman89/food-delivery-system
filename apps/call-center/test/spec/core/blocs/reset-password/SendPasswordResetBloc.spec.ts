import { $sb } from '@survv/commons/test/utils/sandbox';
import { Observable } from 'rxjs';
import { ROUTE_NAMES } from '../../../../../src/core/routes/routeNames';
import { ResetPasswordRepoImpl } from '../../../../../src/shell/repositories/reset-password/ResetPasswordRepoImpl';
import { RouterServiceMockImpl } from '@survv/commons/test/mocks/RouterServiceMockImpl';
import {
  SendPasswordResetAction,
  SendPasswordResetMessage,
} from '../../../../../src/core/blocs/reset-password/SendPasswordResetMessage';
import { SendPasswordResetBloc } from '../../../../../src/core/blocs/reset-password/SendPasswordResetBloc';
import {
  SendResetPasswordRequest,
  SendResetPasswordResponse,
} from '@survv/api/definitions/users';
import { appCustomizations } from './ResetPasswordBlocTestData';
import { createNotification } from '../../../../../src/core/notification';
import { expect } from 'chai';
import { kvStorage } from '@survv/pwa/shell/kv-storage-impl';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { take } from 'rxjs/operators';
import { userPreferenceRepo } from '@survv/commons/shell/repositories/UserPreferenceRepoImpl';
import { validationMessages } from '@survv/commons/core/validations/form-validators';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('SendResetPasswordBloc Unit', function () {
  let bloc: SendPasswordResetBloc;
  const routerService = new RouterServiceMockImpl();
  beforeEach(() => {
    bloc = new SendPasswordResetBloc({
      resetPasswordRepo: new ResetPasswordRepoImpl(),
      userPreferenceRepo,
      notificationService,
      routerService,
    });
  });
  describe('on INITIALIZE', function () {
    it('it initializes correctly', function (done) {
      const defaultMessage = new SendPasswordResetMessage();
      const initializationMessage = new SendPasswordResetMessage();
      initializationMessage.status = 'PROCESSING';
      initializationMessage.action = new SendPasswordResetAction({
        type: 'INITIALIZE',
        payload: {},
      });
      const initializationDoneMessage = initializationMessage.clone();

      initializationDoneMessage.status = 'IDLE';
      initializationDoneMessage.state.logoLtr =
        'https://storage.cloud.google.com/srvstg-images/logo-ltr.svg';
      initializationDoneMessage.state.logoRtl =
        'https://storage.cloud.google.com/srvstg-images/logo-rtl.svg';
      initializationDoneMessage.state.favicon =
        'https://storage.cloud.google.com/srvstg-images/favicon-32x32.png';

      $sb
        .stub(userPreferenceRepo, 'getAppCustomizations')
        .resolves(appCustomizations());

      const messages: SendPasswordResetMessage[] = [];
      (bloc.outbox() as Observable<SendPasswordResetMessage>)
        .pipe(take(3))
        .subscribe({
          next: (message: SendPasswordResetMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(defaultMessage, 'first message');
            expect(messages[1]).deep.equal(
              initializationMessage,
              'second message'
            );
            expect(messages[2]).deep.equal(
              initializationDoneMessage,
              'third message'
            );

            done();
          },
        });

      bloc.inbox().next(
        new SendPasswordResetAction({
          type: 'INITIALIZE',
          payload: {},
        })
      );
    });
    it('it handles  initialization failure correctly', function (done) {
      const defaultMessage = new SendPasswordResetMessage();
      const initializationMessage = new SendPasswordResetMessage();
      initializationMessage.status = 'PROCESSING';
      initializationMessage.action = new SendPasswordResetAction({
        type: 'INITIALIZE',
        payload: {},
      });
      const initializationFailureMessage = initializationMessage.clone();

      initializationFailureMessage.status = 'PROBLEMATIC';

      $sb
        .stub(userPreferenceRepo, 'getAppCustomizations')
        .rejects(new Error('an error'));

      const messages: SendPasswordResetMessage[] = [];
      (bloc.outbox() as Observable<SendPasswordResetMessage>)
        .pipe(take(3))
        .subscribe({
          next: (message: SendPasswordResetMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(defaultMessage, 'first message');
            expect(messages[1]).deep.equal(
              initializationMessage,
              'second message'
            );
            expect(messages[2]).deep.equal(
              initializationFailureMessage,
              'third message'
            );
            expect(notificationService.notification).deep.equal(
              createNotification(new Error('an error'))
            );

            done();
          },
        });

      bloc.inbox().next(
        new SendPasswordResetAction({
          type: 'INITIALIZE',
          payload: {},
        })
      );
    });
  });
  describe('on VALIDATE', function () {
    describe('validators()', function () {
      it('it returns FORM_REQUIRED_INPUT when email is missing', function () {
        const message = new SendPasswordResetMessage();

        message.state.form.email = '';

        expect(message.validators().email()).equal(
          validationMessages.FORM_REQUIRED_INPUT
        );
      });
      it('it returns FORM_INVALID_EMAIL when email entered is invalid', function () {
        const message = new SendPasswordResetMessage();

        message.state.form.email = 'test';
        expect(message.validators().email()).equal(
          validationMessages.FORM_INVALID_EMAIL
        );
      });
      it('it returns true when email entered is valid', function () {
        const message = new SendPasswordResetMessage();

        message.state.form.email = 'test@test.com';

        expect(message.validators().email()).equal(true);
      });
    });
    describe('isValid()', function () {
      it('should check if all message validators return true', function () {
        const message = new SendPasswordResetMessage();
        message.state.form.email = '';

        expect(bloc.isValid(message)).to.be.false;

        message.state.form.email = 'test@test.com';

        expect(bloc.isValid(message)).to.be.true;
      });
    });
    it('it changes button status to ENABLED if form is valid', function (done) {
      const defaultMessage = new SendPasswordResetMessage();
      const validationValidMessage = new SendPasswordResetMessage();
      validationValidMessage.state.form = {
        email: 'test@test.com',
      };
      validationValidMessage.action = new SendPasswordResetAction({
        type: 'VALIDATE',
        payload: {
          form: {
            email: 'test@test.com',
          },
        },
      });
      validationValidMessage.buttonStatus = 'ENABLED';

      const validationInvalidMessage = new SendPasswordResetMessage();
      validationInvalidMessage.state.form = {
        email: 'test',
      };
      validationInvalidMessage.action = new SendPasswordResetAction({
        type: 'VALIDATE',
        payload: {
          form: { email: 'test' },
        },
      });
      validationInvalidMessage.buttonStatus = 'DISABLED';

      const messages: SendPasswordResetMessage[] = [];
      (bloc.outbox() as Observable<SendPasswordResetMessage>)
        .pipe(take(3))
        .subscribe({
          next: (message: SendPasswordResetMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(defaultMessage, 'first message');
            expect(messages[1]).deep.equal(
              validationValidMessage,
              'second message'
            );
            expect(messages[2]).deep.equal(
              validationInvalidMessage,
              'second message'
            );

            expect(messages[1].buttonStatus).to.equal('ENABLED');
            expect(messages[2].buttonStatus).to.equal('DISABLED');

            done();
          },
        });

      bloc.inbox().next(
        new SendPasswordResetAction({
          type: 'VALIDATE',
          payload: {
            form: { email: 'test@test.com' },
          },
        })
      );
      bloc.inbox().next(
        new SendPasswordResetAction({
          type: 'VALIDATE',
          payload: {
            form: { email: 'test' },
          },
        })
      );
    });
  });
  describe('on SWITCH_LANGUAGE', function () {
    it('it switches language correctly', function (done) {
      const defaultMessage = new SendPasswordResetMessage();
      const switchLanguageMessage = new SendPasswordResetMessage();
      switchLanguageMessage.action = new SendPasswordResetAction({
        type: 'SWITCH_LANGUAGE',
        payload: {},
      });

      const switchLanguageDoneMessage = switchLanguageMessage.clone();

      const spy = $sb.spy(kvStorage, 'setItem');

      const messages: SendPasswordResetMessage[] = [];
      (bloc.outbox() as Observable<SendPasswordResetMessage>)
        .pipe(take(3))
        .subscribe({
          next: (message: SendPasswordResetMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(defaultMessage, 'first message');
            expect(messages[1]).deep.equal(
              switchLanguageMessage,
              'second message'
            );
            expect(messages[2]).deep.equal(
              switchLanguageDoneMessage,
              'second message'
            );

            $sb.assert.calledOnce(spy);
            done();
          },
        });

      bloc.inbox().next(
        new SendPasswordResetAction({
          type: 'SWITCH_LANGUAGE',
          payload: {},
        })
      );
    });
    it('it handles language switching failure correctly', function (done) {
      const defaultMessage = new SendPasswordResetMessage();
      const switchLanguageMessage = new SendPasswordResetMessage();
      switchLanguageMessage.action = new SendPasswordResetAction({
        type: 'SWITCH_LANGUAGE',
        payload: {},
      });

      const switchLanguageFailureMessage = switchLanguageMessage.clone();
      switchLanguageFailureMessage.status = 'PROBLEMATIC';

      $sb
        .stub(userPreferenceRepo, 'switchLanguage')
        .rejects(new Error('error'));

      const messages: SendPasswordResetMessage[] = [];
      (bloc.outbox() as Observable<SendPasswordResetMessage>)
        .pipe(take(3))
        .subscribe({
          next: (message: SendPasswordResetMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(defaultMessage, 'first message');
            expect(messages[1]).deep.equal(
              switchLanguageMessage,
              'second message'
            );
            expect(messages[2]).deep.equal(
              switchLanguageFailureMessage,
              'second message'
            );

            expect(notificationService.notification).deep.equal(
              createNotification(new Error('an error'))
            );
            done();
          },
        });

      bloc.inbox().next(
        new SendPasswordResetAction({
          type: 'SWITCH_LANGUAGE',
          payload: {},
        })
      );
    });
  });
  describe('on SEND_RESET_PASSWORD', function () {
    it('it sends password reset and re-routes successfully', function (done) {
      const defaultMessage = new SendPasswordResetMessage();

      const validationMessage = new SendPasswordResetMessage();
      validationMessage.state.form = {
        email: 'test@test.com',
      };
      validationMessage.action = new SendPasswordResetAction({
        type: 'VALIDATE',
        payload: {
          form: { email: 'test@test.com' },
        },
      });
      validationMessage.buttonStatus = 'ENABLED';

      const sendResetPasswordMessage = validationMessage.clone();
      sendResetPasswordMessage.action = new SendPasswordResetAction({
        type: 'SEND_RESET_PASSWORD',
        payload: {},
      });
      sendResetPasswordMessage.buttonStatus = 'PROCESSING';

      const sendResetPasswordDoneMessage = sendResetPasswordMessage.clone();

      $sb
        .stub(ResetPasswordRepoImpl.prototype, 'sendResetPasswordLink')
        .resolves();

      const messages: SendPasswordResetMessage[] = [];
      (bloc.outbox() as Observable<SendPasswordResetMessage>)
        .pipe(take(4))
        .subscribe({
          next: (message: SendPasswordResetMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(defaultMessage, 'first message');
            expect(messages[1]).deep.equal(validationMessage, 'second message');
            expect(messages[2]).deep.equal(
              sendResetPasswordMessage,
              'third message'
            );
            expect(messages[3]).deep.equal(
              sendResetPasswordDoneMessage,
              'forth message'
            );

            expect(routerService.route).deep.equal({
              name: ROUTE_NAMES.RESEND_RESET_PASSWORD_LINK,
              params: { userEmail: 'test@test.com' },
            });
            done();
          },
        });

      bloc.inbox().next(
        new SendPasswordResetAction({
          type: 'VALIDATE',
          payload: {
            form: { email: 'test@test.com' },
          },
        })
      );
      bloc.inbox().next(
        new SendPasswordResetAction({
          type: 'SEND_RESET_PASSWORD',
          payload: {},
        })
      );
    });
    it('it handles set password failure correctly', function (done) {
      const defaultMessage = new SendPasswordResetMessage();

      const validationMessage = new SendPasswordResetMessage();
      validationMessage.state.form = {
        email: 'test@test.com',
      };
      validationMessage.action = new SendPasswordResetAction({
        type: 'VALIDATE',
        payload: {
          form: { email: 'test@test.com' },
        },
      });
      validationMessage.buttonStatus = 'ENABLED';

      const sendResetPasswordMessage = validationMessage.clone();
      sendResetPasswordMessage.action = new SendPasswordResetAction({
        type: 'SEND_RESET_PASSWORD',
        payload: {},
      });
      sendResetPasswordMessage.buttonStatus = 'PROCESSING';

      const setPasswordFailureMessage = sendResetPasswordMessage.clone();
      setPasswordFailureMessage.status = 'PROBLEMATIC';
      setPasswordFailureMessage.buttonStatus = 'ENABLED';
      $sb
        .stub(ResetPasswordRepoImpl.prototype, 'sendResetPasswordLink')
        .rejects(new Error('error'));

      const messages: SendPasswordResetMessage[] = [];
      (bloc.outbox() as Observable<SendPasswordResetMessage>)
        .pipe(take(4))
        .subscribe({
          next: (message: SendPasswordResetMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(defaultMessage, 'first message');
            expect(messages[1]).deep.equal(validationMessage, 'second message');
            expect(messages[2]).deep.equal(
              sendResetPasswordMessage,
              'third message'
            );
            expect(messages[3]).deep.equal(
              setPasswordFailureMessage,
              'forth message'
            );

            expect(notificationService.notification).deep.equal(
              createNotification(new Error('an error'))
            );
            done();
          },
        });

      bloc.inbox().next(
        new SendPasswordResetAction({
          type: 'VALIDATE',
          payload: {
            form: { email: 'test@test.com' },
          },
        })
      );
      bloc.inbox().next(
        new SendPasswordResetAction({
          type: 'SEND_RESET_PASSWORD',
          payload: {},
        })
      );
    });
  });
  describe('on RESEND_RESET_PASSWORD', function () {
    it('it re-sends password reset and re-routes successfully', function (done) {
      const defaultMessage = new SendPasswordResetMessage();

      const validationMessage = new SendPasswordResetMessage();
      validationMessage.state.form = {
        email: 'test@test.com',
      };
      validationMessage.action = new SendPasswordResetAction({
        type: 'VALIDATE',
        payload: {
          form: { email: 'test@test.com' },
        },
      });
      validationMessage.buttonStatus = 'ENABLED';

      const resendResetPasswordMessage = validationMessage.clone();
      resendResetPasswordMessage.action = new SendPasswordResetAction({
        type: 'RESEND_RESET_PASSWORD',
        payload: {
          form: { email: 'test@test.com' },
        },
      });
      resendResetPasswordMessage.buttonStatus = 'PROCESSING';

      const resendResetPasswordDoneMessage = resendResetPasswordMessage.clone();

      $sb
        .stub(ResetPasswordRepoImpl.prototype, 'sendResetPasswordLink')
        .resolves();

      const messages: SendPasswordResetMessage[] = [];
      (bloc.outbox() as Observable<SendPasswordResetMessage>)
        .pipe(take(4))
        .subscribe({
          next: (message: SendPasswordResetMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(defaultMessage, 'first message');
            expect(messages[1]).deep.equal(validationMessage, 'second message');
            expect(messages[2]).deep.equal(
              resendResetPasswordMessage,
              'third message'
            );
            expect(messages[3]).deep.equal(
              resendResetPasswordDoneMessage,
              'forth message'
            );

            expect(routerService.route).deep.equal({
              name: ROUTE_NAMES.RESEND_RESET_PASSWORD_LINK,
              params: { userEmail: 'test@test.com' },
            });
            done();
          },
        });

      bloc.inbox().next(
        new SendPasswordResetAction({
          type: 'VALIDATE',
          payload: {
            form: { email: 'test@test.com' },
          },
        })
      );
      bloc.inbox().next(
        new SendPasswordResetAction({
          type: 'RESEND_RESET_PASSWORD',
          payload: {
            form: { email: 'test@test.com' },
          },
        })
      );
    });
    it('it handles set password failure correctly', function (done) {
      const defaultMessage = new SendPasswordResetMessage();

      const validationMessage = new SendPasswordResetMessage();
      validationMessage.state.form = {
        email: 'test@test.com',
      };
      validationMessage.action = new SendPasswordResetAction({
        type: 'VALIDATE',
        payload: {
          form: { email: 'test@test.com' },
        },
      });
      validationMessage.buttonStatus = 'ENABLED';

      const resendResetPasswordMessage = validationMessage.clone();
      resendResetPasswordMessage.action = new SendPasswordResetAction({
        type: 'RESEND_RESET_PASSWORD',
        payload: {
          form: { email: 'test@test.com' },
        },
      });
      resendResetPasswordMessage.buttonStatus = 'PROCESSING';

      const resendResetPasswordFailureMessage =
        resendResetPasswordMessage.clone();
      resendResetPasswordFailureMessage.status = 'PROBLEMATIC';
      resendResetPasswordFailureMessage.buttonStatus = 'ENABLED';
      $sb
        .stub(ResetPasswordRepoImpl.prototype, 'sendResetPasswordLink')
        .rejects(new Error('error'));

      const messages: SendPasswordResetMessage[] = [];
      (bloc.outbox() as Observable<SendPasswordResetMessage>)
        .pipe(take(4))
        .subscribe({
          next: (message: SendPasswordResetMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(defaultMessage, 'first message');
            expect(messages[1]).deep.equal(validationMessage, 'second message');
            expect(messages[2]).deep.equal(
              resendResetPasswordMessage,
              'third message'
            );
            expect(messages[3]).deep.equal(
              resendResetPasswordFailureMessage,
              'forth message'
            );

            expect(notificationService.notification).deep.equal(
              createNotification(new Error('an error'))
            );
            done();
          },
        });

      bloc.inbox().next(
        new SendPasswordResetAction({
          type: 'VALIDATE',
          payload: {
            form: { email: 'test@test.com' },
          },
        })
      );
      bloc.inbox().next(
        new SendPasswordResetAction({
          type: 'RESEND_RESET_PASSWORD',
          payload: {
            form: {
              email: 'test@test.com',
            },
          },
        })
      );
    });
  });
});
describe('SendResetPasswordBloc Integration', function () {
  let bloc: SendPasswordResetBloc;
  const routerService = new RouterServiceMockImpl();

  beforeEach(() => {
    bloc = new SendPasswordResetBloc({
      resetPasswordRepo: new ResetPasswordRepoImpl(),
      userPreferenceRepo,
      notificationService,
      routerService,
    });
  });

  it('it sends password reset successfully', function (done) {
    const defaultMessage = new SendPasswordResetMessage();

    const validationMessage = new SendPasswordResetMessage();
    validationMessage.state.form = {
      email: 'test@test.com',
    };
    validationMessage.action = new SendPasswordResetAction({
      type: 'VALIDATE',
      payload: {
        form: { email: 'test@test.com' },
      },
    });
    validationMessage.buttonStatus = 'ENABLED';

    const resetPasswordMessage = validationMessage.clone();
    resetPasswordMessage.action = new SendPasswordResetAction({
      type: 'SEND_RESET_PASSWORD',
      payload: {},
    });
    resetPasswordMessage.buttonStatus = 'PROCESSING';

    const resetPasswordDoneMessage = resetPasswordMessage.clone();

    const setPasswordRequestPromise = wiremock
      .stub<SendResetPasswordRequest, SendResetPasswordResponse>()
      .request({
        requestLine: 'post /consumer/api/v1/vendor-users/send-reset-password',
        body: {
          email: 'test@test.com',
        },
      })
      .response({
        status: 200,
      });

    setPasswordRequestPromise
      .then(() => {
        const messages: SendPasswordResetMessage[] = [];
        (bloc.outbox() as Observable<SendPasswordResetMessage>)
          .pipe(take(4))
          .subscribe({
            next: (message: SendPasswordResetMessage) => {
              messages.push(message);
            },
            error: (err: Error) => {
              throw err;
            },
            complete: () => {
              expect(messages[0]).deep.equal(defaultMessage, 'first message');
              expect(messages[1]).deep.equal(
                validationMessage,
                'second message'
              );
              expect(messages[2]).deep.equal(
                resetPasswordMessage,
                'third message'
              );
              expect(messages[3]).deep.equal(
                resetPasswordDoneMessage,
                'forth message'
              );

              expect(routerService.route).deep.equal({
                name: ROUTE_NAMES.RESEND_RESET_PASSWORD_LINK,
                params: { userEmail: 'test@test.com' },
              });
              done();
            },
          });

        bloc.inbox().next(
          new SendPasswordResetAction({
            type: 'VALIDATE',
            payload: {
              form: { email: 'test@test.com' },
            },
          })
        );
        bloc.inbox().next(
          new SendPasswordResetAction({
            type: 'SEND_RESET_PASSWORD',
            payload: {},
          })
        );
      })
      .catch((err: Error) => {
        throw err;
      });
  });
});
