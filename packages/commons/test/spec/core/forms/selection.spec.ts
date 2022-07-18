import { EnumClass } from '../../../../core/models/EnumClass';
import {
  FormSelectionOption,
  mapEnumsToSelections,
} from '../../../../core/forms/selection';
import { assert } from 'chai';

describe('SelectionOption unit', function () {
  it('has value & label', function () {
    assert.deepEqual(new FormSelectionOption<string>('value', 'label'), {
      value: 'value',
      label: 'label',
    });
  });

  it('maps given enum class to selections', function () {
    class FakeEnumClass extends EnumClass {
      _prefix: string;

      constructor(value: string) {
        super(value);
        this._prefix = 'ENUM';
      }

      static value1 = new FakeEnumClass('value1');
      static value2 = new FakeEnumClass('value2');
    }

    assert.deepEqual(mapEnumsToSelections(FakeEnumClass.lookup()), [
      new FormSelectionOption(
        new FakeEnumClass('value1'),
        new FakeEnumClass('value1').toString()
      ),
      new FormSelectionOption(
        new FakeEnumClass('value2'),
        new FakeEnumClass('value2').toString()
      ),
    ]);
  });
});
