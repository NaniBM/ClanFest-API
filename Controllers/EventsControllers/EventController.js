const Event = require('../../models/Event');
const User = require('../../models/User');
const { ObjectId } = require('mongodb');

const addEvents = async function(req, res){
    try{
        const {nombreDelEvento, direccion, fecha, horaDeInicio, descripcion, autor} = req.body;
        if(!nombreDelEvento || !direccion || !fecha || !horaDeInicio || !descripcion){
            return res.json({
                message: 'Faltan campos por completar'
            });
        }
        const event = new Event(req.body);
        const result = await event.save();
        const creador = await User.findByIdAndUpdate(autor,
            {'$push': {'eventosCreados': event._id}});

        return res.json({
            message: 'Evento creado'
        });
    }
    catch (err) {
        console.log(err);
    };
};

const getEvents = async function(req, res){
    try {
        const search = req.query.search || 0;
        if(!search){

            const events = await Event.find().populate('autor', {
                usuario: 1
            });

            if (!events.length) {
                return res.json({
                    message: "No hay eventos cargados"
                });

            } else {
                return res.send(events);
            };
        };
        
        const events = await Event.find({nombreDelEvento: {'$regex': search, '$options': 'i'}});
        if (!events.length) {
            return res.json({
                message: "No se encontro su búsqueda"
            });

        } else {
            return res.send(events);
        };
    } 
    catch (err) {
        console.log(err);
    };
};

const getEventDetail = async function(req, res){
    try {
        if(req.params.id.length !== 24) return res.json({message: "No existe el evento buscado"});

        const detail = await Event.findById(req.params.id);
        
        if (!detail) {
            return res.json({
                message: "No existe el evento buscado"
            });

        } else {
            return res.send(detail);
        };
    } 
    catch (err) {
        console.log(err);
    };
};

const deleteEvent = async (req, res) => {
    try {
        const {asistentes} = req.body;
        const eventId = req.params.id;
        const result = await Event.findByIdAndDelete(eventId);

        if (result === null) {
            return res.json({
                message: "No existe el evento a eliminar"
            });

        } else {
            if(asistentes){
                for(const asist of asistentes){
                    await User.findByIdAndUpdate(asist.usuario[0],
                    {$pull: {
                        eventosaAsistir: {
                            eventId: ObjectId(eventId)
                        }
                    }}).exec();
                }

                return res.json({
                    message: `Se ha eliminado el evento ${result.nombreDelEvento} y a todos sus asistentes`
                });

            }else{
                return res.json({
                    message: `Se ha eliminado el evento ${result.nombreDelEvento}`
                });
            }
        };
    } catch (err) {
        console.log(err);
    };
};

const putEditEvent = async function(req, res){
    try{
        const changes = req.body;
        const applyChanges = await Event.findByIdAndUpdate(req.params.id, changes);
        return res.json({
            message: `${applyChanges.nombreDelEvento} fue editado con exito`
        });
    }
    catch (err) {
        console.log(err);
    };
};

module.exports = {
    addEvents,
    getEvents,
    getEventDetail,
    deleteEvent,
    putEditEvent
}