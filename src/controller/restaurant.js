import mongoose from 'mongoose';
import { Router } from 'express';
import Restaurant from '../model/restaurant';

export default({ config, db }) => {
  let api = Router();

  // '/v1/restaurant/add'
api.post('/add', (req, res) => {
  let newRest = new Restaurant();
  newRest.name = req.body.name;

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

return api;
}