import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import { nokubeGateway } from '../../../scripts/projectConfig';

// setup browser-like environment
const dom = new JSDOM(
  '<!doctype html><html><head><meta charset="utf-8">' +
    '</head><body></body></html>',
  {
    url: `http://${nokubeGateway}/api`,
    contentType: 'text/html',
  }
);

global.window = global;
global.fetch = fetch;
global.document = dom.window.document;
global.localStorage = dom.window.localStorage;
global.atob = dom.window.atob;
global.btoa = dom.window.btoa;
global.FileReader = function FileReaderMock() {
  this.onload = function onload() {};

  this.readAsArrayBuffer = function readAsArrayBuffer() {
    this.onload();
    return true;
  };

  this.readAsText = function readAsText() {
    this.onload();
    return true;
  };

  this.result = '';
};

global.navigator = dom.window.navigator;
global.Notification = {};

/**
 * @Deprecated */
localStorage.setItem('override_url', `http://${nokubeGateway}/api`);

process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line no-console
  console.log(
    '[TESTING_ERROR] Tests may have passed but you have unhandled promise rejection'
  );
  // eslint-disable-next-line no-console
  console.trace(err);
  process.exit(1);
});
