'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require('express');

var _restaurant = require('../model/restaurant');

var _restaurant2 = _interopRequireDefault(_restaurant);

var _city = require('../model/city');

var _city2 = _interopRequireDefault(_city);

var _account = require('../model/account');

var _account2 = _interopRequireDefault(_account);

var _authMiddleware = require('../middleware/authMiddleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = require('../config/env.json')[process.env.NODE_ENV || 'development'];

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  api.post('/add', _authMiddleware.authenticate, function (req, res) {
    console.log(req.body);
    var newCity = new _city2.default();
    newCity.name = req.body.name;
    newCity.save(function (err) {
      if (err) {
        res.status(500).send("There was a problem adding the information to the database.");
      }
      res.status(200).send(newCity);
    });
  });
  api.get('/', function (req, res) {
    _city2.default.find({}, function (err, city) {
      if (err) {
        res.status(500).send("There was a problem reading the information from the database.");
      }
      res.status(200).json(city);
    });
  });

  api.get('/:id', function (req, res) {
    _city2.default.findById(req.params.id, function (err, city) {
      if (err) {
        res.status(500).send("There was a problem reading the information from the database.");
      }
      res.status(200).json(city);
    });
  });

  api.put('/:id', _authMiddleware.authenticate, function (req, res) {
    _city2.default.findById(req.params.id, function (err, city) {
      if (err) {
        res.send(err);
      }
      city.name = req.body.name;
      city.save(function (err) {
        if (err) {
          res.send(err);
        }
        res.status(200).send(city);
      });
    });
  });

  api.delete('/:id', function (req, res) {
    _city2.default.findById(req.params.id, function (err, city) {
      if (err) {
        res.status(500).send("There was a problem adding the information to the database.");
      }
      console.log(city.restaurants);
      city.restaurants.forEach(function (elem) {
        _restaurant2.default.findByIdAndRemove(elem, function (err, restaurant) {
          console.log(elem);
        });
      });
    }).then(_city2.default.remove({
      _id: req.params.id
    }, function (err, city) {
      if (err) {
        res.send(err);
      }
      res.status(200).json({ message: "City Succesfully Removed" });
    }));
  });
  return api;
};
//# sourceMappingURL=city.js.map