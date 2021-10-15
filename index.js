const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const router = require("./Routes")
const app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://root:rootHenry2021@clanfestdb.kfcqt.mongodb.net/clanAppDB?retryWrites=true&w=majority',{
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