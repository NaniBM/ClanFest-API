const User = require('../../models/User');

const getEvents = async (req, res) => {

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

const getEventsToAssist = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await User.findById(id).populate('eventosaAsistir', {
            nombreDelEvento: 1,
            _id: 1
        }).exec();

        const eventsToAssist = result.eventosaAsistir;

        if (eventsToAssist.length === 0) {
            return res.json({
                message: "El usuario no asiste a ningun evento",
                eventsToAssist
            });
        } else {
            return res.json({
                message: "Se han encontrado eventos a asistir",
                eventsToAssist
            });
        }

    } catch (err) {
        res.json({
            message: "Error al buscar eventos de user"
        })
    }

};

const addEventToAssist = async (req, res) => {

    try {

        const { id, eventId } = req.params;

        // verifico que el evento no se encuentre ya dentro de los favoritos
        const result = await User.findById(id).where('eventosaAsistir').equals(eventId).exec();

        if (result === null) {

            const user = await User.findByIdAndUpdate(id, {
                // funcion para poder pushear agregar elementos a una propiedad array de un Model
                $push: {
                    eventosaAsistir: eventId
                }
            }
            ).exec();

            return res.json({
                message: `${user.usuario} agrego un nuevo evento a asistir`
            });
        } else {

            return res.json({
                message: 'El user ya asiste a este evento'
            });
        }

    } catch (err) {
        res.json({
            message: "Error al agregar evento a asistir"
        })
    }
};

const deleteEventToAssist = async (req, res) => {
    try {

        const { id, eventId } = req.params;

        const result = await User.findById(id).where('eventosaAsistir').equals(eventId).exec();

        if (result === null) {
            return res.json({
                message: "El evento no se encuentra como evento a asistir"
            })
        } else {
            const user = await User.findByIdAndUpdate(id, {
                // funcion para poder eliminar elementos de una propiedad array de un Model
                $pull: {
                    eventosaAsistir: eventId
                }
            }
            );

            return res.json({
                message: `${user.usuario} dejará de asistir a asistir a este evento`
            });
        }

    } catch (err) {
        res.json({
            message: "Error al borrar un evento a asistir"
        })
    }
};

module.exports = { getEventsToAssist, getEvents, addEventToAssist, deleteEventToAssist };
