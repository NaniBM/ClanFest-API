const express = require('express');
const router = express.Router();

const {getMercadoPagoLink} = require('../Controllers/paymentController/paymentController');

// crear nuevo link de pago
router.post('/new', getMercadoPagoLink);

module.exports = router;