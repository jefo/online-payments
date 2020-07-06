'use strict';

const {
	describe, it, afterEach, beforeEach
} = require('mocha');
const nock = require('nock');
const chai = require('chai');
const _ = require('lodash');
const HTTP_STATUS = require('http-status-codes');
const { checkStatusService: { apiUrl: checkStatusUrl } } = require('config');
const CUSTOMER_STATUS = require('../../../lib/enums/customer-status');
const PAYMENT_STATUS = require('../../../lib/enums/payment-status');
const paymentService = require('../../../lib/services/payment');
const db = require('../../db.helper');

const assert = chai.assert;

describe('/services/payment.js', () => {
	afterEach(async () => {
		await db.clear();
		nock.cleanAll();
	});

	describe('checkCustomerStatus', () => {
		it('returns success checking result', async () => {
			const msisdn = '+375291111111';
			const customerId = '18a629f9-961f-4709-961b-c28f0614adeb';
			const response = {
				status: true,
				account: customerId
			};

			nock(checkStatusUrl)
				.get('/check')
				.query({ msisdn })
				.reply(HTTP_STATUS.OK, response);

			const checkingResult = await paymentService.checkCustomerStatus(msisdn);

			assert.deepEqual(checkingResult, {
				status: true,
				customerId
			});
		});

		it('returns failed checking result', async () => {
			const msisdn = '+375291111111';

			nock(checkStatusUrl)
				.get('/check')
				.query({ msisdn })
				.reply(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Oh no.');

			const checkingResult = await paymentService.checkCustomerStatus(msisdn);

			assert.isNull(checkingResult);
		});
	});

	describe('makePayment', () => {
		const operationId = 'external operation Id';
		let customerId;

		beforeEach(async () => {
			await db.clear();
			const date = new Date();

			[customerId] = await db.customers().insert(
				{ msisdn: '+375291111111', status: CUSTOMER_STATUS.ACTIVE, createdAt: date }
			).returning('id');
			await db.balances().insert(
				{
					sum: 0, customerId, createdAt: date, updatedAt: date
				}
			);
		});

		it('makes failed payment in case of invalid data', async () => {
			const amount = 1;
			const date = new Date();
			const paymentPayload = {
				customerId, operationId: null, createdAt: date, amount
			};
			const balance = await paymentService.makePayment(paymentPayload);

			const payment = await db.payments().where({ customerId }).first();

			assert.isUndefined(payment);
			assert.equal(balance, 0);
		});

		it('makes success payment and returns the balance', async () => {
			const amount = 5.5;
			const date = new Date();
			const paymentPayload = {
				customerId, operationId, createdAt: date, amount
			};
			const balance = await paymentService.makePayment(paymentPayload);

			const payment = await db.payments().where({ customerId }).first();

			assert.deepEqual(_.omit(payment, 'id'), {
				amount: amount.toString(),
				operationId,
				customerId,
				status: PAYMENT_STATUS.SUCCESS,
				createdAt: date,
			});
			assert.equal(balance, 5.5);
		});
	});
});
