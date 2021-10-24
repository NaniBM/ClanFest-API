const Event = require('../../models/Event');
const { ObjectId } = require('mongodb');

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

const deleteAssistant = async function (uid, eid){
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