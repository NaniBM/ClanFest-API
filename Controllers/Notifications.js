const User = require("../models/User");


const getNotification = async (username) => {
    console.log(`get-notificaciones:`)
  try {
    const notificaciones = await User.findOne({usuario: username}, "notificaciones");
   
    if (!notificaciones.length) {
      return "No tienes notificaciones"
    } else {
      return  notificaciones
    }
  } catch (err) {
    console.log(err);
  }
};

const addNotification = async (req, re) => {
  try {
    const { id, usuario, notificacion } = req.body;
    console.log(`add-Notificacion: id: ${id}, usuario: ${usuario}, notificacion: ${notificacion}`)

    await User.findByIdAndUpdate(id, {
      $push: {
        notificaciones: notificacion,
      },
    }).exec();

    io.emit("Notificacion", `${usuario} te ha añadido una tarea: ${notificacion}`);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
  }
};


module.exports = { getNotification, addNotification };
