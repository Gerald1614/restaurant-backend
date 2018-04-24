'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _review = require('./review');

var _review2 = _interopRequireDefault(_review);

var _city = require('./city');

var _city2 = _interopRequireDefault(_city);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var RestaurantSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  foodType: {
    type: String,
    requried: true
  },
  description: {
    type: String
  },
  website: {
    type: String
  },
  avgCost: Number,
  avgRating: Number,
  picture: String,
  geometry: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  city: {
    type: Schema.Types.ObjectId,
    ref: 'City',
    required: true
  }
});

module.exports = _mongoose2.default.model('Restaurant', RestaurantSchema);
//# sourceMappingURL=restaurant.js.map