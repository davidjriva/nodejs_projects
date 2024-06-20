/*
    This file contains an experiment to better understand the event emitter and listener (observer pattern) used in Node.js
*/

const EventEmitter = require('events');
const http = require('http');

class SalesEmitter extends EventEmitter {
  constructor() {
    super();
  }
}

const myEmitter = new SalesEmitter();

myEmitter.on('newSale', () => console.log('There was a new sale!'));
myEmitter.on('newSale', () => console.log('Customer Name: David R.'));
myEmitter.on('newSale', (stock) => console.log(`There are now ${stock} items left`));

myEmitter.emit('newSale', 9);

////////////////////

const server = http.createServer();
server.on('request', (req, res) => {
  console.log('Request received');
  res.end('Request received');
});

server.on('request', (req, res) => {
  console.log('Another request received');
});

server.on('close', () => {
  console.log('Server closed');
});

server.listen(8000, '127.0.0.1', () => {
    console.log("Starting server on port 8000...");
});
