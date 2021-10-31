const User = require('../../models/User');

const getFavouritesEvents = async (req, res) => {

    try {

        const { id } = req.params;

        // traigo datos del evento del modelo Event que se encuentra en favoritos
        const result = await User.findById(id).populate('eventsFavoritos', {
            nombreDelEvento: 1,
            _id: 1
        }).exec();

        const favouritesEvents = result.eventsFavoritos;

        if (favouritesEvents.length === 0) {
            return res.json({
                message: "El usario no tiene eventos favoritos",
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

        // verifico si el evento se encuentra dentro de favoritos
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

module.exports = {addFavourite, removeFavourite, getFavouritesEvents };

