const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = require('../secrets');
const Users = require('./users-model.js');
const {
	checkCredentialsProvided,
	checkUsernameUnique,
} = require('./auth-middleware.js');

router.post(
	'/register',
	checkCredentialsProvided,
	checkUsernameUnique,
	async (req, res) => {
		const newUser = req.body;

		const hash = bcrypt.hashSync(newUser.password, 8);
		newUser.password = hash;

		Users.add(newUser).then(createdUser => {
			const token = generateToken(createdUser);
			res.status(201).json({ ...createdUser, token });
		});
	}
);

router.post('/login', checkCredentialsProvided, (req, res, next) => {
	const { username, password } = req.body;

	Users.getBy({username})
		.then(foundUser => {
			if (foundUser && bcrypt.compareSync(password, foundUser.password)) {
				const token = generateToken(foundUser);
				res.status(200).json({
					message: `welcome, ${foundUser.username}`,
					token,
				});
			} else {
				res.status(401).json({ message: 'invalid credentials' });
			}
		})
		.catch(next);
});

const generateToken = user => {
	const options = {
		expiresIn: '1 day',
	};

	const payload = {
		subject: user.id,
		username: user.username,
	};

	return jwt.sign(payload, JWT_SECRET, options);
};

module.exports = router;
