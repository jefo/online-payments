'use strict';

const {
	http, swaggerPath, compression: { threshold },
} = require('config');
const express = require('express');
const helmet = require('helmet');
const qs = require('qs');
const bodyParser = require('body-parser');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const swaggerValidator = require('openapi-validator-middleware');
const HTTP_STATUS = require('http-status-codes');
const logger = require('./lib/loggers/logger');
const apiControllers = require('./controllers');
const errorHandler = require('./lib/middlewares/error');
const swaggerService = require('./lib/services/swagger');

module.exports = swaggerService.generateSwagger()
	.then(() => {
		return swaggerValidator.init(swaggerPath);
	})
	.then(async () => {
		const app = express();

		app.set('query parser', (str) => qs.parse(str, { arrayLimit: Infinity }));

		app.use(helmet.hidePoweredBy());
		app.use(helmet.hsts());
		app.use(bodyParser.json());

		app.use(compression({
			threshold,
		}));

		const swaggerDocument = await swaggerService.getSwagger();

		app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

		app.use('/api', apiControllers);

		app.use(logger.requestHandler);

		app.use((req, res) => res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'not found' }));

		app.use(errorHandler());

		app.listen(http.port);

		return app;
	});
