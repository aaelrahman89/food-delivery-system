import { wiremock as commonWiremock } from '@survv/commons/test/utils/wiremock';

const oldWiremockWrapper = {
  stub() {
    const stub = commonWiremock.stub();
    return {
      request(method, url, { body = null, headers = null } = {}) {
        stub.request({ requestLine: `${method} ${url}`, body, headers });
        return this;
      },
      async reply(status, body = null, { headers = null } = {}) {
        return stub.response({ status, body, headers });
      },
    };
  },
};

const wiremock = oldWiremockWrapper;

export default wiremock;
