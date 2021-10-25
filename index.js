require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require("http");
const socketIo = require("socket.io");
const router = require("./Routes/index");
const {addNotification, getNotification} =require("./Controllers/Notifications")


const app = express();
const server = http.createServer(app);

const io = socketIo(server,{
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
}
});


mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URI,{
    useNewUrlParser: true,
})
.then(db => console.log('BD conectada'))
.catch(error => console.error(error))


//Socket.io ------------------------------------
//Socket.io conexion
let users = [];
const addNewUser = (uid, username, socketID) =>{
  !users.some(user=> user.uid ===  uid) && 
  users.push({uid, username, socketID})
}

const deleteUsers = (socketID) =>{
 users = users.filter(user => user.socketID !== socketID )
}

const getUser = ( uid ) => {
  users.find( user => user.uid === uid)
}


io.on('connection', (socket) => {
  console.log('new user connected')
  socket.on("newUser", (uid, username)=>{
    addNewUser(uid, username, socket.id)
  })

  socket.on("postNotification", ({senderName, uidReceiver, message})=>{
    const receiver = getUser(uidReceiver)    
    io.to(receiver.socketID).emit("getNotification",{
        senderName,
        message
      })
    })
  socket.on("disconnect", () => {
    deleteUsers(socket.id)
    console.log("Client disconnected");
  });
});






//----------------------------------------------
//habilitar body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE, PATCH");
  next();
});

//habilitar cors
app.use(cors({origin: '*'}));

app.use(router);

const port = process.env.PORT || 3008;
server.listen(port, function(){
    console.log('servidor escuchando en puerto:', port)
})

module.exports = io;