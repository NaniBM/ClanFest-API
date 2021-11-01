const express = require('express');
const router = express.Router();

<<<<<<< HEAD
const {getMercadoPagoLink, addPayment, getPayment, updatePayment, getPaymentStatus} = require('../Controllers/paymentController/paymentController');
=======
const {getMercadoPagoLink, addPayment, getPayment, updatePayment, getPaymentStatus, getPayments} = require('../Controllers/paymentController/paymentController');
const { getQr } = require('../Controllers/paymentController/qrcodeController');

// traer todos los pagos
router.get('/getpayments', getPayments);
>>>>>>> 81452658a61ff454117c77438cdfd8e2a6c3aae3

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

<<<<<<< HEAD
=======
// traer qr de un evento
router.get('/qr/:id/:eventid', getQr)

>>>>>>> 81452658a61ff454117c77438cdfd8e2a6c3aae3
module.exports = router;