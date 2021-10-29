const User = require('../../models/User');
const { ObjectId } = require('mongodb');

const { addTaskEvent, deleteTaskEvent } = require('../EventsControllers/TaskController')

const getTasks = async (req, res) => {

    try {

        const { id } = req.params;

        // traigo desde el model Event del id almacenado en tareas.eventId las filas definidas
        const result = await User.findById(id).populate('tareas.eventId', {
            nombreDelEvento: 1,
            _id: 1
        }).exec();

        // traigo desde el model Event del id almacenado en tareas.eventosaAsistir las filas definidas
        const resultado = await User.findById(id).populate('eventosaAsistir.eventId', {
            nombreDelEvento: 1,
            fecha: 1
        }).exec();

        const eventsToAssist = resultado.eventosaAsistir
        const userTasks = result.tareas;

        if (userTasks.length === 0) {
            return res.json({
                message: "El user no tiene tareas creadas"
            })
        } else {
            return res.json({
                message: "Tareas del user encontradas",
                userTasks,
                eventsToAssist
            });
        }


    } catch (err) {
        res.json({
            message: "Error al buscar tareas"
        });
    }

};

const addTask = async (req, res) => {

    try {

        const { id, eventId } = req.params;
        const { tarea } = req.body;

        const userCheck = await User.findById(id).exec();

        if (userCheck) {

            // verifico si el evento existe o no
            const event = userCheck.tareas.find(e => e.eventId.toString() === eventId);

            if (!event) {

                // agrego la tarea al modelo Event
                await addTaskEvent(id, eventId, tarea);

                const user = await User.findByIdAndUpdate(id, {
                    // funcion para poder pushear agregar elementos a una propiedad array de un Model
                    $push: {
                        tareas: [{
                            eventId: eventId,
                            tareasDelUsuario: tarea.toUpperCase()
                        }]
                    }
                }).exec();

                return res.json({
                    message: `El user ${user.usuario} agrego la tarea ${tarea} a un evento nuevo`
                });

            } else {

                const indexEvent = userCheck.tareas.findIndex(e => e.eventId.toString() === eventId);

                await addTaskEvent(id, eventId, tarea);

                const user = await User.findOneAndUpdate(
                    {
                        _id: id,
                        'tareas.eventId': ObjectId(eventId)
                    },
                    {
                        $addToSet: {
                            'tareas.$.tareasDelUsuario': tarea.toUpperCase()
                        }
                    },
                    {
                        new: true
                    }).exec();

                const initialTasksList = event.tareasDelUsuario.length;
                const updatedTasksList = user.tareas[indexEvent].tareasDelUsuario.length;

                if (initialTasksList === updatedTasksList) {
                    return res.json({
                        message: "La tarea ya existe en el evento"
                    })
                } else {
                    return res.json({
                        message: `El user ${user.usuario} agrego la tarea ${tarea} a un evento existente`
                    })
                }
            };
        }

        return res.json({
            message: "No existe user con el id ingresado"
        })

    } catch (err) {
        console.log(err)
        res.json({
            message: "Error al crear tarea"
        })
    }

};

const deleteTask = async (req, res) => {

    try {

        const { id, eventId } = req.params;
        const { tarea } = req.body;

        const userCheck = await User.findById(id).exec();

        if (userCheck) {

            // verifico si el evento existe
            const event = userCheck.tareas.find(e => e.eventId.toString() === eventId);

            // traigo el indice del evento al cual le voy a quitar la tarea
            const indexEvent = userCheck.tareas.findIndex(e => e.eventId.toString() === eventId);

            const user = await User.findOneAndUpdate(
                {
                    _id: id,
                    'tareas.eventId': ObjectId(eventId)
                },
                {
                    $pull: {
                        'tareas.$.tareasDelUsuario': tarea.toUpperCase()
                    }
                },
                {
                    new: true
                }).exec();

            
            // borro la tarea del model Event
            await deleteTaskEvent(id, eventId, tarea.toUpperCase());

            // guardo la longitud del array de tareas antes y despues de intentar quitar
            const initialTasksList = event.tareasDelUsuario.length;
            const updatedTasksList = user.tareas[indexEvent].tareasDelUsuario.length;

            // controlo si realmente se quito o no una tarea
            if (initialTasksList === updatedTasksList) {
                return res.json({
                    message: "La tarea a borrar no existe"
                })
            } else {
                return res.json({
                    message: `El user ${user.usuario} quito la tarea ${tarea} a un evento existente`
                })
            }
        } else {
            return res.json({
                message: `No existe el usuario`
            });
        }
    }
    catch (err) {
        res.json({
            message: "Error al borrar tarea"
        })
    };
};

module.exports = { addTask, getTasks, deleteTask };
