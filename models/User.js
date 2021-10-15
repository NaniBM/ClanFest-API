const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  usuario: {
    type: String,
    unique: true,
    required: true,    
    validate: {
      validator: (usuario) => {
        if (usuario.length >= 3 && usuario.length < 50) {
          return true;
        } else {
          return false;
        }
      },
      message: "Debe ser mayor a 3 caracteres y menor a 50",
    },
  },
  email: {
    type: String,
    unique: true,
    required: true, 
    
  },
  password: {
    type: String, 
    required: true, 
    
  },
  avatar: {
    type: String,
    default: "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
  },
  fechaDeCreacion: {
    type: Date,
    default: new Date(),
  },
  eventosCreados: {
    type: [], //array de event._id
  },
  eventsFavoritos: {
    type: [], //array de event._id
  },
  eventosaAsistir: {
    type: [], //array de event._id
  },
});

module.exports = model("User", userSchema);
