const { Schema, model } = require("mongoose");

//Coleccion para los eventos

const eventSchema = new Schema({
  nombreDelEvento: {
    type: String,
    required: true,
    validate: {
      validator: (nombreDelEvento) => {
        if (nombreDelEvento.length >= 3 && nombreDelEvento.length < 60) {
          return true;
        } else {
          return false;
        }
      },
      message: "Debe ser mayor a 3 caracteres y menor a 60",
    },
  },
  direccion: {
    type: String,
    required: true,
<<<<<<< HEAD
  },  
  coordenadas: {
    type: []
=======
    validate:{
      validator:(descrip)=>{
        if(descrip.length >= 10){
          return true
        }else{
          return false
        }
      },
      message: 'Tu descripcion debe ser mayor a 10 caracteres'
    },
>>>>>>> 3c6f6c778a4f58591182b367f337a223db326cf9
  },
  precio: {
    type: Number,
    required: true,
  },
  fecha: {
    type: Date,
    require: true,
  },
  horaDeInicio: {
    type: String,
    require: true,
  },
  descripcion: {
    type: String,
    require: true,
  },
  fechaDeCreacion: {
    type: Date,
    default: new Date(),
  },
  autor: {
    type: String,
    require: true, // guardar username del creador
  },
  publico: {
    type: Boolean
  },
  invitados: {
    type: Number
  },
  asistentes: {
    type: [], //guardar objetos { usernameDelAsistente: '' ,  tareasdelAsistente: []}
  },
  imagen: {
    type: String,
    default: "https://images.unsplash.com/photo-1572575156811-2ae050d748d8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80"
  }
});

module.exports = model("Event", eventSchema);
