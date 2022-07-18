import { $sb } from '@survv/commons/test/utils/sandbox';
import { Base64EncodedFile } from '@survv/commons/core/models/Files';
import {
  ImageCreationRequest,
  ImageCreationResponse,
  ImageMimeType,
  ImageReferenceType,
} from '@survv/api/definitions/images';
import {
  ImageRefType,
  createImageUrl,
} from '@survv/commons/core/models/Images';
import { LocalError } from '@survv/commons/core/errors/errors';
import {
  UserDetailsRequest,
  UserDetailsResponse,
  UserUpdateRequest,
  UserUpdateResponse,
} from '@survv/api/definitions/users';
import { UserRole } from '@survv/commons/core/models/UserRole';
import { UserUpdatePM } from '../../../../../src/core/presentation-models/users/UserUpdatePM';
import { UsersRepoImpl } from '../../../../../src/shell/repositories/users/UsersRepoImpl';
import { assert } from 'chai';
import { createNotification } from '../../../../../src/core/notification';
import { imageCreationResponseStub } from '@survv/api/stubs/images';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { required } from '@survv/commons/core/validations/form-validators';
import { successfulOperation } from '@survv/commons/core/notification/notification';
import { userDetailsResponseStub } from '@survv/api/stubs/users';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('UserUpdatePM', function () {
  describe('init()', function () {
    it('hydrates the user form', async function () {
      const pm = new UserUpdatePM({
        userId: 1111,
        notificationService,
        usersRepo: new UsersRepoImpl(),
      });

      const stubResponse = userDetailsResponseStub();
      stubResponse.id = 1111;
      stubResponse.fullName = 'user name';
      stubResponse.email = 'user email';
      stubResponse.mobileNo = '01001234567';
      stubResponse.userRoles = [UserRole.OPS_MANAGER.valueOf()];

      await wiremock
        .stub<UserDetailsRequest, UserDetailsResponse>()
        .request({
          requestLine: 'get /api/v1/users/:userId',
          params: { userId: 1111 },
        })
        .response({ status: 200, body: stubResponse });

      await pm.init();

      assert.equal(pm.form.name, 'user name');
      assert.equal(pm.form.email, 'user email');
      assert.equal(pm.form.mobileNo, '01001234567');
      assert.deepEqual(pm.form.userRoles, [UserRole.OPS_MANAGER]);
      assert.deepEqual(
        pm.form.profileImage,
        createImageUrl({
          refId: 1111,
          refType: ImageRefType.OPS_USER_PROFILE_IMAGE,
        })
      );
    });
  });
  describe('form', function () {
    it('submits & notifies successful operation successfully', async function () {
      const pm = new UserUpdatePM({
        userId: 1111,
        notificationService,
        usersRepo: new UsersRepoImpl(),
      });

      await wiremock
        .stub<UserDetailsRequest, UserDetailsResponse>()
        .request({
          requestLine: 'get /api/v1/users/:userId',
          params: { userId: 1111 },
        })
        .response({ status: 200, body: userDetailsResponseStub() });

      await pm.init();

      pm.form.name = 'user name';
      pm.form.email = 'user email';
      pm.form.mobileNo = '01001234567';
      pm.form.userRoles = [UserRole.OPS_MANAGER, UserRole.OPS_USER];
      pm.form.profileImage = new Base64EncodedFile({
        dataUrl: 'data:image/jpeg;base64,RIGEpsrCGMzYmyikYr/EwQ==',
        type: 'image/jpeg',
      });

      await wiremock
        .stub<ImageCreationRequest, ImageCreationResponse>()
        .request({
          requestLine: 'post /api/v1/files',
          body: {
            referenceId: 1111,
            referenceType:
              ImageRefType.OPS_USER_PROFILE_IMAGE.valueOf() as ImageReferenceType,
            payload: pm.form.profileImage.base64String,
            mimeType: pm.form.profileImage.type as ImageMimeType,
            append: false,
          },
        })
        .response({ status: 200, body: imageCreationResponseStub() });

      await wiremock
        .stub<UserUpdateRequest, UserUpdateResponse>()
        .request({
          requestLine: 'put /api/v1/users/:userId',
          params: { userId: 1111 },
        })
        .response({ status: 200 });

      const submitted = await pm.form.submit();

      assert.isTrue(submitted);
      assert.deepEqual(notificationService.notification, successfulOperation());
    });

    it('notifies the error on failed submit', async function () {
      const pm = new UserUpdatePM({
        userId: 1111,
        notificationService,
        usersRepo: new UsersRepoImpl(),
      });

      await wiremock
        .stub<UserDetailsRequest, UserDetailsResponse>()
        .request({
          requestLine: 'get /api/v1/users/:userId',
          params: { userId: 1111 },
        })
        .response({ status: 200, body: userDetailsResponseStub() });

      await pm.init();

      $sb
        .stub(UsersRepoImpl.prototype, 'updateUser')
        .rejects(new LocalError({ code: 'ERROR', message: 'an error' }));

      await pm.form.submit();

      assert.deepEqual(
        notificationService.notification,
        createNotification(
          new LocalError({ code: 'ERROR', message: 'an error' })
        )
      );
    });

    it('validates that "name" input is required', function () {
      const pm = new UserUpdatePM({
        userId: 1111,
        notificationService,
        usersRepo: new UsersRepoImpl(),
      });

      assert.equal(pm.form.validators.name(), required(''));
    });

    it('validates that "email" input is required', function () {
      const pm = new UserUpdatePM({
        userId: 1111,
        notificationService,
        usersRepo: new UsersRepoImpl(),
      });

      assert.equal(pm.form.validators.email(), required(''));
    });

    it('validates that "user roles" input is required', function () {
      const pm = new UserUpdatePM({
        userId: 1111,
        notificationService,
        usersRepo: new UsersRepoImpl(),
      });

      assert.equal(pm.form.validators.userRoles(), required(''));
    });
  });
});
