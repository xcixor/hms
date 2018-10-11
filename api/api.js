const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const morgan = require('morgan');

const config = require('config');

const api = express();

// connect to mongodb
mongoose.connect(config.DBHost);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

//don't show the log when it is test
if (config.util.getEnv('NODE_ENV') !== 'test') {
    //use morgan to log at command line
    api.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

mongoose.Promise = global.Promise;

api.use(bodyParser.json());

// initialize routes
api.use('/api', require('./routes/router'));

// listen for requests
api.listen(config.Port, () => {
    console.log('Environment ' + process.env);
    console.log('Listening for requests on port ' + config.Port + '.....');
});

// for testing
module.exports = api;