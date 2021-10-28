const express = require('express');
const router = express.Router();

const {getMercadoPagoLink, addPayment} = require('../Controllers/paymentController/paymentController');

// crear nuevo link de pago
router.post('/new', getMercadoPagoLink);

// guardar datos de pago
router.patch('/addpayment/:id/:eventid', addPayment);

module.exports = router;