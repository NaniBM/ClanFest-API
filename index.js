require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const router = require("./Routes/index");

const { getNotification, addNotification, cleanNotifications } = require("./Controllers/Notifications")
const {addNewUser, getUser, deleteUsers } = require("./SocketIo/SocketIoConfig")

const app = express();
const server = http.createServer(app);

mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
  })
  .then((db) => console.log("BD conectada"))
  .catch((error) => console.error(error));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE, PATCH"
  );
  next();
});

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

//events
io.on("connection", (socket) => {
  socket.on("newUser", (data) => {
    addNewUser(data.uid, data.usuario, socket.id, io);
  });

  socket.on("postNotification", (data) => {
    const receiver = getUser(data.uid);
    if (!receiver) {
      console.log('OFFLINE')
      addNotification(data);
    } else {
      console.log('ONLINE')
      io.to(receiver.socketID).emit("getNotifications", 
      data.uid, data.type, data.idEvento, data.message)
    }
      
  });

  socket.on("cleanNotifications", (uid) => {
    cleanNotifications(uid);
  });

  socket.on("disconnect", () => {
    console.log('DISCONECTED')
    deleteUsers(socket.id);
  });
});

app.use(cors({ origin: "*" }));

app.use(router);

const port = process.env.PORT || 3008;
server.listen(port, function () {
  console.log("servidor escuchando en puerto:", port);
});

module.exports = io;
