'use strict';

const HTTP_STATUS = require('http-status-codes');
const swaggerValidation = require('openapi-validator-middleware');
const httpErrorMessages = require('../errors/httpErrorMessages');
const NotFoundError = require('../errors/notFoundError');

const errorHandler = () => {
	return (err, req, res, next) => {
		if (res.headersSent) {
			return next(err);
		}

		const httpCode = getErrorHttpCode(err);
		const message = getErrorMessage({
			err,
			httpCode,
		});

		return res
			.status(httpCode)
			.json({
				code: httpCode,
				message,
				errors: err.errors,
			});
	};
};

/**
 * @param {Error} err An error.
 * @returns {number} A http code.
 * */
function getErrorHttpCode(err) {
	if (err instanceof NotFoundError) {
		return HTTP_STATUS.NOT_FOUND;
	}

	if (err instanceof swaggerValidation.InputValidationError) {
		return HTTP_STATUS.BAD_REQUEST;
	}

	const code = err.code || err.status;

	return Number.isInteger(code) ? code : HTTP_STATUS.INTERNAL_SERVER_ERROR;
}

/**
 * @param {Error} err An error.
 * @param {Number} httpCode A http code of the error.
 * @returns {string} A message of an error.
 * */
function getErrorMessage({ err, httpCode }) {
	if (isInternalServerError(httpCode)) {
		return httpErrorMessages.UNKNOWN_ERROR;
	}

	return err.message || httpErrorMessages.UNKNOWN_ERROR;
}

/**
 * @param {Number} httpCode A http code.
 * @returns {boolean} True if it a server error, otherwise false.
 * */
function isInternalServerError(httpCode) {
	return httpCode >= HTTP_STATUS.INTERNAL_SERVER_ERROR;
}

module.exports = errorHandler;
