const Users = require('./users-model.js');

const checkCredentialsProvided = (req, res, next) => {
  const newUser = req.body;

  if (!newUser.username || !newUser.password) {
    res.status(422).json('username and password required');
  } else {
    next();
  }
}

const checkUsernameUnique = (req, res, next) => {
  const { username } = req.body;

  Users.getBy({username})
    .then((user) => {
      if (user) {
        res.status(422).json({ message: 'username taken'})
      } else {
        next();
      }
    })
}

module.exports = {
	checkCredentialsProvided,
  checkUsernameUnique
}