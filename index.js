const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// importacion de rutas
const router = require("./Routes/index");

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URI,{
    useNewUrlParser: true,
})
.then(db => console.log('BD conectada'))
.catch(error => console.error(error))
//habilitar body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

//habilitar cors
app.use(cors(origin: '*'));
app.use(router);

const port = process.env.PORT || 3008;
app.listen(port, function(){
    console.log('servidor escuchando en puerto:', port)
})