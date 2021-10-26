const { Router } = require('express');

const router = Router();

const {addEvents, getEvents, getEventDetail, putEditEvent, deleteEvent} = require("../Controllers/EventsControllers/EventController")
const {getAssistans} = require("../Controllers/EventsControllers/AssisController")
//ruta para traer todos los eventos
router.get("/", getEvents);

//ruta para traer el detalle de un evento
router.get("/:id", getEventDetail);

//ruta para crear un evento
router.post('/create', addEvents);

//ruta para ver la lista de los asistentes
router.get('/assistans/:id', getAssistans);

//ruta para editar informacion del evento
router.put('/edit/:id', putEditEvent);

//ruta para borrar un evento
router.delete('/delete/:id', deleteEvent);


module.exports = router;