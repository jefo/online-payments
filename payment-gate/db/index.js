'use strict';

const knex = require('./db').getKnexInstance();
const {
	CUSTOMERS_TABLE,
	SETTINGS_TABLE,
	PAYMENTS_TABLE,
	BALANCES_TABLE
} = require('./model-constants');

const customers = () => {
	return knex(CUSTOMERS_TABLE);
};

const settings = () => {
	return knex(SETTINGS_TABLE);
};

const payments = () => {
	return knex(PAYMENTS_TABLE);
};

const balances = () => {
	return knex(BALANCES_TABLE);
};

module.exports = {
	customers,
	settings,
	payments,
	balances,
	instance: knex,
	raw: knex.raw
};
