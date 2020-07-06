'use strict';

const SCHEMA = 'public';

module.exports = {
	SCHEMA,
	CUSTOMERS_TABLE: `${SCHEMA}.customers`,
	SETTINGS_TABLE: `${SCHEMA}.settings`,
	PAYMENTS_TABLE: `${SCHEMA}.payments`,
	BALANCES_TABLE: `${SCHEMA}.balances`
};
