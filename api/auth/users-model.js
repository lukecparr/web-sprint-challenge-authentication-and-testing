const db = require('../../data/dbConfig.js');

const getBy = (filter) => {
	return db('users')
		.where(filter).first();
}

const add = (newUser) => {
	return db('users')
		.insert(newUser)
		.then(id => {
			return db('users')
				.where({ id })
				.select('*')
				.first();
		});
}

module.exports = {
	getBy,
	add
};