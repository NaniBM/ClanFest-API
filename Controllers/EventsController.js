const Event = require('../models/Event');


const getEvents = async (req,res) => {
    try {
        const events = await Event.find();
        res.send(events)
    } catch (err) {
        console.log(err) 
    } 
};
