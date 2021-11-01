//-------- para usuarios no logueados ------------

const express = require('express');

const router = express.Router();

const { getEventsFav} = require('../Controllers/UsersControllers/NotLoginController')

//para mostrar eventos marcados como favoritos
router.post('/getfavourites', getEventsFav);

module.exports = router;