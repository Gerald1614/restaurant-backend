'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LocalStrategy = require('passport-local').Strategy;


var config = require('./config/env.json')[process.env.NODE_ENV || 'development'];


var app = (0, _express2.default)();
app.server = _http2.default.createServer(app);
if (process.env.NODE_ENV === "development") {
  app.use('/public/images', _express2.default.static(__dirname + '/public/images'));
  console.log(__dirname);
}

app.use((0, _helmet2.default)());
//middleware
app.use(_bodyParser2.default.json({
  limit: config.bodyLimit
}));

app.use((0, _cors2.default)());
// app.use(function (req, res, next) {

//   res.setHeader('Access-Control-Allow-Origin', config.client_URL);

//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Access-Control-Allow-Headers, Authorization, content-type');

//   res.setHeader('Access-Control-Allow-Credentials', true);

//   next();
// });

app.use(_passport2.default.initialize());
var Account = require('./model/account');
_passport2.default.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, Account.authenticate()));
_passport2.default.serializeUser(Account.serializeUser());
_passport2.default.deserializeUser(Account.deserializeUser());

if (process.env.NODE_ENV === "development") {
  app.use('/V1', _routes2.default);
} else {
  app.use('/api/V1', _routes2.default);
}

app.server.listen(config.port);
console.log('Started on port ' + app.server.address().port);

exports.default = app;
//# sourceMappingURL=index.js.map