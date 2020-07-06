'use strict';

const knex = require('knex');
const { db: dbConfig } = require('config');

const knexConfig = {
	client: dbConfig.dialect,
	debug: dbConfig.logging,
	connection: {
		host: dbConfig.host,
		user: dbConfig.user,
		password: dbConfig.password,
		database: dbConfig.database,
		port: dbConfig.port
	}
};

let _knex;

/**
 * Get knex instance
 * @return {*} DB knex instance
 */
function getKnexInstance() {
	if (!_knex) {
		_knex = knex(knexConfig);
	}

	return _knex;
}

module.exports = {
	getKnexInstance
};
