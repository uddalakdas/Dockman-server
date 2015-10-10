var express     = require("express");
var bodyParser  = require("body-parser");
var logger      = require('morgan');
var cookieParser = require('cookie-parser');
var app         = express();
var debug       = require('debug')('app');
var path        = require('path');
var mongoose = require('mongoose');
var configDB = require('./db/db.js');

mongoose.connect(configDB.url); // connect to our database

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,x-access-token');
    next();
});
var router = require('./routers/router')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'dev') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});

process.on('uncaughtException', function(err) {
    console.log(err);
    //debug(err);
});

module.exports = app;
//debug('app loaded..');