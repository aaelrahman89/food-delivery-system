/* eslint-env node */

const { resolve } = require('path');
const { readFileSync } = require('fs');

let nokubeGateway;

const projectRoot = resolve(`${__dirname}/..`);

try {
  if (process.env.LOCAL_WIREMOCK) {
    nokubeGateway = readFileSync(
      `${projectRoot}/local_wiremock`,
      'utf8'
    ).trim();
  } else {
    nokubeGateway = readFileSync(
      `${projectRoot}/nokube_gateway`,
      'utf8'
    ).trim();
  }
} catch (err) {
  nokubeGateway = 'localhost';
}
const apps = [
  {
    entryName: 'call-center',
    pageTitle: 'SURVV Call Center',
    baseUrl: '/call-center',
    directory: resolve(projectRoot, 'apps/call-center'),
    isPwa: false,
  },
  {
    entryName: 'consumer-vendor',
    pageTitle: 'SURVV Consumer Vendor',
    baseUrl: '/consumer-vendor',
    directory: resolve(projectRoot, 'apps/consumer-vendor'),
    isPwa: false,
  },
  {
    entryName: 'consumer-ops',
    pageTitle: 'SURVV Consumer Ops',
    baseUrl: '/consumer-ops',
    directory: resolve(projectRoot, 'apps/consumer-ops'),
    isPwa: false,
  },
  {
    entryName: 'consumer-branches',
    pageTitle: 'SURVV Consumer Branch',
    baseUrl: '/consumer-branch',
    directory: resolve(projectRoot, 'apps/consumer-branches'),
    isPwa: true,
  },
];

module.exports = {
  apps,
  nokubeGateway,
  rootPath: projectRoot,
  buildPath: resolve(projectRoot, 'dist'),
  devServerPort: 9090,
  staticServerPort: 10000,
};
