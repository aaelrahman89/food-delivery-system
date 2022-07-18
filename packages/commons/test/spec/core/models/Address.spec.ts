import { Address } from '../../../../core/models/Address';
import { assert } from 'chai';

describe('Address', function () {
  it('is created with default values if no args given', function () {
    const address = new Address();

    assert.equal(address.apartment, '');
    assert.equal(address.building, '');
    assert.equal(address.street, '');
    assert.equal(address.companyName, '');
    assert.equal(address.landmark, '');
    assert.equal(address.floor, 0);
  });

  it('["companyName" & "landmark"] are optional args', function () {
    const address = new Address({
      street: 'street',
      floor: 1,
      building: '1A',
      apartment: 'S14',
    });

    assert.equal(address.apartment, 'S14');
    assert.equal(address.building, '1A');
    assert.equal(address.street, 'street');
    assert.equal(address.companyName, '');
    assert.equal(address.landmark, '');
    assert.equal(address.floor, 1);
  });

  it('toString() constructs address correctly in case all values given', function () {
    const address = new Address({
      street: 'street',
      floor: 1,
      building: '1A',
      apartment: 'S14',
      companyName: 'VG',
      landmark: 'area 52',
    });

    assert.equal(
      address.toString(),
      '1A, street, Floor 1, Apartment S14, Company VG, Near area 52'
    );
  });

  it('toString() constructs address correctly in case no values given', function () {
    const address = new Address();

    assert.equal(address.toString(), '');
  });

  it('toString() constructs address correctly in case some values given', function () {
    const address = new Address({
      street: 'street',
      floor: 1,
      building: '1A',
      apartment: 'S14',
    });

    assert.equal(address.toString(), '1A, street, Floor 1, Apartment S14');
  });
});
