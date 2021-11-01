const { Router } = require('express');
const {enviarMailAsistir} = require("../Controllers/MailsControllers");

const router = Router();

router.post("/send-email" , enviarMailAsistir);


module.exports = router;