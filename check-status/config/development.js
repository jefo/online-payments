'use strict';

const {
	POSTGRES_HOST: host,
	POSTGRES_USER: user,
	POSTGRES_PASSWORD: password,
	POSTGRES_DB: database
} = process.env;

module.exports = {
	db: {
		database,
		user,
		password,
		host,
		logging: false
	}
};
