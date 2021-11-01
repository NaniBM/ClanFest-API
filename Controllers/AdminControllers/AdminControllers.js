const User = require('../../models/User');

const patchHabilitarUser = async function(req, res){
    
    try{
        const {uid, habilitado} = req.params;

        const validacion = await User.findById(uid);
        
        if(!validacion) res.json({message: `El usuario no existe`});
        if(validacion.habilitado === false && habilitado === "false") res.json({message: `El usuario ya se encuentra deshabilitado`})
        if(validacion.habilitado === true && habilitado === "true") res.json({message: `El usuario ya se encuentra habilitado`})
        
        if(habilitado === "false"){
            const resultado = await User.findByIdAndUpdate(uid, {
                "habilitado": false
            })
            res.json({
                message: `El usuario ${resultado.usuario} fue deshabilitado`
            })
        }else{
            const resultado = await User.findByIdAndUpdate(uid, {
                "habilitado": true
            })
            res.json({
                message: `El usuario ${resultado.usuario} fue habilitado`
            })
        }
    }
    catch(err){
        console.error(err);
    }

}

module.exports = {
    patchHabilitarUser
}