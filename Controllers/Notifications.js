const User = require("../models/User");

const getNotification = async (uid, socketID, io) => {
  try {
    const { notificaciones } = await User.findById(uid, "notificaciones");
    if (notificaciones.length) {      
      console.log(socketID);
      io.to(socketID).emit("getNotifOfLine", notificaciones);
    }
  } catch (err) {
    console.error(err);
  }
};

const addNotification = async (uid, message) => {
  try {
    await User.findByIdAndUpdate(uid, {
      $push: {
        notificaciones: message,
      },
    }).exec();
  } catch (err) {
    console.error(err);
  }
};

const cleanNotifications = async (id) => {
  console.log(id);
  try {
    const user = await User.findById(id)
    user.notificaciones = [];
    await user.save()
  } catch (err) {
    console.error(err);
  }
};

module.exports = { getNotification, addNotification, cleanNotifications };
