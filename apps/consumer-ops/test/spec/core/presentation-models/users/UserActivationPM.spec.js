import UserActivationPM from '../../../../../src/core/presentation-models/users/UserActivationPM';
import { $sb } from '@survv/commons/test/utils/sandbox';
import { UsersRepoImpl } from '../../../../../src/shell/repositories/users/UsersRepoImpl';
import { assert } from 'chai';
import { errors } from '../../../../../src/core/errors';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { userPreferenceRepo } from '@survv/commons/shell/repositories/UserPreferenceRepoImpl';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('Ops user activation presentation model', function () {
  it('should call ActivationTokenExistsProcessor with correct params on init', async function () {
    const pm = new UserActivationPM({
      activationToken: 'activationToken',
      userPreferenceRepo,
      notificationService,
      usersRepo: new UsersRepoImpl(),
    });

    const activationTokenExistsProcessorModuleMock = $sb.mock(
      UsersRepoImpl.prototype
    );

    activationTokenExistsProcessorModuleMock
      .expects('activationTokenExists')
      .once()
      .withExactArgs('activationToken')
      .resolves(true);

    await pm.init();

    activationTokenExistsProcessorModuleMock.verify();
  });

  it('should validate that new password is required', function () {
    const pm = new UserActivationPM({
      userPreferenceRepo,
      notificationService,
      usersRepo: new UsersRepoImpl(),
    });
    assert.equal(pm.validatePassword(), errors.missingPasswordError);
  });

  it('should return password mismatch error if confirm password is not matched with new password', function () {
    const pm = new UserActivationPM({
      password: 'qweasd',
      confirmPassword: 'qweasddd',
      userPreferenceRepo,
      notificationService,
      usersRepo: new UsersRepoImpl(),
    });
    assert.equal(pm.validateConfirmPassword(), errors.passwordMismatchError);
  });

  it('should return true  if confirm password is matched with new password', function () {
    const pm = new UserActivationPM({
      password: 'qweasd',
      confirmPassword: 'qweasd',
      userPreferenceRepo,
      notificationService,
      usersRepo: new UsersRepoImpl(),
    });
    assert.isTrue(pm.validateConfirmPassword());
  });

  it('should be able to editCustomerDetails on valid data', function () {
    const pm = new UserActivationPM({
      password: '123456',
      confirmPassword: '123456',
      activationToken: 'exampleToken',
      userPreferenceRepo,
      notificationService,
      usersRepo: new UsersRepoImpl(),
    });
    assert.isTrue(pm.canSubmit());
  });

  it('should not be able to editCustomerDetails on invalid data', function () {
    const pm = new UserActivationPM({
      password: '123456',
      userPreferenceRepo,
      notificationService,
      usersRepo: new UsersRepoImpl(),
    });

    assert.isFalse(pm.canSubmit());
  });
});

describe('UserActivationPM Integration', function () {
  it('should init successfully', async function () {
    const pm = new UserActivationPM({
      activationToken: 'token',
      userPreferenceRepo,
      notificationService,
      usersRepo: new UsersRepoImpl(),
    });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/users/activation-token/:activationToken',
        params: { activationToken: 'token' },
      })
      .response({
        status: 200,
        body: {
          id: 2165529378315486700,
          fullName: 'Bakaka Dassa',
          email: 'example@domain.com',
          mobileNo: '147657930',
          active: false,
        },
      });

    await pm.init();
  });

  it('should activate user successfully', async function () {
    const pm = new UserActivationPM({
      activationToken: 'token',
      userPreferenceRepo,
      notificationService,
      usersRepo: new UsersRepoImpl(),
    });

    pm.password = '1234';

    await wiremock
      .stub()
      .request({
        requestLine: 'post /api/v1/users/user-activation',
        params: { activationToken: 'token' },
        body: {
          password: '1234',
          activationToken: 'token',
        },
      })
      .response({
        status: 200,
        body: {
          id: 2165529378315486700,
          fullName: 'Bakaka Dassa',
          email: 'example@domain.com',
          mobileNo: '147657930',
        },
      });

    await pm.activateOpsUser();
  });
});
