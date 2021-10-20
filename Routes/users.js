const express = require('express');
const { getUsers, getFavouritesEvents, getUserById, deleteUser, editUser, removeFavourite, addFavourite} = require('../Controllers/UsersController');

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
router.put('/addfavourite/:id/:eventId', addFavourite);

// borrar evento de favorito
router.put('/removefavourite/:id/:eventId', removeFavourite);

router.get('/favouritesevents/:id', getFavouritesEvents);

module.exports = router;