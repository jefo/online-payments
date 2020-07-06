'use strict';

const {
	describe, it, before, afterEach,
} = require('mocha');
const request = require('supertest');
const { assert } = require('chai');
const sinon = require('sinon');
const HTTP_STATUS = require('http-status-codes');
const appPromise = require('../../../index');
const paymentService = require('../../../lib/services/payment');
const PAYMENT_CODE = require('../../../lib/enums/payment-code');

let app;

describe('/controllers/v1/payment.js', () => {
	before(async () => {
		app = await appPromise;
	});

	afterEach(() => {
		sinon.restore();
	});

	describe('POST /api/v1/payment', () => {
		const endpoint = '/api/v1/payment';
		const msisdn = '+3752911111111';
		const operation = 'external operation id';
		const createdAt = (new Date()).toISOString();
		const sum = 10.5;
		const customerId = '18a629f9-961f-4709-961b-c28f0614adeb';

		it('returns success payment result', async () => {
			const payload = {
				operation,
				msisdn,
				sum,
				date: createdAt
			};
			const canAcceptPayment = true;
			const checkingResult = { status: canAcceptPayment, customerId };
			const payment = {
				customerId, operationId: operation, amount: sum, createdAt
			};

			sinon
				.stub(paymentService, 'checkCustomerStatus')
				.withArgs(msisdn)
				.resolves(checkingResult);

			sinon
				.stub(paymentService, 'makePayment')
				.withArgs(payment)
				.resolves(sum);

			const { body } = await request(app)
				.post(endpoint)
				.send(payload)
				.expect(HTTP_STATUS.OK);

			assert.deepEqual(body, {
				code: PAYMENT_CODE.ACCEPTED,
				operation,
				balance: sum
			});
		});

		it('returns failed payment result', async () => {
			const payload = {
				operation,
				msisdn,
				sum,
				date: createdAt
			};
			const canAcceptPayment = false;
			const checkingResult = { status: canAcceptPayment, customerId };
			const payment = {
				customerId, operationId: operation, amount: sum, createdAt
			};

			sinon
				.stub(paymentService, 'checkCustomerStatus')
				.withArgs(msisdn)
				.resolves(checkingResult);

			sinon
				.stub(paymentService, 'makePayment')
				.withArgs(payment)
				.resolves(sum);

			const { body } = await request(app)
				.post(endpoint)
				.send(payload)
				.expect(HTTP_STATUS.OK);

			assert.deepEqual(body, {
				code: PAYMENT_CODE.NOT_ACCEPTED,
				operation
			});
		});
	});
});
