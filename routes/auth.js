const express = require('express');
const authController = require('../controllers/register.js');
const accountController = require('../controllers/login.js');
const transferController = require('../controllers/transfer.js');

const router = express.Router();

router.post('/register', authController.register);

router.post('/account', accountController.login);

router.post('/transfer', transferController.transfer);

module.exports = router;
