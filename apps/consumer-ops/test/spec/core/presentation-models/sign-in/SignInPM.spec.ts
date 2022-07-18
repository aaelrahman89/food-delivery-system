import { $sb } from '@survv/commons/test/utils/sandbox';
import { AuthToken } from '@survv/commons/core/models/AuthToken';
import { LocalError, errorModel } from '@survv/commons/core/errors/errors';
import { SignInPM } from '../../../../../src/core/presentation-models/sign-in/SignInPM';
import { UserRole } from '@survv/commons/core/models/UserRole';
import {
  UserSignInRequest,
  UserSignInResponse,
} from '@survv/api/definitions/users';
import { assert } from 'chai';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import { createNotification } from '../../../../../src/core/notification';
import { errors } from '../../../../../src/core/errors';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { signInRepoImpl } from '../../../../../src/shell/repositories/sign-in/SignInRepoImpl';
import { userPreferenceRepo } from '@survv/commons/shell/repositories/UserPreferenceRepoImpl';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('SignInPM', function () {
  let pm: SignInPM;
  let error: LocalError;

  const signInRepo = signInRepoImpl;
  const dummyEmail = 'a@survv.com';
  const dummyPassword = '1234';
  const dummyToken = '123zxc';

  async function setup() {
    await wiremock
      .stub<UserSignInRequest, UserSignInResponse>()
      .request({
        requestLine: 'post /api/v1/users/sign-in',
        body: {
          email: dummyEmail,
          password: dummyPassword,
        },
      })
      .response({
        status: 200,
        body: {
          id: 123,
          fullName: 'Ahmed',
          mobileNo: 'Doe',
          email: dummyEmail,
          token: dummyToken,
        },
      });

    $sb.stub(authTokenRepo, 'getParsedToken').resolves(
      new AuthToken({
        iss: '',
        sub: '0',
        roles: [UserRole.SUPER_ADMIN.valueOf()],
        exp: 0,
      })
    );
  }

  beforeEach('setup RootPM', function () {
    pm = new SignInPM({
      signInRepo,
      userPreferenceRepo,
      notificationService,
    });

    error = errorModel({
      code: 'any code',
      message: 'any message',
    });
  });

  describe('_hydrate()', function () {
    it('fetches the configuration items of app customizations from backend and saves them', async function () {
      $sb.stub(userPreferenceRepo, 'getAppCustomizations').resolves({
        logoLtr: 'LogoLtr',
        logoRtl: 'LogoRtl',
        favicon: 'Favicon',
        BRAND_NAME: 'BRAND_NAME',
      });

      await pm.init();

      assert.equal(pm.logoLtr, 'LogoLtr');
      assert.equal(pm.logoRtl, 'LogoRtl');
      assert.equal(pm.favicon, 'Favicon');
      assert.equal(pm.BRAND_NAME, 'BRAND_NAME');
    });
  });

  describe('signIn()', function () {
    it('should call sign-in api and save the auth token', async function () {
      await setup();

      const authTokeRepoSpy = $sb.spy(authTokenRepo, 'saveToken');

      pm.form.email = dummyEmail;
      pm.form.password = dummyPassword;

      await pm.signIn();

      $sb.assert.calledWith(authTokeRepoSpy, dummyToken, [
        'business-ops',
        'consumer-ops',
      ]);

      const savedToken = await authTokenRepo.getToken();

      assert.equal(savedToken, dummyToken);
      assert.isUndefined(notificationService.notification);
    });
    it('should notify the error if sign-in failed', async function () {
      await setup();

      $sb.stub(signInRepo, 'signIn').rejects(error);

      await pm.signIn();

      assert.deepEqual(
        notificationService.notification,
        createNotification(error)
      );
    });
  });

  describe('switchLanguage()', function () {
    it('should switch the language the user chooses to', async function () {
      const userPreferenceStub = $sb
        .stub(userPreferenceRepo, 'switchLanguage')
        .resolves();

      await pm.switchLanguage();

      assert.isUndefined(notificationService.notification);
      $sb.assert.calledOnce(userPreferenceStub);
    });
    it('should notify errors if switching the language failed', async function () {
      $sb.stub(userPreferenceRepo, 'switchLanguage').rejects(error);

      await pm.switchLanguage();

      assert.deepEqual(
        notificationService.notification,
        createNotification(error)
      );
    });
  });

  describe('canSubmit()', function () {
    it('is false when the form is invalid', function () {
      pm.form.email = '';
      pm.form.password = '';

      assert.isFalse(pm.canSubmit);
    });
    it('is true when the form is valid', function () {
      pm.form.email = dummyEmail;
      pm.form.password = dummyPassword;

      assert.isTrue(pm.canSubmit);
    });
  });

  describe('validators()', function () {
    it('should return missingEmailError if email was missing', function () {
      assert.equal(pm.validators().email(), errors.missingEmailError);
    });
    it('should return invalidEmailFormatError if email was invalid', function () {
      pm.form.email = '123';
      assert.equal(pm.validators().email(), errors.invalidEmailFormatError);
    });
    it('should return missingPasswordError if password was missing', function () {
      assert.equal(pm.validators().password(), errors.missingPasswordError);
    });
    it('should return true if email exists and is valid', function () {
      pm.form.email = 'a@survv.com';
      assert.isTrue(pm.validators().email());
    });
    it('should return true if password exists and is valid', function () {
      pm.form.password = '123';
      assert.isTrue(pm.validators().password());
    });
  });
});
