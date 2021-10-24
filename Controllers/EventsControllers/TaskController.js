const Event = require('../../models/Event');
const { ObjectId } = require('mongodb');

const addTaskEvent = async function(uid, eid, tarea) {

    try {

        const addTask = await Event.findOneAndUpdate(
            // funcion para poder pushear agregar elementos a una propiedad array de un Model
            {
                _id: eid,
                'asistentes.usuario': ObjectId(uid)
            },
            {
                $push: {
                    'asistentes.$.tareasDelUsuario': tarea
                }
            }).exec();
        
        return

    } catch (err) {
        console.log(err);
    };
};

const deleteTaskEvent = async function(uid, eid, tarea) {

    try {
        const deleteTask = await Event.findByIdAndUpdate(eid, 
            {'$pull': {"asistentes.$[user].tareasDelUsuario": tarea}},
            { 'arrayFilters' : [ {"user.usuario" : ObjectId(uid) }],
            multi : false }
        );
        return 
    }
    catch (err) {
        console.log(err);
    };
};

module.exports = { addTaskEvent, deleteTaskEvent };