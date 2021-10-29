const User = require('../../models/User');
const mercadopago = require('mercadopago');

const { addAssistant } = require('../EventsControllers/AssisController');

const getMercadoPagoLink = async (req, res) => {

    const { title, price, quantity, eventID } = req.body;

    try {

        // agregar credenciales
        mercadopago.configure({
            access_token: "TEST-5298667857996708-102621-3fa54a132706b9044d96e0ef6dfc2a9e-1007503894"
        });

        // datos del producto a pagar
        var preference = {
            items: [
                {
                    title: title,
                    quantity: quantity,
                    currency_id: 'ARS',
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

        // agrego el user asistente al model Event
        await addAssistant(id, eventId);

        await User.findByIdAndUpdate(id, {

            // funcion para poder agregar elementos a una propiedad array de un Model
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
                    'eventosaAsistir.eventId': eventid
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
                    overwrite: true, // sobreescribo
                    new: true // retorno el model ACTUALIZADO
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

const getPayment = async (req, res) => {

    const { id, eventid } = req.params;

    try {

        const result = await User.findById(id).exec();

        // busco dentro del array de eventos a asistir el que conincida con el id del evento
        const event = result.eventosaAsistir.find(e => e.eventId == eventid);

        const status = event.statusPago;

        return res.json(status)

    } catch (err) {
        res.json({
            message: "Error al buscar pago",
            err
        })
    }

};

const updatePayment = async (req, res) => {

    const { id, paymentid } = req.params;
    const { status } = req.body;

    try {

        const user = await User.findOneAndUpdate(
            {
                _id: id,
                'eventosaAsistir.statusPago.id': paymentid
            },
            {
                $set: {
                    'eventosaAsistir.$.statusPago.status': status
                }
            },
            {
                overwrite: true, // sobreescribo
                new: true // retorno el model ACTUALIZADO
            }
        ).exec();

        return res.json({
            message: `Se actualizo el status del pago`
        });

    } catch (err) {
        res.json({
            message: "Error al actualizar status de pago",
            err
        })
    }
};

module.exports = { getMercadoPagoLink, addPayment, getPayment, updatePayment };