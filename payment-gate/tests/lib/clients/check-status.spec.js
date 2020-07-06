'use strict';

const {
	describe, it, afterEach
} = require('mocha');
const nock = require('nock');
const chai = require('chai');
const HTTP_STATUS = require('http-status-codes');
const { checkStatusService: { apiUrl: checkStatusUrl } } = require('config');
const checkStatusClient = require('../../../lib/clients/check-status');

const assert = chai.assert;

describe('/clients/check-status.js', () => {
	afterEach(async () => {
		nock.cleanAll();
	});

	describe('check', () => {
		it('returns success checking result', async () => {
			const msisdn = '+375291111111';
			const response = {
				status: true,
				account: '18a629f9-961f-4709-961b-c28f0614adeb'
			};

			nock(checkStatusUrl)
				.get('/check')
				.query({ msisdn })
				.reply(HTTP_STATUS.OK, response);

			const checkingResult = await checkStatusClient.check(msisdn);

			assert.deepEqual(checkingResult, response);
		});

		it('returns failed checking result if checking status service responds with an internal error', async () => {
			const msisdn = '+375291111111';

			nock(checkStatusUrl)
				.get('/check')
				.query({ msisdn })
				.reply(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Oh no.');

			const checkingResult = await checkStatusClient.check(msisdn);

			assert.isNull(checkingResult);
		});

		it('returns failed checking result if checking status service responds with NOT_FOUND error', async () => {
			const msisdn = '+375291111111';

			nock(checkStatusUrl)
				.get('/check')
				.query({ msisdn })
				.reply(HTTP_STATUS.NOT_FOUND);

			const checkingResult = await checkStatusClient.check(msisdn);

			assert.deepEqual(checkingResult, {
				status: false,
				account: null
			});
		});

		it('returns failed checking result if checking status service responds with error', async () => {
			const msisdn = '+375291111111';

			nock(checkStatusUrl)
				.get('/check')
				.query({ msisdn })
				.replyWithError({});

			const checkingResult = await checkStatusClient.check(msisdn);

			assert.isNull(checkingResult);
		});
	});
});
