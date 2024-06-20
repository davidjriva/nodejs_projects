/*
    This file contains an experiment to better understand how modules & caching are used in Node.js
*/

const Calc = require('./test-module-1');

const Calc1 = new Calc();
console.log(`1 + 2 = ${Calc1.add(1, 2)}`);
console.log('---------')

const { add, multiply, divide } = require('./test-module-2');
console.log(`3 + 3 = ${add(3, 3)}`);
console.log(`3 * 3 = ${multiply(3, 3)}`);
console.log(`3 / 3 = ${divide(3, 3)}`);

// caching
require('./test-module-3')();
require('./test-module-3')();
require('./test-module-3')();