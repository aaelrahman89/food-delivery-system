import { assert } from 'chai';
import {
  commonNotificationCodes,
  notificationModel,
  notificationTypes,
} from '@survv/commons/core/notification/notification';
import {
  createNotification,
  notificationCodes,
} from '../../../../../src/core/notification';
import { errorCodes, errorModel } from '@survv/commons/core/errors/errors';

describe('notification', function () {
  describe('notificationCodes', function () {
    it('should be read-only', function () {
      assert.isFrozen(notificationCodes, 'frozen objects are read-only');
    });

    it('should contain all commonNotificationCodes from commons', function () {
      assert.ownInclude(
        notificationCodes,
        commonNotificationCodes,
        'has all deprecated notification codes'
      );
    });
  });

  describe('createNotification', function () {
    context('when the code EXISTS in notificationCodes', function () {
      it('should return a notificationModel with the value of the code', function () {
        const errorWithMappableCode = errorModel({
          message: 'any',
          code: errorCodes.SERVER_ERROR,
        });

        assert.deepEqual(
          createNotification(errorWithMappableCode),
          notificationModel({
            ...errorWithMappableCode,
            code: notificationCodes[errorWithMappableCode.code],
          }),
          'map code correctly'
        );
      });
    });

    context('when the code DOES NOT EXIST in notificationCodes', function () {
      it('should return a notificationModel with "ERROR" type and "TECHNICAL_ERROR" code', function () {
        const objectWithoutMappableCode = {
          code: 'nonExistingCode',
          type: notificationTypes.SUCCESS,
        };
        assert.deepEqual(
          createNotification(objectWithoutMappableCode),
          notificationModel({
            ...objectWithoutMappableCode,
            code: commonNotificationCodes.TECHNICAL_ERROR,
            type: notificationTypes.ERROR,
          }),
          'fallback to TECHNICAL_ERROR'
        );
      });
    });
  });
});
