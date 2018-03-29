import express from 'express';
import config from '../config';
import middleware from '../middleware';
import initializeDb from '../db';
import restaurant from '../controller/restaurant';
import city from'../controller/city';
import account from '../controller/account';

let router = express();

initializeDb(db => {

  router.use(middleware({config, db}));

  router.use('/restaurant', restaurant({ config, db }));
  router.use('/account', account({ config, db }));
  router.use('/city', city({ config, db }));

});

export default router; 