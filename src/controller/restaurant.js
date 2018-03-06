import mongoose from 'mongoose';
import { Router } from 'express';
import Restaurant from '../model/restaurant';
import Review from '../model/review'

import { authenticate } from '../middleware/authMiddleware';

export default({ config, db }) => {
  let api = Router();

  // '/v1/restaurant/add'
api.post('/add', authenticate, (req, res) => {
  let newRest = new Restaurant();
  newRest.name = req.body.name;
  newRest.foodType = req.body.foodType;
  newRest.avgCost = req.body.avgCost,
  newRest.geometry.coordinates = req.body.geometry.coordinates;
  newRest.save(err => {
    if (err) {
      res.send(err);
    }
    res.json({message: 'Restaurant saved succesfully'});
  });
});

//read '/vi/restaurant'
api.get('/', (req, res) => {
  Restaurant.find({}, (err, restaurant) => {
    if (err) {
      res.send(err);
    }
    res.json(restaurant);
  })
})

api.get('/:id', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if(err) {
      res.send(err)
    }
    res.json(restaurant);
  });
});

api.put('/:id', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) {
      res.send(err);
    }
    restaurant.name = req.body.name;
    restaurant.save(err => {
      if (err) {
      res.send(err);
    }
    res.json({ message: "Restaurant Info Updated" })
    });
  });
});

api.delete('/:id', (req, res) => {
  Restaurant.remove({
    _id: req.params.id
  }, (err, restaurant) => {
    if (err) {
      res.send(err);
    }
    res.json({ message: "Restaurant Succesfully Removed"})
  });
});

api.post('/reviews/add/:id', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) {
      res.send(err);
    }
    let newReview = new Review();

    newReview.title = req.body.title;
    newReview.text = req.body.text;
    newReview.restaurant = restaurant._id
    newReview.save((err, review) => {
      if (err) {
        res.send(err);
      }
      restaurant.reviews.push(newReview);
      restaurant.save(err => {
        if(err) {
          res.send(err);
        }
        res.json({ message: 'Food truck review saved'})
      });
    });
  });
});

api.get('/reviews/:id', (req, res) => {
  Review.find({restaurant: req.params.id}, (err, reviews) => {
    if (err) {
      res.send(err);
    }
    res.json(reviews)
  });
});

return api;
}