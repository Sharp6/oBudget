var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/*
var routes = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');
*/

var mongoose = require('mongoose');
if(process.env.NODE_ENV === "test") {
    mongoose.connect('mongodb://test:test@ds015636.mlab.com:15636/obudgettest');
    //mongoose.connect('mongodb://localhost/obudgetTest');
}
if(process.env.NODE_ENV === "dev") {
    //mongoose.connect('mongodb://localhost/obudgetDev');
    mongoose.connect('mongodb://test:test@ds015636.mlab.com:15636/obudgettest');
}

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'hjs');
var exphbs = require('express-handlebars');
app.engine('.hbs', exphbs({
  defaultLayout: 'single',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers: {
    ifIn: function(elem, list, options) {
      if(list.indexOf(elem) > -1) {
        return options.fn(this);
      }
      return options.inverse(this);
    }
  }
}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//require('./verrichtingen').routes(app);
app.use(require('./verrichtingen/verrichting.routes.server'));
app.use(require('./banken/bank.routes.server'));
app.use(require('./categorieen/categorie.routes.server'));
app.use(require('./saldi/saldo.routes.server'));

/*
app.use('/', routes);
app.use('/users', users);
app.use('/api', api);
*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
