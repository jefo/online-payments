'use strict';

const { describe, it, afterEach } = require('mocha');
const { assert } = require('chai');
const sinon = require('sinon');
const HTTP_STATUS = require('http-status-codes');
const { InputValidationError } = require('openapi-validator-middleware');
const NotSupportedError = require('../../../lib/errors/notSupportedError');
const ApplicationError = require('../../../lib/errors/applicationError');
const NotFoundError = require('../../../lib/errors/notFoundError');
const errorHandler = require('../../../lib/middlewares/error');

class MockResponse {
	status(code) {
		this.statusCode = code;

		return this;
	}

	json(body) {
		this.body = body;
	}
}
describe('/middlewares/error.js', () => {
	afterEach(() => {
		sinon.restore();
	});

	describe('error handler middleware', () => {
		it('defaults to internal server error', () => {
			const res = new MockResponse();

			errorHandler()(new Error('unknown error'), null, res);

			assert.equal(res.statusCode, HTTP_STATUS.INTERNAL_SERVER_ERROR);
			assert.deepEqual(res.body, {
				code: HTTP_STATUS.INTERNAL_SERVER_ERROR,
				errors: undefined,
				message: 'unknown server error'
			});
		});

		it('resolves ApplicationError to internal server error', () => {
			const res = new MockResponse();

			errorHandler()(new ApplicationError(), null, res);

			assert.equal(res.statusCode, HTTP_STATUS.INTERNAL_SERVER_ERROR);
			assert.deepEqual(res.body, {
				code: HTTP_STATUS.INTERNAL_SERVER_ERROR,
				errors: undefined,
				message: 'unknown server error'
			});
		});

		it('resolves InputValidationError to bad request', () => {
			const res = new MockResponse();

			errorHandler()(new InputValidationError([{ message: 'error1' }], '', '', {}), null, res);

			assert.equal(res.statusCode, HTTP_STATUS.BAD_REQUEST);
			assert.deepEqual(res.body, {
				code: HTTP_STATUS.BAD_REQUEST,
				errors: [{ message: 'error1' }],
				message: 'Input validation error'
			});
		});

		it('resolves NotSupportedError to not found error', () => {
			const res = new MockResponse();

			errorHandler()(new NotSupportedError(), null, res);

			assert.equal(res.statusCode, HTTP_STATUS.BAD_REQUEST);
			assert.deepEqual(res.body, {
				code: HTTP_STATUS.BAD_REQUEST,
				errors: undefined,
				message: 'It is not supported.'
			});
		});

		it('resolves NotFoundError to bad request', () => {
			const res = new MockResponse();

			errorHandler()(new NotFoundError(), null, res);

			assert.equal(res.statusCode, HTTP_STATUS.NOT_FOUND);
			assert.deepEqual(res.body, {
				code: HTTP_STATUS.NOT_FOUND,
				errors: undefined,
				message: 'Not found.'
			});
		});
	});
});

