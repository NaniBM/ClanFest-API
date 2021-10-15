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

//habilitar cors
app.use(cors());
app.use(router);

const port = process.env.PORT || 3008;
app.listen(port, function(){
    console.log('servidor escuchando en puerto:', port)
})