'use strict';

const { swaggerPath } = require('config');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerCombine = require('swagger-combine');
const yaml = require('js-yaml');
const fs = require('fs');
const upath = require('upath');
const mkdirp = require('mkdirp');
const { promisify } = require('util');
const { resolve } = require('path');

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

let builtSwaggerSchema;
const allowedSections = {
	schemas: 'schemas',
	parameters: 'parameters',
};

const options = {
	swaggerDefinition: {
		info: {
			title: 'Payment Gate API',
			version: '1.0.0',
		},
		openapi: '3.0.0',
	},
	apis: [
		'./controllers/**/*.js',
	],
};

/**
 * Generate swagger specification
 *
 * @returns {Object} result swagger schema
 */
async function generateSwagger() {
	let combinedSwaggerDoc = swaggerJSDoc(options);

	combinedSwaggerDoc = await buildForSchemeName(combinedSwaggerDoc, allowedSections.schemas, 'schemas');
	combinedSwaggerDoc = await buildForSchemeName(combinedSwaggerDoc, allowedSections.parameters, 'attributes');

	const swaggerYaml = yaml.safeDump(combinedSwaggerDoc);

	await mkdirp(upath.dirname(swaggerPath));
	fs.writeFileSync(swaggerPath, swaggerYaml);
	builtSwaggerSchema = await swaggerCombine(swaggerPath);

	return builtSwaggerSchema;
}

/**
 * Returns generated swagger
 *
 * @returns {Promise<Object>} swagger object
 */
async function getSwagger() {
	if (builtSwaggerSchema) {
		return builtSwaggerSchema;
	}

	return generateSwagger();
}

async function buildForSchemeName(combinedSwaggerDoc, schemeName, folderName) {
	const swaggerModelsDir = upath.join(__dirname, `/../../controllers/v1/swagger/${folderName}`);
	const swaggerModelsFileArr = await _getFilesRecursive(swaggerModelsDir, 'utf8');

	const swaggerModelsDefinitions = swaggerModelsFileArr.map((fullFilePath) => {
		return yaml.safeLoad(fs.readFileSync(fullFilePath), 'utf8');
	});
	const swaggerModels = swaggerModelsDefinitions.reduce((acc, model) => ({ ...acc, ...model }), {});

	const swaggerDoc = combinedSwaggerDoc;

	if (!Object.prototype.hasOwnProperty.call(swaggerDoc, 'components')) {
		swaggerDoc.components = {};
	}

	swaggerDoc.components[schemeName] = { ...swaggerDoc.components[schemeName], ...swaggerModels };

	return swaggerDoc;
}

async function _getFilesRecursive(dirPath, encoding) {
	const subDirs = await readdir(dirPath, encoding);
	const files = await Promise.all(subDirs.map(async (subDir) => {
		const res = resolve(dirPath, subDir);

		return (await stat(res)).isDirectory() ? _getFilesRecursive(res, encoding) : res;
	}));

	return files.reduce((a, f) => a.concat(f), []);
}

module.exports = {
	generateSwagger,
	getSwagger,
};
