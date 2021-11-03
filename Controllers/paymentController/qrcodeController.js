const User = require('../../models/User');

const QRCode = require('qrcode');
const path = require('path');
const qr = require('qr-image');
const fs = require('fs');

const generateQr = async (nombre, uid, eventid) => {

    try {

        const data = {
            nombre,
            uid,
            eventid
        };

        const stringData = JSON.stringify(data);
/*         const userid = JSON.stringify(uid);
        const eventidString = JSON.stringify(eventid);
        const nameString = JSON.stringify(nombre);

        console.log(userid, eventidString, nameString)

        await createFile(userid, nameString,eventidString); */

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

const createFile = async (name, uid, eid) => {

    try {

        const data = {
            name,
            uid,
            eid
        };

        const stringData = JSON.stringify(data);

        const qr_svg = qr.image(stringData, { type: 'png' });
        const qr_str = 'data:image/png;base64'

        qr_svg.pipe(fs.createWriteStream(path.join(__dirname, `public/uploads/${name}-${eid}.png`)))

    } catch (err) {
        console.log(err)
    }
}

const getQr = async (req, res) => {

    const { id, eventid } = req.params;

    try {

        const result = await User.findById(id).select('eventosaAsistir');

        const event = result.eventosaAsistir.find(e => e.eventId == eventid);

        return res.json(event.statusPago.qr)

    } catch (err) {
        res.json({
            message: "Error al buscar QR"
        })
    }
};

const sendQr = async (req, res, next) => {

    var options = {
        root: path.join(__dirname, 'public/uploads'),
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    }

    var fileName = req.params.imgname

    res.sendFile(fileName, options, function (err) {
        if (err) {
            next(err)
        } else {
            console.log('Sent:', fileName)
        }
    })

};

module.exports = { generateQr, getQr, sendQr, createFile };