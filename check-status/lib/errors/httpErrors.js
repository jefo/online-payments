'use strict';

const HTTP_STATUS = require('http-status-codes');
const ApplicationError = require('./applicationError');

const httpErrorMessages = require('./httpErrorMessages');

class HTTPError extends ApplicationError {
	/**
	 * @param {Number} code HTTP error code
	 * @param {String} message Error message
	 * @memberof HTTPError
	 */
	constructor(code = HTTP_STATUS.INTERNAL_SERVER_ERROR, message = httpErrorMessages.UNKNOWN_ERROR) {
		super(message);

		this.name = this.constructor.name;
		this.code = code;
	}
}

module.exports = {
	HTTPError,
	notFound: new HTTPError(HTTP_STATUS.NOT_FOUND, httpErrorMessages.NOT_FOUND),
	unauthorized: new HTTPError(HTTP_STATUS.UNAUTHORIZED, httpErrorMessages.UNAUTHORIZED),
};
