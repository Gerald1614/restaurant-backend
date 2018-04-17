import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import helmet from 'helmet';
const LocalStrategy = require('passport-local').Strategy;

import config from './config';
import routes from './routes';


let app = express();
app.server = http.createServer(app);
app.use('/uploads', express.static(__dirname + '/public/uploads')); // for serving the HTML file
app.use(helmet());
//middleware
app.use(bodyParser.json({
  limit: config.bodyLimit
}));


app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'https://restaurant-review-app-c6c0b.firebaseapp.com');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Access-Control-Allow-Headers, Authorization, content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

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

app.use('/V1', routes);

//app.server.listen(config.port);
app.server.listen(5555);
//console.log(`Started on port ${app.server.address().port}`);

export default app;