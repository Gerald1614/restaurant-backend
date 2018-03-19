import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import passportLocalMongoose from 'passport-local-mongoose';

let Account = new Schema({
  email: String,
  password: String,
  name: String
});

Account.plugin(passportLocalMongoose);
module.exports = mongoose.model('Account', Account);