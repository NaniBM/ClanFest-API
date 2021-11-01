const {Router} = require('express');

const router = Router();

const usersRoutes = require('./users');
const eventsRoutes = require('./Events');
const paymentRoutes = require('./payment');
const emailRoutes = require('./Nodemailer')
const notLoginRoutes = require('./notLogin');
const adminRoutes = require('./admin');


router.use('/api/users', usersRoutes);
router.use('/events', eventsRoutes);
router.use('/api/auth', require('./auth'));
router.use('/notifications', require('./notifications'));
router.use('/api/payment', paymentRoutes);
router.use('/api/email', emailRoutes);
router.use('/notLogin', notLoginRoutes);
router.use('/admin', adminRoutes)

module.exports = router;