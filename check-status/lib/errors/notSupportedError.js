'use strict';

const ApplicationError = require('./applicationError');

class NotSupportedError extends ApplicationError {
	/**
	 * @param {String} message Error message
	 * @memberof NotSupportedError
	 */
	constructor(message = 'It is not supported.') {
		super(message);
	}
}

module.exports = NotSupportedError;
