const Event = require('../../models/Event');
const User = require('../../models/User');

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

const putDeleteAssistans = async function(req, res){
    try{
        const {uid} = req.body;
        const {id} = req.params;
        const listAssist = await Event.findById(id, "asistentes");

        if(!listAssist.asistentes.length){
            return res.json({
                message: "Este evento no tiene asistentes"
            });
        }

        const event = await Event.findByIdAndUpdate(id, {
            $pull: {
                asistentes: uid
            }});
        
        const user = await User.findOneAndUpdate(uid, {
            $pull: {
                eventosaAsistir: id
            }});
        
        return res.json({
            message: `${user.usuario} fue eliminado del evento ${event.nombreDelEvento} con exito`
        });
    }
    catch (err) {
        console.log(err);
    };
};

module.exports = {
    getAssistans,
    putDeleteAssistans
}