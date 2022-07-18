import { BaseMessage } from '../../../../core/base/BaseMessage';
import { expect } from 'chai';

class FakeMessageImplementation extends BaseMessage {
  primitiveStringVal = 'string val';
  primitiveNumberVal = 100;
  primitiveBooleanVal = true;
  objectVal = { a: 'value' };
  multiNestingObjectVal = {
    a: 'val',
    b: {
      ba: 'b-value',
    },
    c: {
      cb: {
        cba: 'c-value',
      },
    },
    d: ['a', 'b', 'c'],
    e: [{ a: 'a-val' }, { b: 'b-val' }, { c: 'c-val' }],
    f: [{ a: { b: 'a-b-val' } }],
  };

  primitiveArrayVal = [1, 2, 3, 4];
  objectArrayVal = [{ key1: 'value1' }, { key2: 'value2' }];
  multiNestingObjectArrayVal = [{ key1: { key2: 'key1-key2-val' } }];

  fakeFunction(): string {
    return 'fakeFunction';
  }
}

describe('BaseMessage Unit', function () {
  it('clones the instance', function () {
    const message = new FakeMessageImplementation();
    const clonedMessage = message.clone();

    expect(message).to.deep.equal(clonedMessage);
    expect(message === clonedMessage).to.be.false;
  });

  it('does not change the original message if cloned message has been updated', function () {
    const message = new FakeMessageImplementation();
    const clonedMessage = message.clone();
    clonedMessage.primitiveStringVal = 'new string val';
    clonedMessage.primitiveNumberVal = 1000;
    clonedMessage.primitiveBooleanVal = false;
    clonedMessage.objectVal = { a: 'new value' };
    clonedMessage.multiNestingObjectVal.a = 'new val';
    clonedMessage.multiNestingObjectVal.b.ba = 'new b-value';
    clonedMessage.multiNestingObjectVal.c.cb.cba = 'new c-value';
    clonedMessage.multiNestingObjectVal.d[0] = 'new a';
    clonedMessage.multiNestingObjectVal.d[1] = 'new b';
    clonedMessage.multiNestingObjectVal.d[2] = 'new c';
    clonedMessage.multiNestingObjectVal.e[0].a = 'new a-val';
    clonedMessage.multiNestingObjectVal.e[1].b = 'new b-val';
    clonedMessage.multiNestingObjectVal.e[2].c = 'new c-val';
    clonedMessage.multiNestingObjectVal.f[0].a.b = 'new a-b-val';
    clonedMessage.primitiveArrayVal[0] = 11;
    clonedMessage.primitiveArrayVal[1] = 22;
    clonedMessage.primitiveArrayVal[2] = 33;
    clonedMessage.primitiveArrayVal[3] = 44;
    clonedMessage.objectArrayVal[0].key1 = 'new value1';
    clonedMessage.objectArrayVal[1].key2 = 'new value2';
    clonedMessage.multiNestingObjectArrayVal[0].key1.key2 = 'new key1-key2-val';

    expect(message).to.deep.equal(new FakeMessageImplementation());
    expect(clonedMessage).to.deep.equal({
      primitiveStringVal: 'new string val',
      primitiveNumberVal: 1000,
      primitiveBooleanVal: false,
      objectVal: { a: 'new value' },
      multiNestingObjectVal: {
        a: 'new val',
        b: {
          ba: 'new b-value',
        },
        c: {
          cb: {
            cba: 'new c-value',
          },
        },
        d: ['new a', 'new b', 'new c'],
        e: [{ a: 'new a-val' }, { b: 'new b-val' }, { c: 'new c-val' }],
        f: [{ a: { b: 'new a-b-val' } }],
      },
      primitiveArrayVal: [11, 22, 33, 44],
      objectArrayVal: [{ key1: 'new value1' }, { key2: 'new value2' }],
      multiNestingObjectArrayVal: [{ key1: { key2: 'new key1-key2-val' } }],
    });
  });

  it('cloned message has access to message methods', function () {
    const message = new FakeMessageImplementation();
    const clonedMessage = message.clone();
    clonedMessage.primitiveStringVal = 'new value';
    const anotherClonedMessage = clonedMessage.clone();

    expect(anotherClonedMessage).to.deep.equal(clonedMessage);
    expect(anotherClonedMessage.fakeFunction()).to.equal('fakeFunction');
  });
});
