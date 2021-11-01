const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  usuario: {
    type: String,
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
    validate: {
      validator: (email) => {
        const ck_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (email.match(ck_email)) {
          return true
        } else {
          return false
        }
      },
      message: "Solo se permite direcciones de correos",
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: (password) => {
        const ck_password = /^(?=.[0-9])[a-zA-Z0-9!@#$%^&]{6,30}$/
        if (password.match(ck_password)) {
          return true
        }
      },
      message: 'Solo se admite como minimo 6 y maximo 16 caracteres y un caracter especial'
    },
  },
  avatar: {
    type: String,
    default: "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
  },
  tareas: [{
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event'
    },
    tareasDelUsuario: {
      type: [String]
    }
  }],
  fechaDeCreacion: {
    type: Date,
    default: new Date(),
  },
  eventosCreados: {
    type: [Schema.Types.OjectId],
    ref: 'Event' //array de event._id
  },
  eventsFavoritos: {
    type: [Schema.Types.OjectId],
    ref: 'Event' //array de event._id
  },
  eventosaAsistir: [{
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event'
    },
    statusPago: {
      id: {
        type: String
      },
      status: {
        type: String
      },
      monto: {
        type: Number
      },
      qr: {
        type: String
      }
    }
  }],
  notificaciones: [{
    uid: {
      type: String
    },
    type:{
      type: String
    },
    idEvento: {
      type: String
    },
     message: {
       type: String
     }
  }],
  habilitado: {
    type: Boolean,
    require: true,
    default: true
  }
});

module.exports = model("User", userSchema);
