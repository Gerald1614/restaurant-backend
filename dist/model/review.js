'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _restaurant = require('./restaurant');

var _restaurant2 = _interopRequireDefault(_restaurant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var ReviewSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  text: String,
  rate: Number,
  username: String,
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  }
});

module.exports = _mongoose2.default.model('Review', ReviewSchema);
//# sourceMappingURL=review.js.map