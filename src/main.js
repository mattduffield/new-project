import {PLATFORM} from 'aurelia-pal';
import 'babel-polyfill';
import * as Bluebird from 'bluebird';
import 'bootstrap/dist/css/bootstrap.css';

export async function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging();

  await aurelia.start();
  await aurelia.setRoot(PLATFORM.moduleName('app'));
}
