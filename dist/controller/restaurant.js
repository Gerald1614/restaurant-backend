'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require('express');

var _restaurant = require('../model/restaurant');

var _restaurant2 = _interopRequireDefault(_restaurant);

var _review = require('../model/review');

var _review2 = _interopRequireDefault(_review);

var _account = require('../model/account');

var _account2 = _interopRequireDefault(_account);

var _city = require('../model/city');

var _city2 = _interopRequireDefault(_city);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _authMiddleware = require('../middleware/authMiddleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = require('../config/env.json')[process.env.NODE_ENV || 'development'];

var multipartUpload = (0, _multer2.default)({
  storage: _multer2.default.diskStorage({
    destination: function destination(req, file, callback) {
      var path = config.STATIC_DIR + '/public/images';
      callback(null, path);
    },
    filename: function filename(req, file, callback) {
      callback(null, file.originalname);
    } })
}).single('file');

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  api.post('/uploads', multipartUpload, function (req, res) {
    return res.json(req.file);
  });

  api.post('/add/:id', _authMiddleware.authenticate, function (req, res) {
    console.log(req.params);
    _city2.default.findById(req.params.id, function (err, city) {
      if (err) {
        res.status(500).send("There was a problem adding the information to the database.");
      }
      console.log(req.body);
      var newRest = new _restaurant2.default();
      newRest.name = req.body.name;
      newRest.foodType = req.body.foodType;
      if (req.body.picture === config.URL + "/public/images/undefined") {
        newRest.picture = config.URL + "/public/images/restaurant_menu.png";
      } else {
        newRest.picture = req.body.picture;
      }
      newRest.avgCost = req.body.avgCost;
      newRest.description = req.body.description;
      newRest.website = req.body.website;
      newRest.city = req.params.id;
      newRest.avgRating = null;
      newRest.geometry.coordinates = req.body.geometry.coordinates;
      newRest.save(function (err, restaurant) {
        if (err) {
          res.status(500).send("There was a problem adding the restaurant." + err);
        } else {
          city.restaurants.push(newRest);
          city.save(function (err) {
            if (err) {
              res.status(500).send("There was a problem updating city restaurant.");
            }
            console.log(newRest);
            res.status(200).send(newRest);
          });
        }
      });
    });
  });

  api.get('/', function (req, res) {
    _restaurant2.default.find({}, function (err, restaurant) {
      if (err) {
        res.status(500).send("There was a problem reading the information from the database.");
      }
      res.status(200).json(restaurant);
    });
  });

  api.get('/city/:id', function (req, res) {
    var cityResto = [];
    var counter = 0;
    _city2.default.findById(req.params.id).then(function (city) {
      if (city.restaurants.length === 0) {
        res.status(500).json(err);
      } else {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = city.restaurants[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var elem = _step.value;

            _restaurant2.default.findById(elem).then(function (restaurant) {
              cityResto.push(restaurant);
              if (counter == city.restaurants.length - 1) {
                res.status(200).json(cityResto);
              }
              counter++;
            });
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    }).catch(function (err) {
      res.status(500).json(err);
    });
  });

  api.get('/:id', function (req, res) {
    _restaurant2.default.findById(req.params.id, function (err, restaurant) {
      if (err) {
        res.status(500).send("There was a problem reading the information from the database.");
      }
      res.status(200).json(restaurant);
    });
  });

  api.put('/:id', _authMiddleware.authenticate, function (req, res) {
    _restaurant2.default.findById(req.params.id, function (err, restaurant) {
      if (err) {
        res.send(err);
      }
      restaurant.avgRating = req.body.avgRating;
      restaurant.save(function (err) {
        if (err) {
          res.send(err);
        }
        res.status(200).send(restaurant);
      });
    });
  });

  api.delete('/:id', function (req, res) {
    _restaurant2.default.findById(req.params.id, function (err, restaurant) {
      if (err) {
        res.status(500).send("There was a problem adding the information to the database.");
      }
      console.log(restaurant.reviews);
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = restaurant.reviews[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var elem = _step2.value;

          _review2.default.findByIdAndRemove(elem, function (err, review) {});
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      console.log(restaurant.city);
      _city2.default.findByIdAndRemove(restaurant.city, function (err, res) {});
    }).then(_restaurant2.default.remove({
      _id: req.params.id
    }, function (err, restaurant) {
      if (err) {
        res.send(err);
      }
      res.status(200).json({ message: "Restaurant Succesfully Removed" });
    }));
  });

  api.post('/reviews/add/:id', _authMiddleware.authenticate, function (req, res) {
    var userName;
    var assert = require('assert');
    var query = _account2.default.findById(req.user.id, function (err, account) {
      if (err) {
        res.status(500).send("There was a problem adding the information to the database.");
      } else {
        userName = account.name;
        console.log(userName);
      }
    });
    var promise = query.exec();
    assert.ok(promise instanceof Promise);
    promise.then(_restaurant2.default.findById(req.params.id, function (err, restaurant) {
      if (err) {
        res.status(500).send("There was a problem adding the information to the database.");
      } else {
        var newReview = new _review2.default();
        newReview.username = userName;
        newReview.title = req.body.title;
        newReview.text = req.body.text;
        newReview.rate = req.body.rate;
        newReview.restaurant = req.params.id;
        console.log(newReview);
        newReview.save(function (err, review) {
          if (err) {
            res.status(500).send("There was a problem adding the information to the database.");
          }
          restaurant.reviews.push(newReview);
          restaurant.save(function (err) {
            if (err) {
              res.status(500).send("There was a problem adding the information to the database.");
            }
            console.log(newReview);
            res.status(200).send(newReview);
          });
        });
      }
    }));
  });

  api.get('/reviews/:id', function (req, res) {
    _review2.default.find({ restaurant: req.params.id }, function (err, reviews) {
      if (err) {
        res.status(500).send("There was a problem reading the information from the database.");
      }
      res.status(200).json(reviews);
    });
  });

  return api;
};
//# sourceMappingURL=restaurant.js.map