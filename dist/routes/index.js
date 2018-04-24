'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _middleware = require('../middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _db = require('../db');

var _db2 = _interopRequireDefault(_db);

var _restaurant = require('../controller/restaurant');

var _restaurant2 = _interopRequireDefault(_restaurant);

var _city = require('../controller/city');

var _city2 = _interopRequireDefault(_city);

var _account = require('../controller/account');

var _account2 = _interopRequireDefault(_account);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = require('../config/env.json')[process.env.NODE_ENV || 'development'];


var router = (0, _express2.default)();

(0, _db2.default)(function (db) {

  router.use((0, _middleware2.default)({ config: config, db: db }));

  router.use('/restaurant', (0, _restaurant2.default)({ config: config, db: db }));
  router.use('/account', (0, _account2.default)({ config: config, db: db }));
  router.use('/city', (0, _city2.default)({ config: config, db: db }));
});

exports.default = router;
//# sourceMappingURL=index.js.map