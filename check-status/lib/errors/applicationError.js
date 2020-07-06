'use strict';

class ApplicationError extends Error {
	/**
	 * @param {String} message Error message
	 * @memberof ApplicationError
	 */
	constructor(message = 'unknown server error') {
		super(message);

		Error.captureStackTrace(this, this.constructor);
	}
}

module.exports = ApplicationError;
