'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _restaurant = require('./restaurant');

var _restaurant2 = _interopRequireDefault(_restaurant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var CitySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  restaurants: [{ type: Schema.Types.ObjectId, ref: 'Restaurant' }]
});

module.exports = _mongoose2.default.model('City', CitySchema);
//# sourceMappingURL=city.js.map