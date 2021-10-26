const mercadopago = require('mercadopago');

const getMercadoPagoLink = async (req, res) => {

    try {

        // agregar credenciales
        mercadopago.configure({
            access_token: "APP_USR-8280527144669781-102602-1cff7e44b81391959d3d50ecffe2c8da-1007012336"
        });

        var preference = {
            items: [
                {
                    title: 'Test',
                    quantity: 1,
                    currency_id: 'MXN',
                    unit_price: 10.5
                }
            ]
        };

        mercadopago.preferences.create(preference, (err, response) => {
            if (err) {
                console.log(err)
            }
            res.json({ LinkMP: response.body.init_point })
        })

    } catch (err) {
        res.json({
            message: "Error al generar link de pago MP"
        })
    }
};

const webHook = async (req, res) => {

    if (req.methdo === "POST") {
        let body = "";
        req.on("data", chunk => {
            body += chunk.toString();
        });
        req.on("end", () => {
            console.log(body, "webhook response");
            res.end("ok")
        })
    }
    return res.status(200);
};

module.exports = { webHook, getMercadoPagoLink };