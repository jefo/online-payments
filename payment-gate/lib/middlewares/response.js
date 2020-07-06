'use strict';

const HTTP_STATUS = require('http-status-codes');
const asyncMiddleware = require('./asyncMiddleware');

/**
 * Middleware for sending controller result to client
 *
 * @param {Function} controllerFn Controller function
 * @param {Number} code Response status code if needed
 * @returns {Function} Higher order function
 */

const responseMiddleware = (controllerFn, code = HTTP_STATUS.OK) => {
	return asyncMiddleware(async (req, res) => {
		const actionResult = await controllerFn(req);

		res
			.status(code)
			.send(actionResult);
	});
};

module.exports = responseMiddleware;
