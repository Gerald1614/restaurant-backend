import mongoose from 'mongoose';
import { Router } from 'express';
import Restaurant from '../model/restaurant';
import Review from '../model/review'
import Account from '../model/account'

import { authenticate } from '../middleware/authMiddleware';

export default({ config, db }) => {
  let api = Router();

  // '/v1/restaurant/add'
api.post('/add', authenticate, (req, res) => {
  let newRest = new Restaurant();
  newRest.name = req.body.name;
  newRest.foodType = req.body.foodType;
  newRest.picture = req.body.picture;
  newRest.avgCost = req.body.avgCost;
  newRest.description = req.body.description;
  newRest.website = req.body.website;
  newRest.avgRating = null;
  newRest.geometry.coordinates = req.body.geometry.coordinates;
  newRest.save(err => {
    if (err) {
      res.status(500).send("There was a problem adding the information to the database.");
    }
    res.status(200).send(newRest);
  });
});

api.get('/', (req, res) => {
  Restaurant.find({}, (err, restaurant) => {
    if (err) {
      res.status(500).send("There was a problem reading the information from the database.");
    }
    res.status(200).json(restaurant);
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
  restaurant.reviews.forEach( elem => {
    Review.findByIdAndRemove(elem, (err, review) => {
      console.log(elem)
    });
  })
}).then(
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
  let userName;
  Account.findById(req.user.id, (err, account) => {
    if (err) {
      res.status(500).send("There was a problem adding the information to the database.");
    }
    userName = account.name
    console.log(userName)
  }).then (
    Restaurant.findById(req.params.id, (err, restaurant) => {
      if (err) {
        res.status(500).send("There was a problem adding the information to the database.");
      }
      let newReview = new Review();
      newReview.username = userName;
      newReview.title = req.body.title;
      newReview.text = req.body.text;
      newReview.rate = req.body.rate;
      newReview.restaurant = req.params.id;
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
        });
      });
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