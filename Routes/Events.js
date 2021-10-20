const { Router } = require('express');

const router = Router();

const {getEvents, addEvents, getEventDetail, getAssistans, putEditEvent, deleteEvent, putDeleteAssistans} = require("../Controllers/EventsController")

//ruta para traer todos los eventos
router.get("/", getEvents);

//ruta para traer el detalle de un evento
router.get("/:id", getEventDetail);

//ruta para crear un evento
router.post('/create', addEvents);

//ruta para ver la lista de los asistentes
router.get('/assistans/:id', getAssistans);

//ruta para traer las tareas de los asistentes
router.get('/assistans/tareas/:id', getAssistans);

//ruta para editar informacion del evento
router.put('/edit/:id', putEditEvent);

//ruta para eliminar asistentes de un evento
router.put('/assistans/delete/:id', putDeleteAssistans);

//ruta para borrar un evento
router.delete('/delete/:id', deleteEvent);


module.exports = router;