var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
//var processRouter = require('./routes/process');
var scheduleRouter = require('./routes/schedule');
var usersRouter = require('./routes/users');
//------------------------------------------------------------
// 增加引用模組
//------------------------------------------------------------
var product_add_form = require('./routes/product_add_form');
var addform = require('./routes/addform');
var collection_add = require('./routes/collection_add');
var schedule_query = require('./routes/schedule_query');
var collection = require('./routes/collection');
var collection_add = require('./routes/collection_add');
var select = require('./routes/select');
//------------------------------------------------------------
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
//app.use('/process', processRouter);
app.use('/schedule', scheduleRouter);
app.use('/collection', collection);
app.use('/collection/add', collection_add);
app.use('/select', select);
//-----------------------------------------
// 設定模組使用方式
//-----------------------------------------
app.use('/product/add/form', product_add_form);
app.use('/addform', addform);
app.use('/schedule/query', schedule_query);

//app.use('/schedule/detail', schedule_detail);
//-----------------------------------------
// 設定模組使用方式
//-----------------------------------------
//app.use('/product/list', product_list);
//-----------------------------------------


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
