// import map from 'lodash/map';
import _ from 'lodash';
// import compose from 'koa-compose';
import {Application as Koa} from './lib/koa-web/application.js';

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
console.log('Koa', Koa);
// console.log('compose', compose);
// doWork();