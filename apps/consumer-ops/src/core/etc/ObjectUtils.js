import fastDeepEqual from 'fast-deep-equal';
import lodashCloneDeep from 'lodash.clonedeep';

class ObjectUtils {
  static deepClone(obj) {
    return lodashCloneDeep(obj);
  }

  static deepEqual(obj1, obj2) {
    return fastDeepEqual(obj1, obj2);
  }
}

export default ObjectUtils;
