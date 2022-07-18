import { assert } from 'chai';
import { notificationService } from '../../../../shell/services/notificationService';

describe('notificationService unit', function () {
  it('notifies by given notification', function () {
    notificationService.notify('a notification');

    assert.equal(notificationService.notification, 'a notification');
  });
  it('resets notification to initial state', function () {
    notificationService.notify('djfkas');
    notificationService.reset('djfkas');

    assert.isUndefined(notificationService.notification);
  });
});
