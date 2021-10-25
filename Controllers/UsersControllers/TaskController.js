const User = require('../../models/User');
const { ObjectId } = require('mongodb');

const {addTaskEvent, deleteTaskEvent} = require('../EventsControllers/TaskController')

const getTasks = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await User.findById(id).exec();

        const userTasks = result.tareas;

        if (userTasks.length === 0) {
            return res.json({
                message: "El user no tiene tareas creadas"
            })
        } else {
            return res.json({
                message: "Tareas del user encontradas",
                userTasks
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
        console.log(tarea)

        // verifico que la tarea no se encuentre ya dentro del array de tareas
        const userCheck = await User.findById(id).exec();

        if (userCheck) {

            const event = userCheck.tareas.find(e => e.eventId.toString() === eventId);

            if (!event) {

                const user = await User.findByIdAndUpdate(id, {
                    // funcion para poder pushear agregar elementos a una propiedad array de un Model
                    $push: {
                        tareas: [{
                            eventId: eventId,
                            tareasDelUsuario: tarea.toUpperCase()
                        }]
                    }
                }).exec();

                /* await addTaskEvent(id, eventId, tarea); */

                return res.json({
                    message: `El user ${user.usuario} agrego la tarea ${tarea} a un evento nuevo`
                });

            } else {

                const indexEvent = userCheck.tareas.findIndex(e => e.eventId.toString() === eventId);

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
        
        // const result = await User.findById(id).where('tareas').equals(tarea).exec();

        // if (result === null) {
        //     return res.json({
        //         message: "La tarea no existe"
        //     })
        // } else {
            const user = await User.findByIdAndUpdate(id, 
                {'$pull': {"tareas.$[event].tareasDelUsuario": tarea}},
                { 'arrayFilters' : [ {"event.eventId" : ObjectId(eventId) }],
                multi : false }
            );
            // const user = await User.findOneAndUpdate(
            //     {
            //         _id: id,
            //         'tareas.eventId': ObjectId(eventId)
            //     },
            //     {
            //         $pull: {
            //             'tareas.$.tareasDelUsuario': tarea
            //         }
            //     }).exec();

            await deleteTaskEvent(id, eventId, tarea);

            return res.json({
                message: `${user.usuario} borro la tarea ${tarea}`
            });
        // }

    }
    catch (err) {
        res.json({
            message: "Error al borrar tarea"
        })
    };
};

module.exports = { addTask, getTasks, deleteTask };
