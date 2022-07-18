import ActiveRequestsProcessor from './ActiveRequestsProcessor';
import BasePM from '../base/BasePM';

class ActiveRequestsPM extends BasePM {
  constructor() {
    super();
    this.requestsList = [];
  }

  async hydrate() {
    this.requestsList = await new ActiveRequestsProcessor().execute();
    return this;
  }
}

export default ActiveRequestsPM;
