import {
  Notification,
  badOperation,
  commonNotificationCodes,
  notificationModel,
  notificationTypes,
  successfulOperation,
} from '../../../../core/notification/notification';
import { assert } from 'chai';

describe('notification unit', function () {
  describe('notificationTypes', function () {
    it('should be read-only', function () {
      assert.isFrozen(notificationTypes, 'frozen objects are read-only');
    });
  });

  describe('notificationModel', function () {
    it('should have a code, args, and type properties', function () {
      const notification = notificationModel({
        code: 'code',
        args: 'args',
        type: 'type',
      });

      assert.deepEqual(notification, {
        code: 'code',
        args: 'args',
        type: 'type',
      });
    });
  });

  describe('commonNotificationCodes', function () {
    Object.entries(commonNotificationCodes).forEach(([key, value]) => {
      it(`should have the code ${key} as MACRO_CASE prefixed with "ERR", "SUCC", or "WARN"`, function () {
        const notificationCodeRegex = /^(ERR|SUCC|WARN)_[A-Z0-9_]+[A-Z0-9]$/;

        assert.match(
          value,
          notificationCodeRegex,
          'prefix with ERR, SUCC or WARN'
        );
      });
    });
  });

  describe('badOperation()', function () {
    it('returns a notification with "ERROR" type and "BAD_OPERATION" code', function () {
      assert.deepEqual(
        Notification.badOperation(),
        new Notification({
          code: commonNotificationCodes.BAD_OPERATION,
          type: notificationTypes.ERROR,
        }),
        'badOperation is of type error'
      );
    });
  });

  describe('successfulOperation()', function () {
    it('returns a notification with "SUCCESS" type and "SUCCESSFUL_OPERATION" code', function () {
      assert.deepEqual(
        Notification.successfulOperation(),
        new Notification({
          code: commonNotificationCodes.SUCCESSFUL_OPERATION,
          type: notificationTypes.SUCCESS,
        }),
        'successfulOperation is of type error'
      );
    });
  });

  describe('badOperation Deprecated', function () {
    it('should return a notificationModel with "ERROR" type and "BAD_OPERATION" code', function () {
      assert.deepEqual(
        badOperation(),
        notificationModel({
          code: commonNotificationCodes.BAD_OPERATION,
          type: notificationTypes.ERROR,
        }),
        'badOperation is of type error'
      );
    });
  });

  describe('successfulOperation Deprecated', function () {
    it('should return a notificationModel with "SUCCESS" type and "SUCCESSFUL_OPERATION" code', function () {
      assert.deepEqual(
        successfulOperation(),
        notificationModel({
          code: commonNotificationCodes.SUCCESSFUL_OPERATION,
          type: notificationTypes.SUCCESS,
        }),
        'successfulOperation is of type error'
      );
    });
  });
});
