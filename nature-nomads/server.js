const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION. Shutting down...');
  console.error(`Name: ${err.name}`);

  if (process.env.NODE_ENV == 'development') {
    console.error(`Message: ${err.message}`);
    console.error(`Stack: ${err.stack}`);
  }

  console.error(`Timestamp: ${new Date().toISOString()}`);

  process.exit(1);
});

// Reading in environment variables
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

// Connection with MongoDB via Mongoose driver
const DBConnectionStr = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose
  .connect(DBConnectionStr, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('DB connection successful');
    }
  });

// Express app logic
const app = require('./app');

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`App running on port ${port}...`);
  }
});

process.on('unhandledRejection', (err) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('UNHANDLED REJECTION. Shutting down...');
    console.log(err.name, err.message);
  }

  server.close(() => {
    process.exit(1);
  });
});
