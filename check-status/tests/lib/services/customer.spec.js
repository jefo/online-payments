'use strict';

const {
	describe, it, beforeEach
} = require('mocha');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const CUSTOMER_STATUS = require('../../../lib/enums/customer-status');
const CUSTOMER_TYPE = require('../../../lib/enums/customer-type');
const customerService = require('../../../lib/services/customer');
const NotSupportedError = require('../../../lib/errors/notSupportedError');
const db = require('../../db.helper');

chai.use(chaiAsPromised);
const assert = chai.assert;

describe('/services/customer.js', () => {
	afterEach(async () => {
		await db.clear();
	});

	describe('getByPhoneNumber', () => {
		let customer;

		beforeEach(async () => {
			await db.clear();
			[customer] = await db.customers().insert(
				{ msisdn: '+375291111111', status: CUSTOMER_STATUS.ACTIVE }
			).returning('*');
		});

		it('returns customer', async () => {
			const msisdn = '+375291111111';

			const foundCustomer = await customerService.getByPhoneNumber(msisdn);

			assert.deepEqual(foundCustomer, customer);
		});
	});

	describe('canAcceptPayment', () => {
		describe('when only active customers can make payments', () => {
			beforeEach(async () => {
				await db.clear();
				await db.settings().insert(
					{ key: 'customersWhoCanMakePayments', value: CUSTOMER_TYPE.ACTIVE }
				);
			});

			it('returns `true` if customer status is active', async () => {
				const [customer] = await db.customers().insert(
					{ msisdn: '+375291111111', status: CUSTOMER_STATUS.ACTIVE }
				).returning('*');

				const canAcceptPayment = await customerService.canAcceptPayment(customer);

				assert.isTrue(canAcceptPayment);
			});

			it('returns `false` if customer status is closed', async () => {
				const [customer] = await db.customers().insert(
					{ msisdn: '+375291111111', status: CUSTOMER_STATUS.CLOSED }
				).returning('*');

				const canAcceptPayment = await customerService.canAcceptPayment(customer);

				assert.isFalse(canAcceptPayment);
			});
		});

		describe('when only inactive customers can make payments', () => {
			beforeEach(async () => {
				await db.clear();
				await db.settings().insert(
					{ key: 'customersWhoCanMakePayments', value: CUSTOMER_TYPE.INACTIVE }
				);
			});

			it('returns `false` if customer status is active', async () => {
				const [customer] = await db.customers().insert(
					{ msisdn: '+375291111111', status: CUSTOMER_STATUS.ACTIVE }
				).returning('*');

				const canAcceptPayment = await customerService.canAcceptPayment(customer);

				assert.isFalse(canAcceptPayment);
			});

			it('returns `true` if customer status is closed', async () => {
				const [customer] = await db.customers().insert(
					{ msisdn: '+375291111111', status: CUSTOMER_STATUS.CLOSED }
				).returning('*');

				const canAcceptPayment = await customerService.canAcceptPayment(customer);

				assert.isTrue(canAcceptPayment);
			});
		});

		describe('when all customers can make payments', () => {
			beforeEach(async () => {
				await db.clear();
				await db.settings().insert(
					{ key: 'customersWhoCanMakePayments', value: CUSTOMER_TYPE.ALL }
				);
			});

			it('returns `true` if customer status is active', async () => {
				const [customer] = await db.customers().insert(
					{ msisdn: '+375291111111', status: CUSTOMER_STATUS.ACTIVE }
				).returning('*');

				const canAcceptPayment = await customerService.canAcceptPayment(customer);

				assert.isTrue(canAcceptPayment);
			});

			it('returns `true` if customer status is closed', async () => {
				const [customer] = await db.customers().insert(
					{ msisdn: '+375291111111', status: CUSTOMER_STATUS.CLOSED }
				).returning('*');

				const canAcceptPayment = await customerService.canAcceptPayment(customer);

				assert.isTrue(canAcceptPayment);
			});
		});

		describe('when setting doesn\'t init', () => {
			beforeEach(async () => {
				await db.clear();
				await db.settings().insert(
					{ key: 'customersWhoCanMakePayments', value: '' }
				);
			});

			it('throws NotSupportedError error', async () => {
				const [customer] = await db.customers().insert(
					{ msisdn: '+375291111111', status: CUSTOMER_STATUS.ACTIVE }
				).returning('*');

				return assert.isRejected(customerService.canAcceptPayment(customer), NotSupportedError);
			});
		});
	});
});
