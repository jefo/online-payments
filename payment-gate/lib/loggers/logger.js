'use strict';

const winston = require('winston');
const expressWinston = require('express-winston');

const logger = winston.createLogger({
	transports: [
		new winston.transports.Console({
			level: 'info',
			format: winston.format.simple()
		}),
	]
});

module.exports = {
	logger,
	requestHandler: expressWinston.errorLogger({
		transports: [
			new winston.transports.Console({
				level: 'info',
			})
		],
		format: winston.format.combine(
			winston.format.colorize(),
			winston.format.json()
		),
		colorize: true
	})
};
