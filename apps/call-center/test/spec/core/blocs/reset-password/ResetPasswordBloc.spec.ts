import { $sb } from '@survv/commons/test/utils/sandbox';
import { Observable } from 'rxjs';
import { ROUTE_NAMES } from '../../../../../src/core/routes/routeNames';
import {
  ResetPasswordAction,
  ResetPasswordMessage,
} from '../../../../../src/core/blocs/reset-password/ResetPasswordMessage';
import { ResetPasswordBloc } from '../../../../../src/core/blocs/reset-password/ResetPasswordBloc';
import { ResetPasswordRepoImpl } from '../../../../../src/shell/repositories/reset-password/ResetPasswordRepoImpl';
import {
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '@survv/api/definitions/users';
import { RouterServiceMockImpl } from '@survv/commons/test/mocks/RouterServiceMockImpl';
import { User } from '../../../../../src/core/models/User';
import { appCustomizations } from './ResetPasswordBlocTestData';
import { createNotification } from '../../../../../src/core/notification';
import { expect } from 'chai';
import { kvStorage } from '@survv/pwa/shell/kv-storage-impl';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { take } from 'rxjs/operators';
import { userPreferenceRepo } from '@survv/commons/shell/repositories/UserPreferenceRepoImpl';
import { validationMessages } from '@survv/commons/core/validations/form-validators';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('ResetPasswordBloc Unit', function () {
  let bloc: ResetPasswordBloc;
  const routerService = new RouterServiceMockImpl();
  const testPasswordCode = '12341234asdfasf123423';
  beforeEach(() => {
    bloc = new ResetPasswordBloc({
      resetPasswordCode: testPasswordCode,
      resetPasswordRepo: new ResetPasswordRepoImpl(),
      userPreferenceRepo,
      notificationService,
      routerService,
    });
  });
  describe('on INITIALIZE', function () {
    it('it initializes correctly', function (done) {
      const defaultMessage = new ResetPasswordMessage();
      const initializationMessage = new ResetPasswordMessage();
      initializationMessage.status = 'PROCESSING';
      initializationMessage.action = new ResetPasswordAction({
        type: 'INITIALIZE',
        payload: {},
      });
      const initializationDoneMessage = initializationMessage.clone();

      initializationDoneMessage.status = 'IDLE';
      initializationDoneMessage.state.BRAND_NAME = 'Survv';
      initializationDoneMessage.state.logoLtr =
        'https://storage.cloud.google.com/srvstg-images/logo-ltr.svg';
      initializationDoneMessage.state.logoRtl =
        'https://storage.cloud.google.com/srvstg-images/logo-rtl.svg';
      initializationDoneMessage.state.favicon =
        'https://storage.cloud.google.com/srvstg-images/favicon-32x32.png';

      $sb
        .stub(userPreferenceRepo, 'getAppCustomizations')
        .resolves(appCustomizations());

      const messages: ResetPasswordMessage[] = [];
      (bloc.outbox() as Observable<ResetPasswordMessage>)
        .pipe(take(3))
        .subscribe({
          next: (message: ResetPasswordMessage) => {
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
        new ResetPasswordAction({
          type: 'INITIALIZE',
          payload: {},
        })
      );
    });
    it('it handles  initialization failure correctly', function (done) {
      const defaultMessage = new ResetPasswordMessage();
      const initializationMessage = new ResetPasswordMessage();
      initializationMessage.status = 'PROCESSING';
      initializationMessage.action = new ResetPasswordAction({
        type: 'INITIALIZE',
        payload: {},
      });
      const initializationFailureMessage = initializationMessage.clone();

      initializationFailureMessage.status = 'PROBLEMATIC';

      $sb
        .stub(userPreferenceRepo, 'getAppCustomizations')
        .rejects(new Error('an error'));

      const messages: ResetPasswordMessage[] = [];
      (bloc.outbox() as Observable<ResetPasswordMessage>)
        .pipe(take(3))
        .subscribe({
          next: (message: ResetPasswordMessage) => {
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
        new ResetPasswordAction({
          type: 'INITIALIZE',
          payload: {},
        })
      );
    });
  });
  describe('on VALIDATE', function () {
    describe('validators()', function () {
      it('it returns FORM_REQUIRED_INPUT when password is missing', function () {
        const message = new ResetPasswordMessage();

        message.state.form.password = '';

        expect(message.validators().password()).equal(
          validationMessages.FORM_REQUIRED_INPUT
        );
      });
      it('it returns PASSWORD_LENGTH_ERROR when password length is less than 8 or greater than 20', function () {
        const message = new ResetPasswordMessage();

        message.state.form.password = '1234567';
        expect(message.validators().password()).equal('PASSWORD_LENGTH_ERROR');

        message.state.form.password = '0123456789012345678921';
        expect(message.validators().password()).equal('PASSWORD_LENGTH_ERROR');
      });
      it('it returns true when password entered is valid', function () {
        const message = new ResetPasswordMessage();

        message.state.form.password = 'Survv123';

        expect(message.validators().password()).equal(true);
      });
      it('it returns FORM_REQUIRED_INPUT when confirmation password is missing', function () {
        const message = new ResetPasswordMessage();

        message.state.form.confirmationPassword = '';

        expect(message.validators().confirmationPassword()).equal(
          validationMessages.FORM_REQUIRED_INPUT
        );
      });
      it('it returns PASSWORDS_MISMATCH_ERROR when password and confirmation password are mismatching', function () {
        const message = new ResetPasswordMessage();

        message.state.form.password = 's123';
        message.state.form.confirmationPassword = '123';

        expect(message.validators().confirmationPassword()).equal(
          'PASSWORDS_MISMATCH_ERROR'
        );
      });
      it('it returns true when confirmation password is present and matches password', function () {
        const message = new ResetPasswordMessage();

        message.state.form.password = 'Survv.123';
        message.state.form.confirmationPassword = 'Survv.123';

        expect(message.validators().confirmationPassword()).equal(true);
      });
    });
    describe('isValid()', function () {
      it('should check if all message validators return true', function () {
        const message = new ResetPasswordMessage();
        message.state.form.password = '';
        message.state.form.confirmationPassword = '';

        expect(bloc.isValid(message)).to.be.false;

        message.state.form.password = 'Survv123';
        message.state.form.confirmationPassword = 'Survv123';

        expect(bloc.isValid(message)).to.be.true;
      });
    });
    it('it changes button status to ENABLED if form is valid', function (done) {
      const defaultMessage = new ResetPasswordMessage();
      const validationValidMessage = new ResetPasswordMessage();
      validationValidMessage.state.form = {
        password: 'survv123',
        confirmationPassword: 'survv123',
      };
      validationValidMessage.action = new ResetPasswordAction({
        type: 'VALIDATE',
        payload: {
          form: { password: 'survv123', confirmationPassword: 'survv123' },
        },
      });
      validationValidMessage.buttonStatus = 'ENABLED';

      const validationInvalidMessage = new ResetPasswordMessage();
      validationInvalidMessage.state.form = {
        password: 'test',
        confirmationPassword: '',
      };
      validationInvalidMessage.action = new ResetPasswordAction({
        type: 'VALIDATE',
        payload: {
          form: { password: 'test', confirmationPassword: '' },
        },
      });
      validationInvalidMessage.buttonStatus = 'DISABLED';

      const messages: ResetPasswordMessage[] = [];
      (bloc.outbox() as Observable<ResetPasswordMessage>)
        .pipe(take(3))
        .subscribe({
          next: (message: ResetPasswordMessage) => {
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
        new ResetPasswordAction({
          type: 'VALIDATE',
          payload: {
            form: { password: 'survv123', confirmationPassword: 'survv123' },
          },
        })
      );
      bloc.inbox().next(
        new ResetPasswordAction({
          type: 'VALIDATE',
          payload: {
            form: { password: 'test', confirmationPassword: '' },
          },
        })
      );
    });
  });
  describe('on SWITCH_LANGUAGE', function () {
    it('it switches language correctly', function (done) {
      const defaultMessage = new ResetPasswordMessage();
      const switchLanguageMessage = new ResetPasswordMessage();
      switchLanguageMessage.action = new ResetPasswordAction({
        type: 'SWITCH_LANGUAGE',
        payload: {},
      });

      const switchLanguageDoneMessage = switchLanguageMessage.clone();

      const spy = $sb.spy(kvStorage, 'setItem');

      const messages: ResetPasswordMessage[] = [];
      (bloc.outbox() as Observable<ResetPasswordMessage>)
        .pipe(take(3))
        .subscribe({
          next: (message: ResetPasswordMessage) => {
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
        new ResetPasswordAction({
          type: 'SWITCH_LANGUAGE',
          payload: {},
        })
      );
    });
    it('it handles language switching failure correctly', function (done) {
      const defaultMessage = new ResetPasswordMessage();
      const switchLanguageMessage = new ResetPasswordMessage();
      switchLanguageMessage.action = new ResetPasswordAction({
        type: 'SWITCH_LANGUAGE',
        payload: {},
      });

      const switchLanguageFailureMessage = switchLanguageMessage.clone();
      switchLanguageFailureMessage.status = 'PROBLEMATIC';

      $sb
        .stub(userPreferenceRepo, 'switchLanguage')
        .rejects(new Error('error'));

      const messages: ResetPasswordMessage[] = [];
      (bloc.outbox() as Observable<ResetPasswordMessage>)
        .pipe(take(3))
        .subscribe({
          next: (message: ResetPasswordMessage) => {
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
        new ResetPasswordAction({
          type: 'SWITCH_LANGUAGE',
          payload: {},
        })
      );
    });
  });
  describe('on RESET_PASSWORD', function () {
    it('it sets password and logs in successfully', function (done) {
      const defaultMessage = new ResetPasswordMessage();

      const validationMessage = new ResetPasswordMessage();
      validationMessage.state.form = {
        password: 'survv123',
        confirmationPassword: 'survv123',
      };
      validationMessage.action = new ResetPasswordAction({
        type: 'VALIDATE',
        payload: {
          form: { password: 'survv123', confirmationPassword: 'survv123' },
        },
      });
      validationMessage.buttonStatus = 'ENABLED';

      const resetPasswordMessage = validationMessage.clone();
      resetPasswordMessage.action = new ResetPasswordAction({
        type: 'RESET_PASSWORD',
        payload: {},
      });
      resetPasswordMessage.buttonStatus = 'PROCESSING';

      const resetPasswordDoneMessage = resetPasswordMessage.clone();

      $sb.stub(ResetPasswordRepoImpl.prototype, 'resetPassword').resolves(
        new User({
          id: 1234,
          vendorId: 1234,
          email: 'test@test.com',
          token: '12341234xcv',
          mobileNo: '012341234',
          name: 'Test User',
        })
      );

      const spy = $sb.spy(kvStorage, 'setItem');

      const messages: ResetPasswordMessage[] = [];
      (bloc.outbox() as Observable<ResetPasswordMessage>)
        .pipe(take(4))
        .subscribe({
          next: (message: ResetPasswordMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(defaultMessage, 'first message');
            expect(messages[1]).deep.equal(validationMessage, 'second message');
            expect(messages[2]).deep.equal(
              resetPasswordMessage,
              'third message'
            );
            expect(messages[3]).deep.equal(
              resetPasswordDoneMessage,
              'forth message'
            );

            $sb.assert.calledTwice(spy);
            expect(routerService.route).deep.equal({
              name: ROUTE_NAMES.HOME,
            });
            done();
          },
        });

      bloc.inbox().next(
        new ResetPasswordAction({
          type: 'VALIDATE',
          payload: {
            form: { password: 'survv123', confirmationPassword: 'survv123' },
          },
        })
      );
      bloc.inbox().next(
        new ResetPasswordAction({
          type: 'RESET_PASSWORD',
          payload: {},
        })
      );
    });
    it('it handles set password failure correctly', function (done) {
      const defaultMessage = new ResetPasswordMessage();

      const validationMessage = new ResetPasswordMessage();
      validationMessage.state.form = {
        password: 'survv123',
        confirmationPassword: 'survv123',
      };
      validationMessage.action = new ResetPasswordAction({
        type: 'VALIDATE',
        payload: {
          form: { password: 'survv123', confirmationPassword: 'survv123' },
        },
      });
      validationMessage.buttonStatus = 'ENABLED';

      const setPasswordMessage = validationMessage.clone();
      setPasswordMessage.action = new ResetPasswordAction({
        type: 'RESET_PASSWORD',
        payload: {},
      });
      setPasswordMessage.buttonStatus = 'PROCESSING';

      const setPasswordFailureMessage = setPasswordMessage.clone();
      setPasswordFailureMessage.status = 'PROBLEMATIC';
      setPasswordFailureMessage.buttonStatus = 'ENABLED';
      $sb
        .stub(ResetPasswordRepoImpl.prototype, 'resetPassword')
        .rejects(new Error('error'));

      const messages: ResetPasswordMessage[] = [];
      (bloc.outbox() as Observable<ResetPasswordMessage>)
        .pipe(take(4))
        .subscribe({
          next: (message: ResetPasswordMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(defaultMessage, 'first message');
            expect(messages[1]).deep.equal(validationMessage, 'second message');
            expect(messages[2]).deep.equal(setPasswordMessage, 'third message');
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
        new ResetPasswordAction({
          type: 'VALIDATE',
          payload: {
            form: { password: 'survv123', confirmationPassword: 'survv123' },
          },
        })
      );
      bloc.inbox().next(
        new ResetPasswordAction({
          type: 'RESET_PASSWORD',
          payload: {},
        })
      );
    });
  });
});
describe('ResetPasswordBloc Integration', function () {
  let bloc: ResetPasswordBloc;
  const routerService = new RouterServiceMockImpl();

  beforeEach(() => {
    bloc = new ResetPasswordBloc({
      resetPasswordCode: '12341234asdfasf123423',
      resetPasswordRepo: new ResetPasswordRepoImpl(),
      userPreferenceRepo,
      notificationService,
      routerService,
    });
  });

  it('it sets password successfully', function (done) {
    const defaultMessage = new ResetPasswordMessage();

    const validationMessage = new ResetPasswordMessage();
    validationMessage.state.form = {
      password: 'survv123',
      confirmationPassword: 'survv123',
    };
    validationMessage.action = new ResetPasswordAction({
      type: 'VALIDATE',
      payload: {
        form: { password: 'survv123', confirmationPassword: 'survv123' },
      },
    });
    validationMessage.buttonStatus = 'ENABLED';

    const resetPasswordMessage = validationMessage.clone();
    resetPasswordMessage.action = new ResetPasswordAction({
      type: 'RESET_PASSWORD',
      payload: {},
    });
    resetPasswordMessage.buttonStatus = 'PROCESSING';

    const resetPasswordDoneMessage = resetPasswordMessage.clone();

    const setPasswordRequestPromise = wiremock
      .stub<ResetPasswordRequest, ResetPasswordResponse>()
      .request({
        requestLine: 'post /consumer/api/v1/vendor-users/reset-password',
        body: {
          resetPasswordCode: '12341234asdfasf123423',
          password: 'survv123',
        },
      })
      .response({
        status: 200,
        body: {
          id: 123,
          vendorId: 123415,
          name: 'User',
          mobileNo: '01234198',
          email: 'user@test.com',
          token:
            'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXJ2diIsInN1YiI6IjEyMyJ9.R36RdWYK1-v31uZCkYGv8G6B8432MhZY7HKZ21w-OZs',
        },
      });

    const spy = $sb.spy(kvStorage, 'setItem');

    setPasswordRequestPromise
      .then(() => {
        const messages: ResetPasswordMessage[] = [];
        (bloc.outbox() as Observable<ResetPasswordMessage>)
          .pipe(take(4))
          .subscribe({
            next: (message: ResetPasswordMessage) => {
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

              $sb.assert.calledTwice(spy);
              expect(routerService.route).deep.equal({
                name: ROUTE_NAMES.HOME,
              });
              done();
            },
          });

        bloc.inbox().next(
          new ResetPasswordAction({
            type: 'VALIDATE',
            payload: {
              form: { password: 'survv123', confirmationPassword: 'survv123' },
            },
          })
        );
        bloc.inbox().next(
          new ResetPasswordAction({
            type: 'RESET_PASSWORD',
            payload: {},
          })
        );
      })
      .catch((err: Error) => {
        throw err;
      });
  });
});
