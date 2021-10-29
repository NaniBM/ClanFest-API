const {Router} = require('express');

const router = Router();

const usersRoutes = require('./users');
const eventsRoutes = require('./Events');
const paymentRoutes = require('./payment');
const notLoginRoutes = require('./notLogin');

router.use('/api/users', usersRoutes);
router.use('/events', eventsRoutes);
router.use('/api/auth', require('./auth'));
router.use('/notifications', require('./notifications'));
router.use('/api/payment', paymentRoutes);
router.use('/notLogin', notLoginRoutes);


module.exports = router;