const mongoose = require('mongoose');

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
    console.log('DB connection successful');
  });

// Express app logic
const app = require('./app');

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
