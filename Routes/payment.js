const express = require('express');
const router = express.Router();

const {getMercadoPagoLink, addPayment, getPayment, updatePayment, getPaymentStatus, getPayments} = require('../Controllers/paymentController/paymentController');

// traer todos los pagos
router.get('/getpayments', getPayments);

// crear nuevo link de pago
router.post('/new', getMercadoPagoLink);

// traer pago de DB
router.get('/getpayment/:id/:eventid', getPayment);

// consulto pago a API MP
router.get('/getstatus/:id', getPaymentStatus);

// guardar status de pago
router.patch('/addpayment/:id/:eventid', addPayment);

// actualizar estado del pago
router.patch('/updatepayment/:id', updatePayment);

module.exports = router;