import mongoose from 'mongoose';
import Restaurant from './restaurant';

let Schema = mongoose.Schema;

let CitySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  restaurants:[{type: Schema.Types.ObjectId, ref: 'Restaurant'}]
});

module.exports = mongoose.model('City', CitySchema);