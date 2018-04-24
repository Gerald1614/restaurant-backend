import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import helmet from 'helmet';
const LocalStrategy = require('passport-local').Strategy;
import cors from 'cors';

var config = require('./config/env.json')[process.env.NODE_ENV || 'development'];
import routes from './routes';


let app = express();
app.server = http.createServer(app);
if (process.env.NODE_ENV === "development") {
  app.use('/public/images', express.static(__dirname + '/public/images')); 
  console.log(__dirname)
}

app.use(helmet());
//middleware
app.use(bodyParser.json({
  limit: config.bodyLimit
}));

app.use(cors({
  origin: config.client_URL,
  credentials: true
}));
// app.use(function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', config.client_URL);
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Access-Control-Allow-Headers, Authorization, content-type');
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   next();
// });

app.use(passport.initialize());
let Account = require('./model/account');
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  Account.authenticate()
));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

if (process.env.NODE_ENV === "development") {
  app.use('/V1', routes);
} else {
  app.use('/api/V1', routes);
}

app.server.listen(config.port);
console.log(`Started on port ${app.server.address().port}`);

export default app;