const express = require('express');
const { getUsers, getFavouritesEvents, getUserById, deleteUser, editUser, removeFavourite, addFavourite, getUserEvents, getUserEventsToAssist} = require('../Controllers/UsersController');

const router = express.Router();

// trae todos los users
router.get('/', getUsers);

// trae todo el detalle del user
router.get('/:id', getUserById);

// borrar user
router.delete('/delete/:id', deleteUser);

// editar user
router.put('/edit/:id', editUser);

// agregar evento a favorito
router.patch('/addfavourite/:id/:eventId', addFavourite);

// borrar evento de favorito
router.patch('/removefavourite/:id/:eventId', removeFavourite);

// traer todos los favoritos de un user
router.get('/favouritesevents/:id', getFavouritesEvents);

// traer todos los eventos de un user
router.get('/userevents/:id', getUserEvents);

// traer todos los eventos a asistir de un user
router.get('/usereventstoassist/:id', getUserEventsToAssist);

module.exports = router;