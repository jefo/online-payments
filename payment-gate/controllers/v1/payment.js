'use strict';

const router = require('express').Router();
const {
	validationMiddleware,
	responseMiddleware,
} = require('../../lib/providers/middlewares');
const paymentService = require('../../lib/services/payment');
const paymentCodeResolver = require('../../lib/resolvers/payment-code');
const PAYMENT_CODE = require('../../lib/enums/payment-code');

/**
 * @swagger
 *  /api/v1/payment:
 *   post:
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/payment'
 *     responses:
 *       200:
 *         description: Payment result.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/successPaymentResult'
 *                 - $ref: '#/components/schemas/failedPaymentResult'
 *       400:
 *         description: Invalid input supplied.
 *     tags:
 *       - payment
 */
router.post(
	'/',
	validationMiddleware,
	responseMiddleware(async (req) => {
		const {
			msisdn, operation: operationId, sum: amount, date: createdAt
		} = req.body;

		const checkingResult = await paymentService.checkCustomerStatus(msisdn);
		const code = paymentCodeResolver.resolve(checkingResult);

		if (code !== PAYMENT_CODE.ACCEPTED) {
			return {
				code,
				operation: operationId
			};
		}

		const balance = await paymentService.makePayment({
			customerId: checkingResult.customerId, operationId, amount, createdAt
		});

		return {
			code: PAYMENT_CODE.ACCEPTED,
			operation: operationId,
			balance
		};
	}),
);

module.exports = router;
