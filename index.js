// import map from 'lodash/map';
import _ from 'lodash';
import Koa from 'lib/koa-web';

var nums = [1, 2, 3];

function square(x) {
    return x*x;
}

console.log('square', square(3));
// console.log(map(nums, square));
console.log(_.map(nums, square));
console.log('Koa', Koa);