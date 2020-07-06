'use strict';

const router = require('express').Router();

router.use('/check', require('./check'));

module.exports = router;
