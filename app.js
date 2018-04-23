var express = require('express');
var path = require('path');
var _ = require('lodash');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var ejs = require('ejs');
var expressLayouts = require('express-ejs-layouts');
var Loader = require('loader');
var LoaderConnect = require('loader-connect')
var app = express();
app.enable('trust proxy');

var config = require('./config');

var assets = {};

if (config.mini_assets) {
    try {
        assets = require('./assets.json');
    } catch (e) {
        console.warn('You must execute `npm run build` before start app when mini_assets is true.');
        throw e;
    }
}
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressLayouts);

// 静态资源
if (config.debug) {
    app.use(LoaderConnect.less(__dirname)); // 测试环境用，编译 .less on the fly
}
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

_.extend(app.locals, {
    config: config,
    Loader: Loader,
    assets:assets
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
