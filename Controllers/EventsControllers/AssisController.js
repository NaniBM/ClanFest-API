const Event = require('../../models/Event');
const { ObjectId } = require('mongodb');

<<<<<<< HEAD
=======
const addAssistant = async function (uid, eid){
    try{
        const addUser = await Event.findByIdAndUpdate(eid, {
            $push: {
                asistentes: [{
                    usuario: uid
                }]
            }
        }).exec();

        return

    }catch (err) {
        res.json({
            message: "Error al crear tarea"
        })
    }
};

>>>>>>> 9b811cd9bc673013b3233457b0f21029b2e98d64
const getAssistans = async function(req, res){
    try{
        const list = await Event.findById(req.params.id, "asistentes");
        if (!list.asistentes.length) {
            return res.json({
                message: "Este evento no tiene asistentes"
            });

        } else {
            res.send(list);
        };
    }
    catch (err) {
        console.log(err);
    };
};

<<<<<<< HEAD
const putDeleteAssistans = async function(req, res){
=======
const deleteAssistant = async function (uid, eid){
>>>>>>> 9b811cd9bc673013b3233457b0f21029b2e98d64
    try{
        const event = await Event.findOneAndUpdate(
            {
                _id: eid,
                'asistentes.usuario': ObjectId(uid)
            },
            {
                $pull: {
                    'asistentes':{
                        usuario: ObjectId(uid)
                    }
                }
            });
        
        return
    }
    catch (err) {
        console.log(err);
    };
};

module.exports = {
    getAssistans,
    deleteAssistant,
    addAssistant
}