'use strict';

const db = require('../../db');
const CUSTOMER_TYPE = require('../enums/customer-type');
const CUSTOMER_STATUS = require('../enums/customer-status');
const NotSupportedError = require('../errors/notSupportedError');

const CUSTOMERS_WHO_CAN_MAKE_PAYMENTS_SETTING = 'customersWhoCanMakePayments';

/**
 * Get customer by phone number
 * @param {String} msisdn - the customer phone number
 * @returns {Promise<Object>} a promise that resolves with the customer
 */
function getByPhoneNumber(msisdn) {
	return db.customers().where({ msisdn }).first();
}

/**
 * Check whether the payment be accepted
 * @param {Object} customer - the customer
 * @returns {Promise<Boolean>} a promise that resolves with the `true` if payment can be accepted, otherwise `false`
 */
async function canAcceptPayment({ status }) {
	const { value: customersWhoCanMakePayments } = await db.settings()
		.where({ key: CUSTOMERS_WHO_CAN_MAKE_PAYMENTS_SETTING }).first();

	switch (customersWhoCanMakePayments) {
	case CUSTOMER_TYPE.ACTIVE:
		return status === CUSTOMER_STATUS.ACTIVE;
	case CUSTOMER_TYPE.INACTIVE:
		return status === CUSTOMER_STATUS.CLOSED;
	case CUSTOMER_TYPE.ALL:
		return true;
	default:
		throw new NotSupportedError();
	}
}

module.exports = {
	getByPhoneNumber,
	canAcceptPayment,
};
