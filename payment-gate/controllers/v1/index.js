'use strict';

const router = require('express').Router();

router.use('/payment', require('./payment'));

module.exports = router;
