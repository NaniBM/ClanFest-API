const Event = require('../models/Event');


const addEvents = async function(req, res){
    try{
        const event = new Event(req.body);
        const result = await event.save();
        res.send(result);
    }
    catch(error){
        console.error(error);
    }
}

const getEvents = async function(req, res){
    try {
        const events = await Event.find();
        res.send(events)
    } 
    catch (err) {
        console.log(err)
    }
}

const getEventDetail = async function(req, res){
    try {
        const detail = await Event.findById(req.params);
        res.send(detail)
    } 
    catch (err) {
        console.log(err)
    }
}

const getAssistans = async function(req, res){
    try{
        console.log(req.params.id)
        const detail = await Event.findById(req.params.id);
        const list = detail.asistentes;
        const autor = detail.autor; 
        res.send({autor, list})
    }
    catch (err) {
        console.log(err)
    }
}

module.exports = {
    addEvents, 
    getEvents,
    getEventDetail,
    getAssistans
}