const { Router } = require('express');

const usersRoutes = require('./users');
const eventsRoutes = require('./Events');

const router = Router();

router.use('/', usersRoutes);

module.exports = router;