const { Router } = require('express');
const { getNotification } = require('../Controllers/Notifications')

const router = Router();

router.get('/:id', getNotification);

module.exports = router;