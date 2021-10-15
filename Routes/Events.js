const express = require('express');
const { getEvents } = require('../Controllers/EventsController');
const router = express.Router();

router.get('/events', getEvents);

module.exports = router;