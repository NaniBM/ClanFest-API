const Event = require('../../models/Event');
const { ObjectId } = require('mongodb');

const getEventsFav = async function(req, res){
    try{
        const {idEvents} = req.body;

        const filtrado = await Event.find({'_id': {'$in': idEvents}});
        return res.json({
            message: `Eventos encontrados`,
            filtrado
        });
    }
    catch (err) {
        console.error(err)
        res.json({
            message: `Fallo en la busqueda de eventos`
        });
    };
};

module.exports = {
    getEventsFav
}