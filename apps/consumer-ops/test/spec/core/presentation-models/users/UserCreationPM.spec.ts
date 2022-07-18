import { $sb } from '@survv/commons/test/utils/sandbox';
import { Base64EncodedFile } from '@survv/commons/core/models/Files';
import {
  ImageCreationRequest,
  ImageCreationResponse,
  ImageMimeType,
  ImageReferenceType,
} from '@survv/api/definitions/images';
import { ImageRefType } from '@survv/commons/core/models/Images';
import { LocalError } from '@survv/commons/core/errors/errors';
import { UserCreationPM } from '../../../../../src/core/presentation-models/users/UserCreationPM';
import {
  UserCreationRequest,
  UserCreationResponse,
} from '@survv/api/definitions/users';
import { UserRole } from '@survv/commons/core/models/UserRole';
import { UsersRepoImpl } from '../../../../../src/shell/repositories/users/UsersRepoImpl';
import { assert } from 'chai';
import { createNotification } from '../../../../../src/core/notification';
import { imageCreationResponseStub } from '@survv/api/stubs/images';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { required } from '@survv/commons/core/validations/form-validators';
import { successfulOperation } from '@survv/commons/core/notification/notification';
import { userCreationResponseStub } from '@survv/api/stubs/users';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('UserCreationPM', function () {
  describe('form', function () {
    it('submits & notifies successful operation successfully', async function () {
      const pm = new UserCreationPM({
        notificationService,
        usersRepo: new UsersRepoImpl(),
      });

      pm.form.name = 'user name';
      pm.form.email = 'user email';
      pm.form.mobileNo = '01001234567';
      pm.form.userRoles = [UserRole.OPS_MANAGER, UserRole.OPS_USER];
      pm.form.profileImage = new Base64EncodedFile({
        dataUrl: 'data:image/jpeg;base64,RIGEpsrCGMzYmyikYr/EwQ==',
        type: 'image/jpeg',
      });

      const userCreationResponse = userCreationResponseStub();
      userCreationResponse.id = 1111;

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
        .stub<UserCreationRequest, UserCreationResponse>()
        .request({
          requestLine: 'post /api/v1/users',
        })
        .response({ status: 200, body: userCreationResponse });

      const submitted = await pm.form.submit();

      assert.isTrue(submitted);
      assert.deepEqual(notificationService.notification, successfulOperation());
    });

    it('notifies the error on failed submit', async function () {
      const pm = new UserCreationPM({
        notificationService,
        usersRepo: new UsersRepoImpl(),
      });

      $sb
        .stub(UsersRepoImpl.prototype, 'createUser')
        .rejects(new LocalError({ code: 'ERROR', message: 'an error' }));

      pm.form.name = 'user name';
      pm.form.email = 'user email';
      pm.form.mobileNo = '01001234567';
      pm.form.userRoles = [UserRole.OPS_MANAGER, UserRole.OPS_USER];
      pm.form.profileImage = new Base64EncodedFile({
        dataUrl: 'data:image/jpeg;base64,RIGEpsrCGMzYmyikYr/EwQ==',
        type: 'image/jpeg',
      });

      await pm.form.submit();

      assert.deepEqual(
        notificationService.notification,
        createNotification(
          new LocalError({ code: 'ERROR', message: 'an error' })
        )
      );
    });

    it('validates that "name" input is required', function () {
      const pm = new UserCreationPM({
        notificationService,
        usersRepo: new UsersRepoImpl(),
      });

      assert.equal(pm.form.validators.name(), required(''));
    });

    it('validates that "email" input is required', function () {
      const pm = new UserCreationPM({
        notificationService,
        usersRepo: new UsersRepoImpl(),
      });

      assert.equal(pm.form.validators.email(), required(''));
    });

    it('validates that "user roles" input is required', function () {
      const pm = new UserCreationPM({
        notificationService,
        usersRepo: new UsersRepoImpl(),
      });

      assert.equal(pm.form.validators.userRoles(), required(''));
    });
  });
});
