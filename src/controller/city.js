import mongoose from 'mongoose';
import { Router } from 'express';
import Restaurant from '../model/restaurant';
import City from '../model/city';
import Account from '../model/account';


import { authenticate } from '../middleware/authMiddleware';

export default({ config, db }) => {
  let api = Router();


api.post('/add', authenticate, (req, res) => {
  console.log(req.body)
  let newCity = new City();
  newCity.name = req.body.name;
  newCity.save(err => {
    if (err) {
      res.status(500).send("There was a problem adding the information to the database.");
    }
    res.status(200).send(newCity);
  });
});
api.get('/', (req, res) => {
  City.find({}, (err, city) => {
    if (err) {
      res.status(500).send("There was a problem reading the information from the database.");
    }
    res.status(200).json(city);
  })
})

api.get('/:id', (req, res) => {
  City.findById(req.params.id, (err, city) => {
    if(err) {
      res.status(500).send("There was a problem reading the information from the database.");
    }
    res.status(200).json(city);
  });
});

api.put('/:id', authenticate, (req, res) => {
  City.findById(req.params.id, (err, city) => {
    if (err) {
      res.send(err);
    }
    city.name = req.body.name;
    city.save(err => {
      if (err) {
      res.send(err);
    }
    res.status(200).send(city)
    });
  });
});

api.delete('/:id', (req, res) => {
  City.findById(req.params.id, (err, city) => {
    if (err) {
      res.status(500).send("There was a problem adding the information to the database.");
    }
    console.log(city.restaurants)
  city.restaurants.forEach( elem => {
    Restaurant.findByIdAndRemove(elem, (err, restaurant) => {
      console.log(elem)
    });
  })
  }).then(
    City.remove({
      _id: req.params.id
    }, (err, city) => {
      if (err) {
        res.send(err);
      }
      res.status(200).json({ message: "City Succesfully Removed"})
    })
  )
  });
return api;
}