const User = require('../models/User');
const bcrypt = require('bcryptjs');

const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.json(users)
    } catch (err) {
        res.json({
            error: err,
            message: "Error al buscar users"
        })
    }
};

const getUserById = async (req, res) => {

    try {
        const { id } = req.params;

        // crea variable con la consulta para evitar error por consola "querry was already executed"
        const findByIdQuery = User.findById(id, (err, user) => {

            if (err) throw err;

            if (!user) {
                return res.status(400).json({
                    message: "No se ha encontrado ningun usuario"
                })
            }

            if (user) {
                return res.status(200).json({
                    message: "Usuario encontrado",
                    user
                })
            }
        });

        // ejecucion de la consulta
        await findByIdQuery.clone()
    } catch (err) {
        res.json({
            error: err,
            message: "Error al buscar por ID"
        })
    };


};

const deleteUser = async (req, res) => {

    try {
        const { id } = req.params;

        const result = await User.findByIdAndDelete(id);

        if (result === null) {
            return res.json({
                message: "No existe el user a eliminar"
            });

        } else {
            return res.json({
                message: `Se ha eliminado el user ${result.usuario}`
            });
        }

    } catch (err) {
        res.json({
            error: err,
            message: "Error al borrar user"
        })
    };

};

const editUser = async (req, res) => {

    try {

        const { id } = req.params;
        const { name, password } = req.body;

        if (name && !password) {
            const user = await User.findByIdAndUpdate(id,
                {
                    usuario: name
                }
            );

            return res.json({
                message: `Nombre de user ${user.usuario} actualizado con exito a ${name}`
            });
        };

        if (password && !name) {

            const salt = bcrypt.genSaltSync();
            const hashPass = bcrypt.hashSync(password, salt);

            const user = await User.findByIdAndUpdate(id,
                {
                    password: hashPass
                }
            );

            return res.json({
                message: `${user.usuario} actualizo su password con exito`
            });
        };

        if (name && password) {

            const salt = bcrypt.genSaltSync();
            const hashPass = bcrypt.hashSync(password, salt);

            const user = await User.findByIdAndUpdate(id,
                {
                    usuario: name,
                    password: hashPass
                }
            );

            return res.json({
                message: `${user.usuario} actualizo su nombre y password con exito`
            });
        } else {
            return res.json({
                message: "No se han ingresado datos"
            })
        }

    } catch (err) {
        res.json({
            message: "Error al editar"
        })
    }

};

module.exports = { getUsers, getUserById, deleteUser, editUser };
