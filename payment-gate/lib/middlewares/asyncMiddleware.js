'use strict';

/**
 * Make a safe async middleware
 * @param {Function} middlewareFn - middleware to wrap to as safe execution try/catch block and propagate an error if any
 * @returns {Function} Higher order function
 */
const asyncMiddleware = (middlewareFn) => {
	return async (req, res, next) => {
		let result = null;

		try {
			result = await middlewareFn(req, res, next);
		} catch (e) {
			return next(e);
		}

		return result;
	};
};

module.exports = asyncMiddleware;
