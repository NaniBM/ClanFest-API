const User = require('../models/User');


const getUsers = async (req,res) => {
    try {
        const users = await User.find();
        console.log(users)
        res.send(users)
    } catch (err) {
        console.log(err) 
    } 
};

const createUser = async (req,res) => {
    const user = new User(req.body);
    const result = await user.save();
    res.send(result);
    console.log("usuario guardado")
}


module.exports = {getUsers, createUser};