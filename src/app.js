/*
// import map from 'lodash/map';
import _ from 'lodash';
// import compose from 'koa-compose';
// import {Application as Koa} from './lib/koa-web/application.js';

var nums = [1, 2, 3];

function square(x) {
  return x*x;
}
async function test() {
  return new Promise((resolve, reject) => {
    resolve('hello');
  });
}
async function doWork() {
  const msg = await test();
  console.log('message', msg);
}
console.log('square', square(3));
// console.log(map(nums, square));
console.log(_.map(nums, square));
// console.log('Koa', Koa);
// console.log('compose', compose);
// doWork();
*/

import {AppService} from 'services/app-service';


export class App {
  static inject = [AppService];

  message = "This is exciting!";

  constructor(appSvc) {
    this.appSvc = appSvc;
  }

  attached() {
    // this.compute();
    this.appSvc.setupConsole();
    this.appSvc.displayInit();
  }
  async compute() {
    const message2 = await this.computeMessage();
    this.message = message2;
  }
  async computeMessage() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        return resolve('How do you like me now?');
      },3000);
    });
  }

  
}
    