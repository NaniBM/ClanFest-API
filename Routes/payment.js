const express = require('express');
const router = express.Router();

const {webHook, getMercadoPagoLink} = require('../Controllers/paymentControllers/paymentController')

// crear nuevo link de pago
router.post('/new', getMercadoPagoLink);


router.post('/webhook', webHook);

module.exports = router;