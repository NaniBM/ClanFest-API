const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generarJWT } = require('../Helpers/jwt')

const createUser = async (req, res) => {
    
    const { email, password} = req.body;

    try {
        let user = await User.findOne({ email });

        if(user) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo'
            });
        }

        user = new User(req.body);

        //Encriptar la password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        await user.save();

        // Generar JWT
        const token = await generarJWT(user._id, user.usuario);

        return res.status(201).json({
            ok: true,
            msg: 'Creacion de un nuevo user',
            uid: user._id,
            name: user.usuario,
            image: user.avatar,
            token
        })
        
    } catch (error) {
        res.status(500).json({ 
            ok: false,
            msg: 'error',
            err: error
        })
    }
}

const loginUser = async (req, res) => {

    const {email, password} = req.body;
    console.log("password:" , password)
    try {        
        const user = await User.findOne({ email });
        console.log("email:", email)
        console.log("User:", user)
        if(!user) {
            return res.json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            });
        }

        //Confirma password
        const validaPassword = bcrypt.compareSync( password, user.password);

        if( !validaPassword ){
            return res.json({
                ok: false,
                msg: 'Password incorrecto'
            })
        }

        //Generar JWT
        const token = await generarJWT(user.id, user.name);


        res.json({
            ok: true,
            uid: user.id,
            name: user.usuario,
            image: user.avatar,
            token
        })
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'ERROR'
        })
    }

}

const renewToken = async(req, res) => {

    const {uid, usuario} = req.body;

    //Genera un nuevo JWT y retorna en esta peticion
    const token  = await generarJWT(uid, usuario)

    res.json({
        ok: true,
        msg: 'renew',
        uid,
        usuario,
        token
    })
}


module.exports = {
    createUser,
    loginUser,
    renewToken

}
