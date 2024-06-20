/*
    This file contains an experiment to better understand readable & writable streams used in Node.js
*/

const fs = require('fs');

const server = require('http').createServer();

server.on('request', (req, res) => {
  /*
    Naive solution: Load entire file at once

      fs.readFile('test-file.txt', (err, data) => {
        if (err) console.log(err);
        res.end(data);
      });
  */

  /*
    Better sol (streaming)

    const readableStream = fs.createReadStream('test-file.txt');
        readableStream.on('data', (chunk) => {
        res.write(chunk);
    });

    readableStream.on('end', () => {
        res.end();
    });

    readableStream.on('error', (err) => {
        console.log(err);
        res.statusCode(500);
        res.end('File not found!');
    });
  */
  

  /*
    The above solution creates an issue known as backpressure. Essentially the speed at which data is written across the network is not nearly as fast as
    reading the file from disk.

    The best solution helps to solve this issue utilizes a pipe to help bridge these speed differences
  */
    const readableStream = fs.createReadStream('test-file.txt');
    readableStream.pipe(res);
});

server.listen(8000, () => {
  console.log('Server listening on port 8000...');
});
