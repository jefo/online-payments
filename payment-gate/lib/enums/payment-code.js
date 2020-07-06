'use strict';

const paymentCode = Object.freeze({
	ACCEPTED: 0,
	NOT_ACCEPTED: 1,
	CUSTOMER_NOT_FOUND: 2,
	CUSTOMER_CANNOT_BE_CHECKED: 3
});

module.exports = paymentCode;
