const { Router } = require('express');
const {enviarMailAsistir, enviarMailCuandoBorranEvento, enviarMailCuandoEditanEvento} = require("../Controllers/MailsControllers");

const router = Router();

router.post("/send-email" , enviarMailAsistir);

router.post("/send-email-delete-asis/:email/:nombreDelEvento" , enviarMailCuandoBorranEvento)


router.post("/send-email-edit-asis/:email/:nombreDelEvento" , enviarMailCuandoEditanEvento)

module.exports = router;