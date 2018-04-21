import mongoose from 'mongoose';
var config = require('./config/env.json')[process.env.NODE_ENV || 'development'];

export default callback => {
  let db = mongoose.connect(config.mongoUrl);
  callback(db);
}