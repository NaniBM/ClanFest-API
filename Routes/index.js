const {Router} = require('express');

const router = Router();

const usersRoutes = require('./users');
const eventsRoutes = require('./Events');
const paymentRoutes = require('./payment');


router.use('/api/users', usersRoutes);
router.use('/events', eventsRoutes);
router.use('/api/auth', require('./auth'));
router.use('/api/payment', paymentRoutes);

module.exports = router;