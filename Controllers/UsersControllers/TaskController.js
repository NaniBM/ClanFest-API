const User = require('../../models/User');

const getTasks = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await User.findById(id);

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

}

const addTask = async (req, res) => {

    try {

        const { id } = req.params;
        const { tarea } = req.body;

        // verifico que la tarea no se encuentre ya dentro del array de tareas
        const result = await User.findById(id).where('tareas').equals(tarea).exec();

        if (result === null) {

            const user = await User.findByIdAndUpdate(id, {
                // funcion para poder pushear agregar elementos a una propiedad array de un Model
                $push: {
                    tareas: tarea
                }
            }
            ).exec();

            return res.json({
                message: `${user.usuario} creo la tarea ${tarea}`
            });
        } else {

            return res.json({
                message: 'Ya existe la tarea que intentas crear'
            });
        }

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

    }
    catch (err) {
        console.log(err);
    };
}

module.exports = { addTask, getTasks };
