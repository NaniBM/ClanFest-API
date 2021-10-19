const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Event = require('../models/Event');

const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.json(users)
    } catch (err) {
        res.json({
            error: err,
            message: "Error al buscar users"
        })
    }
};

const getUserById = async (req, res) => {

    try {
        const { id } = req.params;

        // crea variable con la consulta para evitar error por consola "querry was already executed"
        const findByIdQuery = User.findById(id, (err, user) => {

            if (err) throw err;

            if (!user) {
                return res.status(400).json({
                    message: "No se ha encontrado ningun usuario"
                })
            }

            if (user) {
                return res.status(200).json({
                    message: "Usuario encontrado",
                    user
                })
            }
        });

        // ejecucion de la consulta
        await findByIdQuery.clone()
    } catch (err) {
        res.json({
            error: err,
            message: "Error al buscar por ID"
        })
    };


};

const deleteUser = async (req, res) => {

    try {
        const { id } = req.params;

        const result = await User.findByIdAndDelete(id);

        if (result === null) {
            return res.json({
                message: "No existe el user a eliminar"
            });

        } else {
            return res.json({
                message: `Se ha eliminado el user ${result.usuario}`
            });
        }

    } catch (err) {
        res.json({
            error: err,
            message: "Error al borrar user"
        })
    };

};

const editUser = async (req, res) => {

    try {

        const { id } = req.params;
        const { name, password } = req.body;

        if (name && !password) {
            const user = await User.findByIdAndUpdate(id,
                {
                    usuario: name
                }
            );

            return res.json({
                message: `Nombre de user ${user.usuario} actualizado con exito a ${name}`
            });
        };

        if (password && !name) {

            const salt = bcrypt.genSaltSync();
            const hashPass = bcrypt.hashSync(password, salt);

            const user = await User.findByIdAndUpdate(id,
                {
                    password: hashPass
                }
            );

            return res.json({
                message: `${user.usuario} actualizo su password con exito`
            });
        };

        if (name && password) {

            const salt = bcrypt.genSaltSync();
            const hashPass = bcrypt.hashSync(password, salt);

            const user = await User.findByIdAndUpdate(id,
                {
                    usuario: name,
                    password: hashPass
                }
            );

            return res.json({
                message: `${user.usuario} actualizo su nombre y password con exito`
            });
        } else {
            return res.json({
                message: "No se han ingresado datos"
            })
        }

    } catch (err) {
        res.json({
            message: "Error al editar"
        })
    }

};

const addFavourite = async (req, res) => {
    try {

        const { id, eventId } = req.params;

        const user = await User.findByIdAndUpdate(id, {
            // funcion para poder pushear agregar elementos a una propiedad array de un Model
            $push: {
                eventsFavoritos: eventId
            }
        }
        );

        return res.json({
            message: `${user.usuario} agrego un evento a Favorito`
        });

    } catch (err) {
        res.json({
            message: "Error al agregar a favorito"
        })
    }
};

const removeFavourite = async (req, res) => {
    try {

        const { id, eventId } = req.params;


        const eventFav = await User.find({ eventsFavoritos: eventId });

        if (eventFav.length === 0) {
            return res.json({
                message: "El evento no se encuentra en favoritos"
            })
        }

        const user = await User.findByIdAndUpdate(id, {
            // funcion para poder eliminar elementos de una propiedad array de un Model
            $pull: {
                eventsFavoritos: eventId
            }
        }
        );

        return res.json({
            message: `${user.usuario} quito un evento de Favoritos`
        });

    } catch (err) {
        res.json({
            message: "Error al agregar a favorito"
        })
    }
};

const getFavouritesEvents = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await User.findById(id).populate('eventsFavoritos', {
            nombreDelEvento: 1,
            _id: 1
        });

        const favouritesEvents = result.eventsFavoritos;

        return res.json({
            message: "Se han encontrado favoritos",
            favouritesEvents
        });

    } catch (err) {
        res.json({
            message: "Error al buscar eventos favoritos"
        })
    }
}

module.exports = { getUsers, getUserById, deleteUser, editUser, addFavourite, removeFavourite, getFavouritesEvents };
