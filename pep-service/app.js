var createError = require('http-errors');
var express = require('express');
var cors = require('cors')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var booksRounter = require('./routes/books');
const { Client } = require('@elastic/elasticsearch')

// read password from env
const fs = require('fs')
const certificatePath = path.resolve(process.cwd(), 'certs/http_ca.crt');

// create client
elsPwd = process.env.ELASTIC_PASSWORD
const elsClient = new Client({
  node: 'https://localhost:9200',
  // set path of http_ca.crt
  tls: {
    ca: fs.readFileSync(certificatePath)
  },
  // set username password
  auth: {
    username: 'elastic',
    password: elsPwd
  }
})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('elsClient', elsClient)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// enable cors
app.use(cors());

// app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/books', booksRounter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
