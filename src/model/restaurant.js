import mongoose from 'mongoose';
import Review from './review';

let Schema = mongoose.Schema;

let RestaurantSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  foodType: {
    type: String,
    requried: true
  },
  description: {
    type: String,
  },
  website: {
    type: String,
  },
  avgCost: Number,
  avgRating: Number,
  picture: String,
  geometry:{ 
    type: { type: String, default: 'Point'},
    coordinates: [Number]
  },
  reviews:[{type: Schema.Types.ObjectId, ref: 'Review'}]
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);