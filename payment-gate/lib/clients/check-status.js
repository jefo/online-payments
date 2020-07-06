'use strict';

const request = require('request-promise');
const errors = require('request-promise/errors');
const HTTP_STATUS = require('http-status-codes');
const { checkStatusService: { apiUrl } } = require('config');
const { logger } = require('../loggers/logger');

/**
 * Check whether customer can make payment
 * @param {String} msisdn - the customer phone number
 * @returns {Promise<Object>} a promise with the checking result
 */
function check(msisdn) {
	return request({
		uri: `${apiUrl}/check`,
		qs: { msisdn },
		json: true,
		headers: {
			'Content-Type': 'application/json',
		}
	}).catch(errors.StatusCodeError, (reason) => {
		logger.error(reason);

		if (reason.statusCode === HTTP_STATUS.NOT_FOUND) {
			return { status: false, account: null };
		}

		return null;
	}).catch(errors.RequestError, (reason) => {
		logger.error(reason);

		return null;
	});
}

module.exports = {
	check
};
