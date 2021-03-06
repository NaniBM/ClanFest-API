/* 
    Rutas de Usuario / Auth
    host + /api/auth
*/

const { Router } = require('express');
const { createUser, loginUser, renewToken } = require('../Controllers/auth');

const router = Router();

router.post('/new', createUser);  

router.post('/', loginUser)  

router.get('/renew', renewToken)  


module.exports = router;