var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var models = require('./model/models');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view cache', false);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.all('*', function(req, res, next){
  if( req.headers.origin == 'http://localhost:8085' || req.headers.origin == 'http://localhost:8082' || req.headers.origin == 'http://localhost:80'  ) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
  }
  next();
});
var common = require('./routes/common');
app.use('/', common.router);
var userRouter = require('./routes/user');
app.use('/user', userRouter);
// var skillRouter = require('./routes/skill');
// app.use('/skill', skillRouter);
// var learnHistoryRouter = require('./routes/learnHistory');
// app.use('/learnHistory', learnHistoryRouter);
var dictionaryRouter = require('./routes/dictionary');
app.use('/dictionary', dictionaryRouter);

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
    console.log('error');
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// app.get('/login1',routes.login);
var server = http.createServer(app);
server.listen(app.get('port'),function(){
});

module.exports = app;
