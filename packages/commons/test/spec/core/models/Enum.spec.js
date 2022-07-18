import { Enum } from '../../../../core/models/Enum';
import { assert } from 'chai';

describe('Enum', function () {
  it('sets constructor name', function () {
    class FakeEnum extends Enum {
      constructor() {
        super();
        this.setConstructorName('CustomConstructorName');
      }

      get constructorName() {
        return this._constructorName;
      }
    }
    const fakeEnum = new FakeEnum();

    assert.equal(fakeEnum.constructorName, 'CustomConstructorName');
  });
  it('should override props from enum values', function () {
    class FakeEnum extends Enum {
      constructor(value) {
        super(value);
        this.prop = 'default';
        this.overrideProps();
      }

      static get enumValues() {
        return {
          enum1: {
            prop: 'prop1',
          },
        };
      }
    }
    const fakeEnum = new FakeEnum('enum1');
    assert.equal(fakeEnum.prop, 'prop1');
  });
  it('is prefixed with set constructor name in MACRO_CASE when stringified', function () {
    class FakeEnum extends Enum {
      constructor(value) {
        super(value);
        this.setConstructorName('PrefixName');
      }
    }
    const fakeEnum = new FakeEnum('enum1');
    assert.equal(String(fakeEnum), 'PREFIX_NAME_enum1');
  });
});
