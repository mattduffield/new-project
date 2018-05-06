import map from 'lodash/map';

var nums = [1, 2, 3];

function square(x) {
    return x*x;
}

console.log(map(nums, square));
