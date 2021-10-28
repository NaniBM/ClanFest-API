
//configuracion para nuevo usuario online
let users = [];
const addNewUser = (uid, username, socketID) => {
  if (!users.some((user) => user.uid === uid)) {
    users.push({ uid, username, socketID });
    console.log(users)
  }
};


//configuracion para usuario al desconectarse
const deleteUsers = (socketID) => {
  users = users.filter((user) => user.socketID !== socketID);
};

//obtener Socket.id de usuario receptor de la notificacion (online)
const getUser = (uid) => {
  return users.find((user) => user.uid === uid);
};

module.exports={addNewUser,deleteUsers,  getUser}