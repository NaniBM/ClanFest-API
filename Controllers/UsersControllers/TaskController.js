const { ObjectId } = require('mongodb');
const User = require('../../models/User');

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
                            tareasDelUsuario: tarea
                        }]
                    }
                }).exec();

                return res.json({
                    message: `El user ${user.usuario} agrego la tarea ${tarea} a un evento nuevo`
                });

            } else {

                await User.findOneAndUpdate(
                    {
                        _id: id,
                        'tareas.eventId': ObjectId(eventId)
                    },
                    {
                        $push: {
                            'tareas.$.tareasDelUsuario': tarea
                        }
                    }).exec();

                return res.json({
                    message: `El user ${userCheck.usuario} agrego la tarea ${tarea} a un evento existente`
                })
            };
        }

        return res.json({
            message: "No existe user con el id ingresado"
        })

    } catch (err) {
        res.json({
            message: "Error al crear tarea"
        })
    }

};

const deleteTask = async (req, res) => {

    try {

        const { id } = req.params;
        const { task } = req.query;

        const result = await User.findById(id).where('tareas').equals(task).exec();

        if (result === null) {
            return res.json({
                message: "La tarea no existe"
            })
        } else {
            const user = await User.findByIdAndUpdate(id, {
                // funcion para poder eliminar elementos de una propiedad array de un Model
                $pull: {
                    tareas: task
                }
            }
            );

            return res.json({
                message: `${user.usuario} borro la tarea ${task}`
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
