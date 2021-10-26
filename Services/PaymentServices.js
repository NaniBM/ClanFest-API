const axios = require('axios');

const tokensMercadoPago = {
    prod: {},
    test: {
        access_token: "TEST-1536828168855983-102600-99f6ef9c8536b2d8dd201295840bfeb8-78669782"
        // el access_token de MP
    }
};

const urlMercadoPago = "https://api.mercadopago.com";

const createPaymentMercadoPago = async (name, price, unit, img) => {

    const url = `${urlMercadoPago}/preferences?access_token=${tokensMercadoPago.test.access_token}`;

    const items = [
        {
            id: "1007012336",
            // id interno (del negocio) del item
            title: name,
            // nombre que viene de la prop que recibe del controller
            description: "Una Fiesta Clandes",
            // descripción del producto
            picture_url: "https://static9.depositphotos.com/1594920/1087/i/600/depositphotos_10879124-stock-photo-young-chimpanzee-simia-troglodytes-6.jpg",
            // url de la imágen del producto, tiene que ser una url válida
            category_id: "1234",
            // categoría interna del producto (del negocio)
            quantity: parseInt(unit),
            // cantidad que estamos vendiendo, que tiene que ser un integer
            currency_id: "ARS",
            // id de la moneda, que tiene que ser en ISO 4217
            unit_price: parseFloat(price)
            // el precio, que por su complejidad tiene que ser tipo FLOAT
        }, {
            // si queremos agregar otro item, pasamos la misma información acá
        }
    ];

    const preferences = {
        items,
        // el array de objetos, items que declaramos más arriba
        external_reference: "ClanFest",
        // referencia para identificar la preferenciaç
        payer: {
            // información del comprador, si estan en producción tienen que traerlos del request
            //(al igual que hicimos con el precio del item) 
            name: "Lalo",
            surname: "Landa",
            email: "test_user_86035707@testuser.com",
            // si estan en sandbox, aca tienen que poner el email de SU usuario de prueba si estan 
            //en producción, deberian completar esta información 
            //de la misma manera que lo hicimos con items, units, y price

            phone: {
                area_code: "11",
                number: "22223333"
            },
            address: {
                zip_code: "1111",
                street_name: "False",
                street_number: "123"
            }
        },
        payment_methods: {
            // declaramos el método de pago y sus restricciones
            excluded_payment_methods: [
                // aca podemos excluir metodos de pagos, tengan en cuenta que es un array de objetos
                // donde el id de cada objeto es la exclusión
                {
                    id: "amex"
                    // acá estamos excluyendo el uso de la tarjeta American Express
                }
            ],
            excluded_payment_types: [{ id: "atm" }],
            // aca podemos excluir TIPOS de pagos, es un array de objetos
            // Por ejemplo, aca estamos excluyendo pago por cajero
            installments: 6,
            // mayor cantidad de cuotas permitidas
            default_installments: 6
            // la cantidad de cuotas que van a aparecer por defecto
        },
        back_urls: {
            // declaramos las urls de redireccionamiento
            success: "https://localhost:3008/success",
            // url a la que va a redireccionar si sale todo bien
            pending: "https://localhost:3008.com/pending",
            // url a la que va a redireccionar si decide pagar en efectivo por ejemplo
            failure: "https://localhost:3008.com/error"
            // url a la que va a redireccionar si falla el pago
        },
        notification_url: "https://localhost:3008/webhook",
        // declaramos nuestra url donde recibiremos las notificaciones
        // es la misma ruta que declaramos en app.js
        auto_return: "approved"
        // si la compra es exitosa automaticamente redirige a "success" de back_urls
    };

    //NOTA: TODAS las URLS que usemos tienen que ser reales,
    // si prueban con localhost, va a fallar

    try {

            const request = await axios.post(url, preferences);

            return request.data;
 

    } catch (err) {
        res.json({
            error,
            message: "Error al crear pago"
        })
    }
};

module.exports = { createPaymentMercadoPago };