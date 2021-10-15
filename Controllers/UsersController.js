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
    const { usuario, email, password } = req.body;
    const user = new User();
    user = {...user , usuario, email, password}
    const result = await user.save();
    res.send(result);
    console.log("usuario guardado")
}


module.exports = {getUsers, createUser};