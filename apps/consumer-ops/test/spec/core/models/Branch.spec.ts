import { BranchProfileListItem } from '../../../../src/core/models/Branch';
import { Money, money } from '@survv/commons/core/models/money';
import { Time } from '@survv/commons/core/models/Time';
import { assert } from 'chai';

describe('Branch Model', function () {
  it('has a missing name when display names are all empty', function () {
    const branch = new BranchProfileListItem({
      id: 1,
      label: 'KFC',
      displayName: {
        en: '',
        ar: '',
      },
      vendorId: 12,
      active: true,
      hasCompleteProfile: true,
      minimumOrderValue: money({
        amount: 10,
        currency: 'EGP',
      }),
      orderingHours: {
        from: new Time('10:00:00'),
        to: new Time('12:00:00'),
      },
      avgBasketSize: new Money({
        amount: 60.15,
        currency: 'EGP',
      }),
      posIntegrated: true,
      posIntegrationType: 'LINETEN',
    });

    assert.isTrue(branch.hasMissingName);

    branch.displayName = {
      en: 'en',
      ar: 'ar',
    };

    assert.isFalse(branch.hasMissingName);
  });

  it('displays the displayName if it is not empty or displays the label if it is', function () {
    const branch = new BranchProfileListItem({
      id: 1,
      label: 'KFC',
      displayName: {
        en: '',
        ar: '',
      },
      vendorId: 12,
      active: true,
      hasCompleteProfile: true,
      minimumOrderValue: money({
        amount: 10,
        currency: 'EGP',
      }),
      orderingHours: {
        from: new Time('10:00:00'),
        to: new Time('12:00:00'),
      },
      avgBasketSize: new Money({
        amount: 60.15,
        currency: 'EGP',
      }),
      posIntegrated: true,
      posIntegrationType: 'LINETEN',
    });

    assert.deepEqual(branch.name, branch.label);

    branch.displayName = {
      en: 'en',
      ar: 'ar',
    };

    assert.deepEqual(branch.name, branch.displayName);
  });
});
