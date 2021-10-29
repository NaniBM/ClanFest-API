const User = require("../models/User");

const getNotification = async function(req, res){
  try {

    const { notificaciones } = await User.findById(req.params.id, "notificaciones");
    return res.json(notificaciones)

  } catch (err) {
    console.error(err);
  }  
};


const addNotification = async (data) => {
  try {
    await User.findByIdAndUpdate(data.uid, {
      $push: {
        notificaciones: data,
      },
    }).exec();
  } catch (err) {
    console.error(err);
  }
};

const cleanNotifications = async (id) => {
  try {
    const user = await User.findById(id);
    user.notificaciones = [];
    await user.save();
  } catch (err) {
    console.error(err);
  }
};

module.exports = { getNotification, addNotification, cleanNotifications };
