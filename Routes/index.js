const {Router} = require('express');

const router = Router();

const usersRoutes = require('./users');
const eventsRoutes = require('./Events');
const paymentRoutes = require('./payment');
<<<<<<< HEAD
const emailRoutes = require('./Nodemailer')
=======
const notLoginRoutes = require('./notLogin');
>>>>>>> 81452658a61ff454117c77438cdfd8e2a6c3aae3

router.use('/api/users', usersRoutes);
router.use('/events', eventsRoutes);
router.use('/api/auth', require('./auth'));
router.use('/notifications', require('./notifications'));
router.use('/api/payment', paymentRoutes);
<<<<<<< HEAD
router.use('/api/email', emailRoutes);
=======
router.use('/notLogin', notLoginRoutes);

>>>>>>> 81452658a61ff454117c77438cdfd8e2a6c3aae3

module.exports = router;