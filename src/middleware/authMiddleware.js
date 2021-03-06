import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';

const TOKENTIME = 60*60*24*30; //30 days
const SECRET = "w3 Havf rereg ergerg 34t34t";

let authenticate = expressJwt({ secret: SECRET});

let generateAccessToken = (req, res, next) => {
  req.token = req.token || {};
  req.token = jwt.sign({
    id: req.user.id,
    }, SECRET, { 
      expiresIn: TOKENTIME
    });
    next()
}

let respond = (req, res) => {
  console.log(req.user)
  res.status(200).json({
    user: req.user.username,
    id: req.user._id,
    name:req.user.name,
    token: req.token
  });
}

module.exports = {
  authenticate,
  generateAccessToken,
  respond
}


