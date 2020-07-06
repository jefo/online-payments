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
	},
	checkStatusService: {
		apiUrl: 'http://check-status:8080/api/v1'
	}
};
