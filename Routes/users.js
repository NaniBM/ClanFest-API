const express = require('express');

const router = express.Router();

const { getUsers, getUserById, deleteUser, editUser } = require('../Controllers/UsersControllers/UserController');
const { getFavouritesEvents, removeFavourite, addFavourite } = require('../Controllers/UsersControllers/FavoritesController');
const { addTask, getTasks, deleteTask } = require('../Controllers/UsersControllers/TaskController');
const { getEvents, getEventsToAssist, addEventToAssist, deleteEventToAssist} = require('../Controllers/UsersControllers/EventsController');

// trae todos los users
router.get('/', getUsers);

// trae todo el detalle del user
router.get('/:id', getUserById);

// borrar user
router.delete('/delete/:id', deleteUser);

// editar user
router.put('/edit/:id', editUser);

// traer todos los favoritos de un user
router.get('/favouritesevents/:id', getFavouritesEvents);

// traer todos los eventos de un user
router.get('/userevents/:id', getEvents);

// traer todos los eventos a asistir de un user
router.get('/usereventstoassist/:id', getEventsToAssist);

// agregar evento a asistir
router.patch('/addeventstoassist/:id/:eventId', addEventToAssist);

// eliminar evento a asistir
router.patch('/deleteeventstoassist/:id/:eventId', deleteEventToAssist);

// traer tareas de un user
router.get('/gettasks/:id', getTasks);

// crear tarea de un user
router.patch('/addtask/:id/:eventId', addTask);

// borrar tarea
router.patch('/deletetask/:id/:eventId', deleteTask);

// agregar evento a favorito
router.patch('/addfavourite/:id/:eventId', addFavourite);

// borrar evento de favorito
router.patch('/removefavourite/:id/:eventId', removeFavourite);


module.exports = router;