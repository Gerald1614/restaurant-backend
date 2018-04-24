'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require('express');

var _account = require('../model/account');

var _account2 = _interopRequireDefault(_account);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _authMiddleware = require('../middleware/authMiddleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = require('../config/env.json')[process.env.NODE_ENV || 'development'];

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  api.post('/register', function (req, res) {
    _account2.default.register(new _account2.default({ username: req.body.email, name: req.body.name }), req.body.password, function (err, account) {
      if (err) {
        res.send(err);
      }
      _passport2.default.authenticate('local', {
        session: false
      })(req, res, function () {
        res.status(200).send('Succesfully create new Account');
      });
    });
  });

  api.post('/login', _passport2.default.authenticate('local', {
    session: false,
    scope: []
  }), _authMiddleware.generateAccessToken, _authMiddleware.respond);

  api.get('/logout', _authMiddleware.authenticate, function (req, res) {
    res.logout();
    res.status(200).send('Succesfully logged Out');
  });

  api.get('/me', _authMiddleware.authenticate, function (req, res) {
    res.status(200).json(req.user);
  });

  return api;
};
//# sourceMappingURL=account.js.map