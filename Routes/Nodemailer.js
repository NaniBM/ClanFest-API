const { Router } = require('express');
const {enviarMailAsistir, enviarMailCuandoBorranEvento} = require("../Controllers/MailsControllers");

const router = Router();

router.post("/send-email" , enviarMailAsistir);

router.post("/send-email-delete-asis/:email/:nombreDelEvento" , enviarMailCuandoBorranEvento)


module.exports = router;