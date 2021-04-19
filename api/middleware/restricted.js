const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../secrets');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] === undefined ? req.headers.authorization : req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({message: 'token required'});
  } else {
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.status(401).json({message: 'token invalid' });
      } else {
        req.decodedToken = decodedToken;
        next();
      }
    });
  }
};
