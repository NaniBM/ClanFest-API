const QRCode = require('qrcode');
const User = require('../../models/User');

const generateQr = async (nombre, uid, eventid) => {

    try {

        let data = {
            nombre,
            uid,
            eventid
        };

        let stringData = JSON.stringify(data);

        QRCode.toDataURL(stringData, async (err, code) => {

            if (err) return console.log("error occurred")

            const user = await User.findOneAndUpdate(
                {
                    _id: uid,
                    'eventosaAsistir.eventId': eventid
                },
                {
                    $set: {
                        'eventosaAsistir.$.statusPago.qr': code
                    }
                },
                {
                    new: true
                }
            ).exec()

            return;

        });

    } catch (err) {
        console.log("Error")
    }
};

const getQr = async (req, res) => {

    const {id, eventid} = req.params;

    try {

        const result = await User.findById(id).select('eventosaAsistir');

        const event = result.eventosaAsistir.find(e => e.eventId == eventid);

        return res.json(event.statusPago.qr)
        
    } catch(err) {
        res.json({
            message: "Error al buscar QR"
        })
    }
}

module.exports = { generateQr, getQr };