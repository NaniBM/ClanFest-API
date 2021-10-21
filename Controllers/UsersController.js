const User = require('../models/User');
const bcrypt = require('bcryptjs');

const getUsers = async (req, res) => {
    try {
        const users = await User.find().exec();
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

        const result = await User.findByIdAndDelete(id).exec();

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
            ).exec();

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

        // verifico que el evento no se encuentre ya dentro de los favoritos
        const result = await User.findById(id).where('eventsFavoritos').equals(eventId).exec();

        if (result === null) {

            const user = await User.findByIdAndUpdate(id, {
                // funcion para poder pushear agregar elementos a una propiedad array de un Model
                $push: {
                    eventsFavoritos: eventId
                }
            }
            ).exec();

            return res.json({
                message: `${user.usuario} agrego un evento a Favorito`
            });
        } else {

            return res.json({
                message: 'Ya existe el evento en favoritos'
            });
        }

    } catch (err) {
        res.json({
            message: "Error al agregar a favorito"
        })
    }
};

const removeFavourite = async (req, res) => {
    try {

        const { id, eventId } = req.params;

        const result = await User.findById(id).where('eventsFavoritos').equals(eventId).exec();

        if (result === null) {
            return res.json({
                message: "El evento no se encuentra en favoritos"
            })
        } else {
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
        }

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
        }).exec();

        const favouritesEvents = result.eventsFavoritos;

        if (favouritesEvents.length === 0) {
            return res.json({
                message: "El usario no tiene eventos favoritos",
                favouritesEvents
            });
        } else {
            return res.json({
                message: "Se han encontrado favoritos",
                favouritesEvents
            });
        }

    } catch (err) {
        res.json({
            message: "Error al buscar eventos favoritos"
        })
    }
};

const getUserEvents = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await User.findById(id).populate('eventosCreados', {
            nombreDelEvento: 1,
            _id: 1
        }).exec();

        const createdEvents = result.eventosCreados;

        if (createdEvents.length === 0) {
            return res.json({
                message: "El usuario no tiene eventos creados",
                createdEvents
            });
        } else {
            return res.json({
                message: "Se han encontrado eventos",
                createdEvents
            });
        }

    } catch (err) {
        res.json({
            message: "Error al buscar eventos de user"
        })
    }

};

const getUserEventsToAssist = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await User.findById(id).populate('eventosaAsistir', {
            nombreDelEvento: 1,
            _id: 1
        }).exec();


        const eventsToAssist = result.eventosaAsistir;

        if (eventsToAssist.length === 0) {
            return res.json({
                message: "El usuario no tiene eventos creados",
                createdEvents
            });
        } else {
            return res.json({
                message: "Se han encontrado eventos",
                createdEvents
            });
        }

    } catch (err) {
        res.json({
            message: "Error al buscar eventos de user"
        })
    }

};

module.exports = { getUsers, getUserById, deleteUser, editUser, addFavourite, getUserEventsToAssist, removeFavourite, getUserEvents, getFavouritesEvents };
