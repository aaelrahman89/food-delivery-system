import SignInPM from '../../../../../src/core/presentation-models/sign-in/SignInPM';
import { $sb } from '@survv/commons/test/utils/sandbox';
import { AuthToken } from '@survv/commons/core/models/AuthToken';
import {
  BranchSignInRequest,
  BranchSignInResponse,
} from '@survv/api/definitions/vendors';
import { LocalError, errorModel } from '@survv/commons/core/errors/errors';
import { SignInRepoImpl } from '../../../../../src/shell/repositories/auth/SignInRepoImpl';
import { UserRole } from '@survv/commons/core/models/UserRole';
import { assert } from 'chai';
import { authTokenRepo } from '@survv/commons/shell/repositories/AuthTokenRepoImpl';
import { createNotification } from '../../../../../src/core/notification';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { userPreferenceRepo } from '@survv/commons/shell/repositories/UserPreferenceRepoImpl';
import { validationMessages } from '@survv/commons/core/validations/form-validators';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('SignInPM', function () {
  let pm: SignInPM;
  let error: LocalError;

  const testBranchCode = '12345678';
  const testToken = '123zxc';

  async function setup() {
    await wiremock
      .stub<BranchSignInRequest, BranchSignInResponse>()
      .request({
        requestLine: 'post /consumer/api/v1/branches/sign-in',
        body: {
          code: testBranchCode,
        },
      })
      .response({
        status: 200,
        body: {
          id: 123,
          code: testBranchCode,
          label: 'KFC',
          vendorId: 12345,
          token: testToken,
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
      signInRepo: new SignInRepoImpl(),
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

      pm.branchCode = testBranchCode;

      await pm.signIn();

      $sb.assert.calledWith(authTokeRepoSpy, testToken);

      const savedToken = await authTokenRepo.getToken();

      assert.equal(savedToken, testToken);
      assert.isUndefined(notificationService.notification);
    });
    it('should notify the error if sign-in failed', async function () {
      await setup();

      $sb.stub(SignInRepoImpl.prototype, 'signIn').rejects(error);

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
      pm.branchCode = '';

      assert.isFalse(pm.canSubmit);
    });
    it('is true when the form is valid', function () {
      pm.branchCode = testBranchCode;

      assert.isTrue(pm.canSubmit);
    });
  });

  describe('validators()', function () {
    it('should return required input error if branchCode was missing', function () {
      assert.equal(
        pm.validators().branchCode(),
        validationMessages.FORM_REQUIRED_INPUT
      );
    });
    it('should return invalid branchCode error if branch code was invalid', function () {
      pm.branchCode = '123';
      assert.equal(pm.validators().branchCode(), 'FORM_INVALID_BRANCH_CODE');
    });
    it('should return true if branchCode exists and is valid', function () {
      pm.branchCode = '12345678';
      assert.isTrue(pm.validators().branchCode());
    });
  });
});
