const express = require('express');
const router = express.Router();

const {getMercadoPagoLink, addPayment, getPayment, updatePayment, getPaymentStatus, getPayments} = require('../Controllers/paymentController/paymentController');
const { getQr, genQR } = require('../Controllers/paymentController/qrcodeController');

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

// traer qr de un evento
router.get('/qr/:id/:eventid', getQr)

router.get('/genQR', genQR)

module.exports = router;