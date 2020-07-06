'use strict';

const {
	customers, settings, payments, balances
} = require('../db');

exports.clear = async () => {
	await exports.balances().del();
	await exports.payments().del();
	await exports.customers().del();
	await exports.settings().del();
};

exports.customers = customers;
exports.settings = settings;
exports.payments = payments;
exports.balances = balances;
