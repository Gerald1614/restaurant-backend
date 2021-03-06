import mongoose from 'mongoose';
import { Router } from 'express';
import Account from '../model/account';
import bodyParser from 'body-parser';
import passport from 'passport';
var config = require('../config/env.json')[process.env.NODE_ENV || 'development'];

import { generateAccessToken, respond, authenticate } from '../middleware/authMiddleware';

export default ({ config, db}) => {
  let api = Router();

api.post('/register', (req, res) => {
  Account.register(new Account({ username: req.body.email, name: req.body.name}), req.body.password, function(err, account) {
    if (err) {
      res.send(err);
    }
    passport.authenticate(
      'local', {
        session: false
      })(req, res, () => {
        res.status(200).send('Succesfully create new Account');
      });
  });
});

api.post('/login', passport.authenticate(
  'local', {
    session: false,
    scope: []
  }), generateAccessToken, respond)


api.get('/logout', authenticate, (req, res) => {
  res.logout();
  res.status(200).send('Succesfully logged Out');
});

api.get('/me', authenticate, (req, res) => {
  res.status(200).json(req.user);
});

  return api
}