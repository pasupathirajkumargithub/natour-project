//mongoose is the library function
const mongoose = require('mongoose');

// to implete the config.env file
const dotenv = require('dotenv');

//path of the config file
dotenv.config({ path: './config.env' });

//link of the database
const DB = process.env.DATABASE;

//to connect the mongoDB atlas database
mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful! server'));

//creating server and it run it in 127.0.0.1:3000
const server = require('./App.js').listen(3000, () =>
  console.log('Server is running...!'),
);

//this function helps to authenticate the database collections
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('DATABASE CONNECTION REJECTED !');
  server.close(() => process.exit(1));
});

process.on('uncatchExceptation', (err) => {
  console.log(err.name, err.message);
  console.log('DATABASE CONNECTION REJECTED !');
  process.exit(1);
});
