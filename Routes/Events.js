const { Router } = require('express');

const router = Router();

const {getEvents, addEvents, getEventDetail, getAssistans, putEditEvent, deleteEvent, putDeleteAssistans, patchNewTarea, patchBorrarTarea} = require("../Controllers/EventsController")

//ruta para traer todos los eventos
router.get("/", getEvents);

//ruta para traer el detalle de un evento
router.get("/:id", getEventDetail);

//ruta para crear un evento
router.post('/create', addEvents);

//ruta para ver la lista de los asistentes
router.get('/assistans/:id', getAssistans);

//ruta para agregar tareas a los asistentes
router.patch('/assistans/newTarea/:id', patchNewTarea);

//ruta para eliminar tareas de los asistentes
router.patch('/assistans/delTarea/:id', patchBorrarTarea);

//ruta para editar informacion del evento
router.put('/edit/:id', putEditEvent);

//ruta para eliminar asistentes de un evento
router.put('/assistans/delete/:id', putDeleteAssistans);

//ruta para borrar un evento
router.delete('/delete/:id', deleteEvent);


module.exports = router;