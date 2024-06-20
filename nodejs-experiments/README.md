This directory contains several JavaScript files that play around with key features of Node.js that make it so powerful.

event-loop.js: Contains experiments demonstrating the order of the event loop and the importance of performing non-blocking (asynchronous) calls when possible.

events.js: Contains experiments demonstrating how Node.js' event-driven architecture works and how you can create custom events, emitters, and listeners.

streams.js: Contains experiments demonstrating the importance of streaming large amounts of data, and how piping can help to mitigate back pressure.

modules.js: Contains experiments demonstrating how 'require()' works internally in Node.js, and how different ways of exporting can be useful in specific scenarios.