'use strict';

const swaggerValidation = require('openapi-validator-middleware');
const responseMiddleware = require('../middlewares/response');
const asyncMiddleware = require('../middlewares/asyncMiddleware');

module.exports = {
	validationMiddleware: swaggerValidation.validate,
	responseMiddleware,
	asyncMiddleware
};
