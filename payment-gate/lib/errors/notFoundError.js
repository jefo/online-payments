'use strict';

const ApplicationError = require('./applicationError');

class NotFoundError extends ApplicationError {
	/**
	 * @param {String} message Error message
	 * @memberof NotFoundError
	 */
	constructor(message = 'Not found.') {
		super(message);
	}
}

module.exports = NotFoundError;
