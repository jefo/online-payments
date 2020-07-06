'use strict';

const db = require('../../db');
const {
	PAYMENTS_TABLE,
	BALANCES_TABLE
} = require('../../db/model-constants');
const PAYMENT_STATUS = require('../enums/payment-status');
const checkStatusClient = require('../clients/check-status');
const { logger } = require('../loggers/logger');

/**
 * Check whether the customer can make payment
 * @param {String} msisdn - the customer phone number
 * @returns {Promise<Object>} a promise with the checking result
 */
async function checkCustomerStatus(msisdn) {
	const response = await checkStatusClient.check(msisdn);

	if (!response) {
		return null;
	}

	return {
		status: response.status,
		customerId: response.account
	};
}

/**
 * Make payment
 * @param {Object} payment - the payment to make
 * @param {String} payment.customerId - the customer id
 * @param {String} payment.operationId - the external operation id
 * @param {Number} payment.amount - the amount to pay
 * @param {String} payment.createdAt - the payment date
 * @returns {Promise<Number>} a promise that resolves with the customer balance
 */
async function makePayment({
	customerId, operationId, amount, createdAt
}) {
	const trx = await db.instance.transaction();

	try {
		await trx(PAYMENTS_TABLE).insert({
			customerId,
			operationId,
			amount,
			createdAt,
			status: PAYMENT_STATUS.SUCCESS
		});
		await trx(BALANCES_TABLE)
			.where({ customerId })
			.update({ updatedAt: createdAt })
			.increment({ sum: amount });

		await trx.commit();
	} catch (e) {
		logger.error(e);

		await trx.rollback();
	}

	const { sum: balance } = await db.balances()
		.where({ customerId })
		.first();

	return balance;
}

module.exports = {
	checkCustomerStatus,
	makePayment
};
