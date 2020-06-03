const fs = require('fs');

const getDatabase = function() {
	const db = require('./db.json');
	return db;	
}

const getUser = function(email) {
	const db = getDatabase();
	return db[email];
}

const addUser = function(email, userInfo) {
	const db = getDatabase();
	db[email] = userInfo;

	fs.writeFileSync('./db.json', JSON.stringify(db));
}

module.exports = {
	getUser,
	addUser,
}