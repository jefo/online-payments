'use strict';

const {
	describe, it
} = require('mocha');
const chai = require('chai');
const PAYMENT_CODE = require('../../../lib/enums/payment-code');
const paymentCodeResolver = require('../../../lib/resolvers/payment-code');

const assert = chai.assert;

describe('/resolvers/payment-code.js', () => {
	describe('resolve', () => {
		it('returns CUSTOMER_CANNOT_BE_CHECKED payment code in case response is null', async () => {
			const response = null;

			const paymentCode = paymentCodeResolver.resolve(response);

			assert.equal(paymentCode, PAYMENT_CODE.CUSTOMER_CANNOT_BE_CHECKED);
		});

		it('returns CUSTOMER_NOT_FOUND payment code in case customerId is null', async () => {
			const response = { status: false, customerId: null };

			const paymentCode = paymentCodeResolver.resolve(response);

			assert.equal(paymentCode, PAYMENT_CODE.CUSTOMER_NOT_FOUND);
		});

		it('returns ACCEPTED payment code in case status is true', async () => {
			const response = { status: true, customerId: 'test customer id' };

			const paymentCode = paymentCodeResolver.resolve(response);

			assert.equal(paymentCode, PAYMENT_CODE.ACCEPTED);
		});

		it('returns NOT_ACCEPTED payment code in case status is false', async () => {
			const response = { status: false, customerId: 'test customer id' };

			const paymentCode = paymentCodeResolver.resolve(response);

			assert.equal(paymentCode, PAYMENT_CODE.NOT_ACCEPTED);
		});
	});
});
