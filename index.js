// import map from 'lodash/map';
import _ from 'lodash';
import {Application as Koa} from './lib/koa-web/application';

var nums = [1, 2, 3];

function square(x) {
    return x*x;
}

console.log('square', square(3));
// console.log(map(nums, square));
console.log(_.map(nums, square));
console.log('Koa', Koa);