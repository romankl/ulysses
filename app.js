'use strict';

const Express = require('express');
const app = Express();

const cookieParser = require('cookie-parser');
const compress = require('compression');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const logger = require('morgan');

const methodOverride = require('method-override');

const flash = require('express-flash');
const validator = require('express-validator');
const PassportConfig = require('./src/auth/local_passporthandler');
const Passport = require('passport');

const path = require('path');

const config = require('./config/AppConfig');
const env = require('./src/util/env');


// prepare the db connection
require('./src/model/db_connector').connectToDb();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// middleware
app.use(logger('dev'));
// app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(validator());
app.use(methodOverride());
app.use(cookieParser());
app.use(flash());

app.use(Express.static(path.join(__dirname, 'public'), {maxAge: 31557600000}));

require('./src/routes/bootstrap')(app);

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', config.app.connection.port);

const server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});

module.exports = server;
