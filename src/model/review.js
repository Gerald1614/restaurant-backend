import mongoose from 'mongoose';
import Restaurant from './restaurant';
let Schema = mongoose.Schema;

let ReviewSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  text: String,
  rate: Number,
  username: String,
  restaurant: {
    type: Schema.Types.ObjectId,
    ref:'Restaurant',
    required: true
  }
});

module.exports = mongoose.model('Review', ReviewSchema);