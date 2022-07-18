import BaseProcessor from '../../../../../src/core/deprecated/base/BaseProcessor';
import { $sb } from '@survv/commons/test/utils/sandbox';
import { assert } from 'chai';

describe('Base Processor', function () {
  it('should have extract, validate, process and execute methods', function () {
    const bp = new BaseProcessor();
    assert.exists(bp.extract);
    assert.exists(bp.validate);
    assert.exists(bp.process);
    assert.exists(bp.execute);
  });

  it('should call extract, validate and process on execution', function () {
    const bp = new BaseProcessor();
    const extractSpy = $sb.spy(bp, 'extract');
    const validateSpy = $sb.spy(bp, 'validate');
    const processSpy = $sb.spy(bp, 'process');

    bp.execute();

    assert.isTrue(extractSpy.calledOnce);
    assert.isTrue(validateSpy.calledOnce);
    assert.isTrue(processSpy.calledOnce);
  });
});
