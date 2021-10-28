const { Router } = require('express');
const { getNotification } = require('../Controllers/Notifications')

const router = Router();

router.get('/', getNotification);

module.exports = router;