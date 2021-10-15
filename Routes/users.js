const express = require('express');
const { getUsers, createUser } = require('../Controllers/UsersController');
const router = express.Router();

router.get('/', getUsers);
router.post('/adduser', createUser);

module.exports = router;