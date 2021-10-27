const mercadopago = require('mercadopago');

const getMercadoPagoLink = async (req, res) => {

    const {title, price, quantity} = req.body;

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
                    currency_id: 'ARS',
                    unit_price: price
                }
            ]
        };

        mercadopago.preferences.create(preference, (err, response) => {
            if (err) {
                res.json({
                    message: "Error al crear Link",
                    err
                })
            }
            res.json({ LinkMP: response.body.init_point })
        })

    } catch (err) {
        res.json({
            message: "Error al generar link de pago MP"
        })
    }
};

module.exports = { getMercadoPagoLink };