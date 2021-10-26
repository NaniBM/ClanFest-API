const User = require("../models/User");


const getNotification = async (uid) => {
  try {
    const notificaciones = await User.findByYId(uid, "notificaciones");
    if (!notificaciones.length) {
      return "No tienes notificaciones"
    } else {
      return  notificaciones
    }
  } catch (err) {
    console.error(err);
  }
};

const addNotification = async (uid, message) => {
  try {
     await User.findByIdAndUpdate(uid, {
      $push: {
        notificaciones: message
      },
    }).exec();
  } catch (err) {
    console.error(err);
  }
};


module.exports = { getNotification, addNotification };
