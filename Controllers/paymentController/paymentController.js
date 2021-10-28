const User = require('../../models/User');
const { ObjectId } = require('mongodb');

const mercadopago = require('mercadopago');

const { addAssistant } = require('../EventsControllers/AssisController');

const getMercadoPagoLink = async (req, res) => {

    const { title, price, quantity, eventID } = req.body;

    try {

        // agregar credenciales
        mercadopago.configure({
            access_token: "APP_USR-8280527144669781-102602-1cff7e44b81391959d3d50ecffe2c8da-1007012336"
        });

        var preference = {
            items: [
                {
                    title: title,
                    quantity: quantity,
                    currency_id: 'MXN',
                    unit_price: price
                }
            ],
            "back_urls": {
                success: `http://localhost:3000/detail/${eventID}`,
                pending: `http://localhost:3000/detail/${eventID}`,
                failure: `http://localhost:3000/detail/${eventID}`
            }
        };

        mercadopago.preferences.create(preference, (err, response) => {
            if (err) {
                res.json({
                    message: "Error al crear Link",
                    err
                })
            }

            console.log("RESPONSE", response.body);

            res.json({
                LinkMP: response.body.init_point,
                id: response.body.id,
                fecha_de_pago: response.body.date_created
            })
        })

    } catch (err) {
        res.json({
            message: "Error al generar link de pago MP"
        })
    }
};

const addEvent = async (id, eventId) => {

    try {
        /* 
                // verifico que el evento no se encuentre ya dentro de los eventos a asistir
                const result = await User.findById(id).where('eventosaAsistir.eventId').equals(eventId).exec(); */

        await addAssistant(id, eventId);

        await User.findByIdAndUpdate(id, {
            // funcion para poder pushear agregar elementos a una propiedad array de un Model
            $push: {
                eventosaAsistir: [{
                    eventId: eventId,
                    statusPago: {
                        id: "",
                        status: 'Incompleto',
                        monto: ""
                    }
                }]
            }
        }
        ).exec();

        return;


    } catch (err) {
        res.json({
            message: "Error al agregar evento a asistir"
        })
    }
};

const addPayment = async (req, res) => {

    const { id, eventid } = req.params;
    const { mount, payment_id, status } = req.body;

    try {

        // verifico que el evento no se encuentre ya dentro de los eventos a asistir
        const result = await User.findById(id).where('eventosaAsistir.eventId').equals(eventid).exec();

        if (!result) {
            // agrego al user como asistente al evento
            await addEvent(id, eventid);

            const user = await User.findOneAndUpdate(
                {
                    _id: id,
                    'eventosaAsistir.eventId': ObjectId(eventid)
                },
                {
                    $set: {
                        'eventosaAsistir.$.statusPago': {
                            id: payment_id,
                            monto: mount,
                            status: status
                        }
                    }
                },
                {
                    multi: true,
                    overwrite: true,
                    new: true
                }
            ).exec();

            return res.json({
                message: `El user ${user.usuario} realizo un pago`
            })
        } else {
            return res.json({
                message: `El evento ya tiene un pago aplicado`
            })
        }
    } catch (err) {

        res.json({
            message: "Error al cargar nuevo pago",
            err
        })
    }
};

module.exports = { getMercadoPagoLink, addPayment };