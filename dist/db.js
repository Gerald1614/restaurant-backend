'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = require('./config/env.json')[process.env.NODE_ENV || 'development'];

exports.default = function (callback) {
  var db = _mongoose2.default.connect(config.mongoUrl);
  callback(db);
};
//# sourceMappingURL=db.js.map