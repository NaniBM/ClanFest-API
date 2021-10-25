const User = require("../models/User");


const getNotification = async (uid) => {
    console.log(`get-notificaciones:`)
  try {
    const notificaciones = await User.findByYId(uid, "notificaciones");
   
    if (!notificaciones.length) {
      return "No tienes notificaciones"
    } else {
      return  notificaciones
    }
  } catch (err) {
    console.log(err);
  }
};

const addNotification = async (senderName, uidReceiver, message) => {
  try {
     await User.findByIdAndUpdate(uidReceiver, {
      $push: {
        notificaciones: {senderName, message}
      },
    }).exec();
  } catch (err) {
    console.log(err);
  }
};


module.exports = { getNotification, addNotification };
