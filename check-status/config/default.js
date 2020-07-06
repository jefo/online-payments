'use strict';

const {
	POSTGRES_HOST: host,
	POSTGRES_USER: user,
	POSTGRES_PASSWORD: password,
	POSTGRES_DB: database
} = process.env;

module.exports = {
	http: {
		port: 8080,
	},
	compression: {
		threshold: 1024,
	},
	swaggerPath: './swagger/swagger.yaml',
	db: {
		dialect: 'pg',
		database,
		user,
		password,
		host,
		logging: false
	}
};
