const express = require('express');
const { getUsers, getUserById, deleteUser, editUser} = require('../Controllers/UsersController');

const router = express.Router();

// trae todos los users
router.get('/', getUsers);

// trae todo el detalle del user
router.get('/:id', getUserById);

// borrar user
router.delete('/delete/:id', deleteUser);

// editar user
router.put('/edit/:id', editUser);

module.exports = router;