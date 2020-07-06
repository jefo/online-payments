'use strict';

const PAYMENT_CODE = require('../enums/payment-code');

/**
 * Resolve payment code by checking customer result
 * @param {Object} response - the checking customer result response
 * @returns {Number} the payment code
 */
function resolve(response) {
	if (!response) {
		return PAYMENT_CODE.CUSTOMER_CANNOT_BE_CHECKED;
	}

	if (!response.customerId) {
		return PAYMENT_CODE.CUSTOMER_NOT_FOUND;
	}

	if (!response.status) {
		return PAYMENT_CODE.NOT_ACCEPTED;
	}

	return PAYMENT_CODE.ACCEPTED;
}

module.exports = {
	resolve
};
