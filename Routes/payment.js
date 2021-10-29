const express = require('express');
const router = express.Router();

const {getMercadoPagoLink, addPayment, getPayment, updatePayment} = require('../Controllers/paymentController/paymentController');

// crear nuevo link de pago
router.post('/new', getMercadoPagoLink);

// traer status de pago
router.get('/getpayment/:id/:eventid', getPayment);

// guardar status de pago
router.patch('/addpayment/:id/:eventid', addPayment);

// actualizar estado del pago
router.patch('/updatepayment/:id/:paymentid', updatePayment);

module.exports = router;