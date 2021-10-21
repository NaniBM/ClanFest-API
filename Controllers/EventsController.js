const Event = require('../models/Event');
const User = require('../models/User');


const addEvents = async function(req, res){
    try{
        const {nombreDelEvento, direccion, fecha, horaDeInicio, descripcion, autor} = req.body;
        if(!nombreDelEvento || !direccion || !fecha || !horaDeInicio || !descripcion){
            return res.json({
                message: 'Faltan campos por completar'
            });
        }
        const event = new Event(req.body);
        const result = await event.save((err)=> err? handleError(err): null);
        console.log(event._id)
        const creador = await User.findByIdAndUpdate(autor,
            {'$push': {'eventosCreados': event._id}});
        console.log('creadorrrrrr: ', creador)
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
        const search = req.body.search || 0;
        if(!search){

            const events = await Event.find();

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
        console.log(detail)
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

const patchNewTarea = async function(req, res){
    try{
        const {id} = req.params;
        const {usuario, tareasDelUsuario} = req.body;

        const tarea = await Event.findByIdAndUpdate(id, 
            // funcion para poder pushear agregar elementos a una propiedad array de un Model
            {'$push': {"asistentes.$[elem].tareasDelUsuario": tareasDelUsuario}},
            { 'arrayFilters' : [ {"elem.usuario" : usuario } ],
            multi : false }
        );
        return res.json({
            message: `Se añadio una tarea al usuario ${usuario}`
        });
    }
    catch (err) {
        console.log(err);
    };
};

const patchBorrarTarea = async function(req, res){
    try{
        const {id} = req.params;
        const {usuario, tareasDelUsuario} = req.body;

        const tarea = await Event.findByIdAndUpdate(id, 
            {'$pull': {"asistentes.$[user].tareasDelUsuario": tareasDelUsuario}},
            { 'arrayFilters' : [ {"user.usuario" : usuario }],
            multi : false }
        );
        return res.json({
            message: `Se eliminó una tarea al usuario ${usuario}`
        });
    }
    catch (err) {
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

const putDeleteAssistans = async function(req, res){
    try{
        const {usuario} = req.body;
        const {id} = req.params;
        const listAssist = await Event.findById(id, "asistentes");

        if(!listAssist.asistentes.length){
            return res.json({
                message: "Este evento no tiene asistentes"
            });
        }
        console.log(listAssist)
        if(!listAssist.asistentes.find((e)=> e.usuario === usuario)) return res.json({message: `${usuario} no se encuentra en este evento`});
        const filtradoA = {asistentes: listAssist.asistentes.filter((e)=> e.usuario !== usuario)};
        const deleteAssistan = await Event.findByIdAndUpdate(id, filtradoA);
        
        const listEvents = await User.findOne({usuario: usuario}, "eventosaAsistir");
        console.log(listEvents)
        const filtradoE = {eventosaAsistir: listEvents.eventosaAsistir.filter((e)=> e !== id)};
        const deleteEventbyUser = await User.findOneAndUpdate({usuario: usuario}, filtradoE);
        
        return res.json({
            message: `${usuario} fue eliminado del evento con exito`
        });
    }
    catch (err) {
        console.log(err);
    };
};

const deleteEvent = async (req, res) => {
    try {
        const result = await Event.findByIdAndDelete(req.params.id);

        if (result === null) {
            return res.json({
                message: "No existe el evento a eliminar"
            });

        } else {
            return res.json({
                message: `Se ha eliminado el evento ${result.nombreDelEvento}`
            });
        };
    } catch (err) {
        console.log(err);
    };
};

module.exports = {
    addEvents, 
    getEvents,
    getEventDetail,
    getAssistans,
    putEditEvent,
    deleteEvent,
    putDeleteAssistans,
    patchNewTarea,
    patchBorrarTarea
}