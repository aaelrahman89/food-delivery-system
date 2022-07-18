import { $sb } from '@survv/commons/test/utils/sandbox';
import { Observable } from 'rxjs';

import {
  CallCenterUserSignInRequest,
  CallCenterUserSignInResponse,
} from '@survv/api/definitions/users';
import { ROUTE_NAMES } from '../../../../../src/core/routes/routeNames';
import { RouterServiceMockImpl } from '@survv/commons/test/mocks/RouterServiceMockImpl';
import {
  SignInAction,
  SignInMessage,
} from '../../../../../src/core/blocs/sign-in/SignInMessage';
import { SignInBloc } from '../../../../../src/core/blocs/sign-in/SignInBloc';
import { SignInRepoImpl } from '../../../../../src/shell/repositories/sign-in/SignInRepoImpl';
import { User } from '../../../../../src/core/models/User';
import { appCustomizations } from './SignInBlocTestData';
import { createNotification } from '../../../../../src/core/notification';
import { expect } from 'chai';
import { kvStorage } from '@survv/pwa/shell/kv-storage-impl';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { take } from 'rxjs/operators';
import { userPreferenceRepo } from '@survv/commons/shell/repositories/UserPreferenceRepoImpl';
import { validationMessages } from '@survv/commons/core/validations/form-validators';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('SignInBloc Unit', function () {
  let bloc: SignInBloc;
  const routerService = new RouterServiceMockImpl();

  beforeEach(() => {
    bloc = new SignInBloc({
      signInRepo: new SignInRepoImpl(),
      userPreferenceRepo,
      notificationService,
      routerService,
    });
  });

  describe('on INITIALIZE', function () {
    it('it initializes correctly', function (done) {
      const defaultMessage = new SignInMessage();
      const initializationMessage = new SignInMessage();
      initializationMessage.status = 'PROCESSING';
      initializationMessage.action = new SignInAction({
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

      const messages: SignInMessage[] = [];
      (bloc.outbox() as Observable<SignInMessage>).pipe(take(3)).subscribe({
        next: (message: SignInMessage) => {
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
        new SignInAction({
          type: 'INITIALIZE',
          payload: {},
        })
      );
    });
    it('it handles  initialization failure correctly', function (done) {
      const defaultMessage = new SignInMessage();
      const initializationMessage = new SignInMessage();
      initializationMessage.status = 'PROCESSING';
      initializationMessage.action = new SignInAction({
        type: 'INITIALIZE',
        payload: {},
      });
      const initializationFailureMessage = initializationMessage.clone();

      initializationFailureMessage.status = 'PROBLEMATIC';

      $sb
        .stub(userPreferenceRepo, 'getAppCustomizations')
        .rejects(new Error('an error'));

      const messages: SignInMessage[] = [];
      (bloc.outbox() as Observable<SignInMessage>).pipe(take(3)).subscribe({
        next: (message: SignInMessage) => {
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
        new SignInAction({
          type: 'INITIALIZE',
          payload: {},
        })
      );
    });
  });
  describe('on VALIDATE', function () {
    describe('validators()', function () {
      it('it returns FORM_INVALID_EMAIL when email entered is invalid', function () {
        const message = new SignInMessage();

        message.state.form.email = 's123';

        expect(message.validators().email()).equal(
          validationMessages.FORM_INVALID_EMAIL
        );
      });
      it('it returns FORM_REQUIRED_INPUT when email is missing', function () {
        const message = new SignInMessage();

        message.state.form.email = '';

        expect(message.validators().email()).equal(
          validationMessages.FORM_REQUIRED_INPUT
        );
      });
      it('it returns true when email entered is valid', function () {
        const message = new SignInMessage();

        message.state.form.email = 'test@test.com';

        expect(message.validators().email()).equal(true);
      });
      it('it returns FORM_REQUIRED_INPUT when password is missing', function () {
        const message = new SignInMessage();

        message.state.form.password = '';

        expect(message.validators().password()).equal(
          validationMessages.FORM_REQUIRED_INPUT
        );
      });
      it('it returns true when password entered is valid', function () {
        const message = new SignInMessage();

        message.state.form.password = 'Survv.123';

        expect(message.validators().password()).equal(true);
      });
    });
    describe('isValid()', function () {
      it('should check if all message validators return true', function () {
        const message = new SignInMessage();
        message.state.form.email = '';
        message.state.form.password = '';

        expect(bloc.isValid(message)).to.be.false;

        message.state.form.email = 'test@test.com';
        message.state.form.password = 'Survv123';

        expect(bloc.isValid(message)).to.be.true;
      });
    });
    it('it changes button status to ENABLED if form is valid', function (done) {
      const defaultMessage = new SignInMessage();
      const validationValidMessage = new SignInMessage();
      validationValidMessage.state.form = {
        email: 'test@test.com',
        password: 'survv123',
      };
      validationValidMessage.action = new SignInAction({
        type: 'VALIDATE',
        payload: {
          form: { email: 'test@test.com', password: 'survv123' },
        },
      });
      validationValidMessage.buttonStatus = 'ENABLED';

      const validationInvalidMessage = new SignInMessage();
      validationInvalidMessage.state.form = {
        email: 'test',
        password: '',
      };
      validationInvalidMessage.action = new SignInAction({
        type: 'VALIDATE',
        payload: {
          form: { email: 'test', password: '' },
        },
      });
      validationInvalidMessage.buttonStatus = 'DISABLED';

      const messages: SignInMessage[] = [];
      (bloc.outbox() as Observable<SignInMessage>).pipe(take(3)).subscribe({
        next: (message: SignInMessage) => {
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
        new SignInAction({
          type: 'VALIDATE',
          payload: {
            form: { email: 'test@test.com', password: 'survv123' },
          },
        })
      );
      bloc.inbox().next(
        new SignInAction({
          type: 'VALIDATE',
          payload: {
            form: { email: 'test', password: '' },
          },
        })
      );
    });
  });
  describe('on SWITCH_LANGUAGE', function () {
    it('it switches language correctly', function (done) {
      const defaultMessage = new SignInMessage();
      const switchLanguageMessage = new SignInMessage();
      switchLanguageMessage.action = new SignInAction({
        type: 'SWITCH_LANGUAGE',
        payload: {},
      });

      const switchLanguageDoneMessage = switchLanguageMessage.clone();

      const spy = $sb.spy(kvStorage, 'setItem');

      const messages: SignInMessage[] = [];
      (bloc.outbox() as Observable<SignInMessage>).pipe(take(3)).subscribe({
        next: (message: SignInMessage) => {
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
        new SignInAction({
          type: 'SWITCH_LANGUAGE',
          payload: {},
        })
      );
    });
    it('it handles language switching failure correctly', function (done) {
      const defaultMessage = new SignInMessage();
      const switchLanguageMessage = new SignInMessage();
      switchLanguageMessage.action = new SignInAction({
        type: 'SWITCH_LANGUAGE',
        payload: {},
      });

      const switchLanguageFailureMessage = switchLanguageMessage.clone();
      switchLanguageFailureMessage.status = 'PROBLEMATIC';

      $sb
        .stub(userPreferenceRepo, 'switchLanguage')
        .rejects(new Error('error'));

      const messages: SignInMessage[] = [];
      (bloc.outbox() as Observable<SignInMessage>).pipe(take(3)).subscribe({
        next: (message: SignInMessage) => {
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
        new SignInAction({
          type: 'SWITCH_LANGUAGE',
          payload: {},
        })
      );
    });
  });
  describe('on SIGN_IN', function () {
    it('it signs in successfully', function (done) {
      const defaultMessage = new SignInMessage();

      const validationMessage = new SignInMessage();
      validationMessage.state.form = {
        email: 'test@test.com',
        password: 'survv123',
      };
      validationMessage.action = new SignInAction({
        type: 'VALIDATE',
        payload: {
          form: { email: 'test@test.com', password: 'survv123' },
        },
      });
      validationMessage.buttonStatus = 'ENABLED';

      const signInMessage = validationMessage.clone();
      signInMessage.action = new SignInAction({
        type: 'SIGN_IN',
        payload: {},
      });
      signInMessage.buttonStatus = 'PROCESSING';

      const signInDoneMessage = signInMessage.clone();

      $sb.stub(SignInRepoImpl.prototype, 'signIn').resolves(new User());

      const spy = $sb.spy(kvStorage, 'setItem');

      const messages: SignInMessage[] = [];
      (bloc.outbox() as Observable<SignInMessage>).pipe(take(4)).subscribe({
        next: (message: SignInMessage) => {
          messages.push(message);
        },
        error: (err: Error) => {
          throw err;
        },
        complete: () => {
          expect(messages[0]).deep.equal(defaultMessage, 'first message');
          expect(messages[1]).deep.equal(validationMessage, 'second message');
          expect(messages[2]).deep.equal(signInMessage, 'third message');
          expect(messages[3]).deep.equal(signInDoneMessage, 'forth message');

          expect(spy.callCount).to.equal(4);
          expect(routerService.route).deep.equal({
            name: ROUTE_NAMES.HOME,
          });
          done();
        },
      });

      bloc.inbox().next(
        new SignInAction({
          type: 'VALIDATE',
          payload: {
            form: { email: 'test@test.com', password: 'survv123' },
          },
        })
      );
      bloc.inbox().next(
        new SignInAction({
          type: 'SIGN_IN',
          payload: {},
        })
      );
    });
    it('it handles sign in failure correctly', function (done) {
      const defaultMessage = new SignInMessage();

      const validationMessage = new SignInMessage();
      validationMessage.state.form = {
        email: 'test@test.com',
        password: 'survv123',
      };
      validationMessage.action = new SignInAction({
        type: 'VALIDATE',
        payload: {
          form: { email: 'test@test.com', password: 'survv123' },
        },
      });
      validationMessage.buttonStatus = 'ENABLED';

      const signInMessage = validationMessage.clone();
      signInMessage.action = new SignInAction({
        type: 'SIGN_IN',
        payload: {},
      });
      signInMessage.buttonStatus = 'PROCESSING';

      const signInFailureMessage = signInMessage.clone();
      signInFailureMessage.status = 'PROBLEMATIC';
      signInFailureMessage.buttonStatus = 'ENABLED';
      $sb.stub(SignInRepoImpl.prototype, 'signIn').rejects(new Error('error'));

      const messages: SignInMessage[] = [];
      (bloc.outbox() as Observable<SignInMessage>).pipe(take(4)).subscribe({
        next: (message: SignInMessage) => {
          messages.push(message);
        },
        error: (err: Error) => {
          throw err;
        },
        complete: () => {
          expect(messages[0]).deep.equal(defaultMessage, 'first message');
          expect(messages[1]).deep.equal(validationMessage, 'second message');
          expect(messages[2]).deep.equal(signInMessage, 'third message');
          expect(messages[3]).deep.equal(signInFailureMessage, 'forth message');

          expect(notificationService.notification).deep.equal(
            createNotification(new Error('an error'))
          );
          done();
        },
      });

      bloc.inbox().next(
        new SignInAction({
          type: 'VALIDATE',
          payload: {
            form: { email: 'test@test.com', password: 'survv123' },
          },
        })
      );
      bloc.inbox().next(
        new SignInAction({
          type: 'SIGN_IN',
          payload: {},
        })
      );
    });
  });
});
describe('SignInBloc Integration', function () {
  let bloc: SignInBloc;
  const routerService = new RouterServiceMockImpl();

  beforeEach(() => {
    bloc = new SignInBloc({
      signInRepo: new SignInRepoImpl(),
      userPreferenceRepo,
      notificationService,
      routerService,
    });
  });

  it('it signs in successfully', function (done) {
    const defaultMessage = new SignInMessage();

    const validationMessage = new SignInMessage();
    validationMessage.state.form = {
      email: 'test@test.com',
      password: 'survv123',
    };
    validationMessage.action = new SignInAction({
      type: 'VALIDATE',
      payload: {
        form: { email: 'test@test.com', password: 'survv123' },
      },
    });
    validationMessage.buttonStatus = 'ENABLED';

    const signInMessage = validationMessage.clone();
    signInMessage.action = new SignInAction({
      type: 'SIGN_IN',
      payload: {},
    });
    signInMessage.buttonStatus = 'PROCESSING';

    const signInDoneMessage = signInMessage.clone();

    const signInRequestPromise = wiremock
      .stub<CallCenterUserSignInRequest, CallCenterUserSignInResponse>()
      .request({
        requestLine: 'post /consumer/api/v1/vendor-users/sign-in',
        body: {
          email: 'test@test.com',
          password: 'survv123',
        },
      })
      .response({
        status: 200,
        body: {
          id: 123,
          name: 'User',
          mobileNo: '01234198',
          email: 'user@test.com',
          token:
            'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXJ2diIsInN1YiI6IjEyMyJ9.R36RdWYK1-v31uZCkYGv8G6B8432MhZY7HKZ21w-OZs',
          vendorId: 12345,
        },
      });

    const spy = $sb.spy(kvStorage, 'setItem');

    signInRequestPromise
      .then(() => {
        const messages: SignInMessage[] = [];
        (bloc.outbox() as Observable<SignInMessage>).pipe(take(4)).subscribe({
          next: (message: SignInMessage) => {
            messages.push(message);
          },
          error: (err: Error) => {
            throw err;
          },
          complete: () => {
            expect(messages[0]).deep.equal(defaultMessage, 'first message');
            expect(messages[1]).deep.equal(validationMessage, 'second message');
            expect(messages[2]).deep.equal(signInMessage, 'third message');
            expect(messages[3]).deep.equal(signInDoneMessage, 'forth message');

            expect(spy.callCount).to.equal(4);
            expect(routerService.route).deep.equal({
              name: ROUTE_NAMES.HOME,
            });
            done();
          },
        });

        bloc.inbox().next(
          new SignInAction({
            type: 'VALIDATE',
            payload: {
              form: { email: 'test@test.com', password: 'survv123' },
            },
          })
        );
        bloc.inbox().next(
          new SignInAction({
            type: 'SIGN_IN',
            payload: {},
          })
        );
      })
      .catch((err: Error) => {
        throw err;
      });
  });
});
