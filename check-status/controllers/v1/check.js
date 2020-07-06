'use strict';

const router = require('express').Router();
const {
	validationMiddleware,
	responseMiddleware,
} = require('../../lib/providers/middlewares');
const customerService = require('../../lib/services/customer');
const NotFoundError = require('../../lib/errors/notFoundError');

/**
 * @swagger
 *  /api/v1/check:
 *   get:
 *     parameters:
 *       - in: query
 *         name: msisdn
 *         description: customer phone number.
 *         schema:
 *           type: string
 *           pattern: '^\+[1-9]{1}[0-9]{3,14}$'
 *         required: true
 *     responses:
 *       200:
 *         description: Result of checking and account.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/checkingAccountResult'
 *       400:
 *         description: Invalid input supplied.
 *       404:
 *         description: The customer not found.
 *     tags:
 *       - check
 */
router.get(
	'/',
	validationMiddleware,
	responseMiddleware(async (req) => {
		const { msisdn } = req.query;

		const customer = await customerService.getByPhoneNumber(msisdn);

		if (!customer) {
			throw new NotFoundError(`Customer for msisdn ${msisdn} was not found`);
		}

		const canAcceptPayment = await customerService.canAcceptPayment(customer);

		return {
			status: canAcceptPayment,
			account: customer.id
		};
	}),
);

module.exports = router;
