const express = require('express');
const router = express.Router();
const v1Router = require('./v1/routes');

const version = 'v1';

router.use(`/api/${version}`, v1Router)

module.exports = router;