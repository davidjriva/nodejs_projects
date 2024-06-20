/*
    This file contains an experiment to better understand the threadpool & event loop used in Node.js
*/

const fs = require('fs');
const crypto = require('crypto');

const start = Date.now();
process.env.UV_THREADPOOL_SIZE = 5; // Modifying the underlying libuv threadpool size

// IMPORTANT: ** Not in the event loop since it's not located in a callback !! **
setTimeout(() => console.log('Timer 1 finished'), 0);

// Events only enter the event loop if they're in a callback
fs.readFile('text-file.txt', () => {
  console.log('I/O finished');
  console.log('------------');

  setTimeout(() => console.log('Timer 2 finished'), 1000);
  setImmediate(() => console.log('Immediate 1 finished'));

  process.nextTick(() => console.log('Process.nextTick'));

  // Off loading tasks to thread pool (default thread pool size is 4, but we changed it to 5 above)
  crypto.pbkdf2('password123', 'salt42', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'ms -- password encrypted');
  });
  crypto.pbkdf2('password123', 'salt42', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'ms -- password encrypted');
  });
  crypto.pbkdf2('password123', 'salt42', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'ms -- password encrypted');
  });
  crypto.pbkdf2('password123', 'salt42', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'ms -- password encrypted');
  });
  crypto.pbkdf2('password123', 'salt42', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'ms -- password encrypted');
  });
});

console.log('Hello from the Top Level code');
