const { Router } = require('express');

const router = Router();

const {patchHabilitarUser} = require("../Controllers/AdminControllers/AdminControllers")

//ruta para traer todos los eventos
router.patch("/set/:uid/:habilitado", patchHabilitarUser);

module.exports = router;