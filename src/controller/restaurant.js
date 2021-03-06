import mongoose from 'mongoose';
import { Router } from 'express';
import Restaurant from '../model/restaurant';
import Review from '../model/review';
import Account from '../model/account';
import City from '../model/city'
import multer from 'multer';
var config = require('../config/env.json')[process.env.NODE_ENV || 'development'];

var multipartUpload = multer({
  storage: multer.diskStorage({
  destination: function (req, file, callback) { 
    let path = config.STATIC_DIR + '/public/images';
    callback(null, path);
  },
  filename: function (req, file, callback) { 
    callback(null, file.originalname);}})
}).single('file');

import { authenticate } from '../middleware/authMiddleware';

export default({ config, db }) => {
  let api = Router();

api.post('/uploads', multipartUpload, (req, res) => {
    return res.json(req.file);
});

api.post('/add/:id', authenticate, (req, res) => {
  console.log(req.params)
  if (req.params.id !== undefined) {

 
  City.findById(req.params.id, (err, city) => {
    if (err) {
      res.status(500).send("There was a problem adding the information to the database.");
    }
    console.log(req.body)
  let newRest = new Restaurant();
  newRest.name = req.body.name;
  newRest.foodType = req.body.foodType;
  if (req.body.picture=== config.URL + "/public/images/undefined") {
    newRest.picture= config.URL + "/public/images/restaurant_menu.png";
  } else {
    newRest.picture = req.body.picture;
  }
  newRest.avgCost = req.body.avgCost;
  newRest.description = req.body.description;
  newRest.website = req.body.website;
  newRest.city = req.params.id;
  newRest.avgRating = null;
  newRest.geometry.coordinates = req.body.geometry.coordinates;
  newRest.save((err, restaurant) => {
    if (err) {
      res.status(500).send("There was a problem adding the restaurant." + err);
    } else {
      city.restaurants.push(newRest);
      city.save(err => {
        if(err) {
          res.status(500).send("There was a problem updating city restaurant.");
        }
        console.log(newRest)
        res.status(200).send(newRest);
      });
    }

  });
});
  }
});

api.get('/', (req, res) => {
  Restaurant.find({}, (err, restaurant) => {
    if (err) {
      res.status(500).send("There was a problem reading the information from the database.");
    }
    res.status(200).json(restaurant);
  })
})

api.get('/city/:id', (req, res) => {
  var cityResto = [];
  var counter=0;
   City.findById(req.params.id)
   .then((city) => {
     if (city.restaurants.length === 0) {
      res.status(500).json(err)
     } else {
      for (let elem of city.restaurants) {
        Restaurant.findById(elem).then((restaurant) => {
           cityResto.push(restaurant);
           if(counter ==city.restaurants.length-1) {
            res.status(200).json(cityResto);
           }
           counter++;
         })
       }
     }

    })
    .catch((err) => {
      res.status(500).json(err)
    })
  })

api.get('/:id', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if(err) {
      res.status(500).send("There was a problem reading the information from the database.");
    }
    res.status(200).json(restaurant);
  });
});

api.put('/:id', authenticate, (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) {
      res.send(err);
    }
    restaurant.avgRating = req.body.avgRating;
    restaurant.save(err => {
      if (err) {
      res.send(err);
    }
    res.status(200).send(restaurant)
    });
  });
});

api.delete('/:id', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) {
      res.status(500).send("There was a problem adding the information to the database.");
    }
    console.log(restaurant.reviews)
  for (let elem of restaurant.reviews) {
    Review.findByIdAndRemove(elem, (err, review) => {
    });
  }
  console.log(restaurant.city)
  City.findByIdAndRemove(restaurant.city, (err, res) => {})
})
.then(
  Restaurant.remove({
    _id: req.params.id
  }, (err, restaurant) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json({ message: "Restaurant Succesfully Removed"})
  })
)

});

api.post('/reviews/add/:id', authenticate, (req, res) => {
  var userName;
  var assert = require('assert')
  var query = Account.findById(req.user.id, (err, account) => {
    if (err) {
      res.status(500).send("There was a problem adding the information to the database.");
    } else {
      userName = account.name
      console.log(userName)
    }
  })
  var promise = query.exec();
  assert.ok(promise instanceof Promise);
  promise.then (
    Restaurant.findById(req.params.id, (err, restaurant) => {
      if (err) {
        res.status(500).send("There was a problem adding the information to the database.");
      } else {
        let newReview = new Review();
        newReview.username = userName;
        newReview.title = req.body.title;
        newReview.text = req.body.text;
        newReview.rate = req.body.rate;
        newReview.restaurant = req.params.id;
        console.log(newReview)
        newReview.save((err, review) => {
          if (err) {
            res.status(500).send("There was a problem adding the information to the database.");
          }
          restaurant.reviews.push(newReview);
          restaurant.save(err => {
            if(err) {
              res.status(500).send("There was a problem adding the information to the database.");
            }
            console.log(newReview)
            res.status(200).send(newReview);
          })
        })
      }

    })
  )

});

api.get('/reviews/:id', (req, res) => {
  Review.find({restaurant: req.params.id}, (err, reviews) => {
    if (err) {
      res.status(500).send("There was a problem reading the information from the database.");
    }
    res.status(200).json(reviews)
  });
});

return api;
}