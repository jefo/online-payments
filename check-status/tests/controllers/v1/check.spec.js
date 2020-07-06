'use strict';

const {
	describe, it, before, afterEach,
} = require('mocha');
const request = require('supertest');
const { assert } = require('chai');
const sinon = require('sinon');
const HTTP_STATUS = require('http-status-codes');
const CUSTOMER_STATUS = require('../../../lib/enums/customer-status');
const appPromise = require('../../../index');
const customerService = require('../../../lib/services/customer');

let app;

describe('/controllers/v1/check.js', () => {
	before(async () => {
		app = await appPromise;
	});

	afterEach(() => {
		sinon.restore();
	});

	describe('GET /api/v1/check', () => {
		const endpoint = '/api/v1/check';

		it('returns checking account result', async () => {
			const msisdn = '+3752911111111';
			const customerId = '18a629f9-961f-4709-961b-c28f0614adeb';
			const canAcceptPayment = true;
			const customer = {
				id: customerId,
				msisdn,
				status: CUSTOMER_STATUS.ACTIVE
			};

			sinon
				.stub(customerService, 'getByPhoneNumber')
				.withArgs(msisdn)
				.resolves(customer);

			sinon
				.stub(customerService, 'canAcceptPayment')
				.withArgs(customer)
				.resolves(canAcceptPayment);

			const { body } = await request(app)
				.get(endpoint)
				.query({
					msisdn: msisdn
				})
				.expect(HTTP_STATUS.OK);

			assert.deepEqual(body, {
				status: canAcceptPayment,
				account: customerId
			});
		});

		it('returns NOT_FOUND error in case customer doesn\'t exist', async () => {
			const msisdn = '+3752911111111';

			sinon
				.stub(customerService, 'getByPhoneNumber')
				.withArgs(msisdn)
				.resolves(null);

			const { body } = await request(app)
				.get(endpoint)
				.query({
					msisdn: msisdn
				})
				.expect(HTTP_STATUS.NOT_FOUND);

			assert.deepEqual(body, {
				code: 404,
				message: 'Customer for msisdn +3752911111111 was not found'
			});
		});

		it('returns BAD_REQUEST error in case phoneNumber is not passed', async () => {
			await request(app)
				.get(endpoint)
				.expect(HTTP_STATUS.BAD_REQUEST);
		});

		it('returns BAD_REQUEST error in case phoneNumber format is not valid', async () => {
			const msisdn = 'invalid phone number';

			await request(app)
				.get(endpoint)
				.query({
					msisdn
				})
				.expect(HTTP_STATUS.BAD_REQUEST);
		});
	});
});
