const User = require('../../models/User');

const express = require("express");
const app = express();
const http = require("http");
const QRCode = require('qrcode');
/* const PDFDocument = require('pdfkit'); */
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Joi = require('joi');


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
};

const genQR = async (res, req) => {


    const dir = "public";
    const subDir = "public/uploads";
/* 
    if(!fs.mkdirSync(dir)) {
        fs.mkdirSync(dir);
        fs.mkdirSync(subDir)
    }; */

    const generateQRCodeImage = async (filePath, text) => {
        return await QRCode.toFile(filePath, text, (err, result) => {
            if(err) return console.log(err);
            console.log(result)
        })
    };

    const run = ({
        width,
        height,
        x,
        y,
        pathToImage,
        pathToPDF,
        pathToOutputPDF,
        qrCodeText
    }, async () => {
        await generateQRCodeImage(pathToImage, qrCodeText);
    });

    const pdfDoc = await PDFDocument.load(await fs.readFile(pathToPDF));
    const img = await PDFDocument.embedPng(await fs.readFile(pathToImage));

    Array.from({ length: pdfDoc.getPageCount() }).forEach((__, index) => {
        let imagePage = pdfDoc.getPage(index);

        imagePage.drawImage(img, {
            x,
            y,
            width,
            height
        })
    })

    const pdfBytes = await pdfDoc.save();

    await fs.writeFile(pathToOutputPDF, pdfBytes);

    const pdfFileFilter = (req, file, cb) => {
        const ext = path.extname(file.originalname);

        if(ext !== ".pdf") {
            return cb("This extension is not supported!");
        }
        cb(null, true);
    };

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(
                null,
                file.fieldname + "-" + Date.now() + path.extname(file.originalname)
            );
        }
    });

    const filesToProcess = multer({ storage: storage, fileFilter: pdfFileFilter });

    const schema = Joi.object({
        width: Joi.string().regex(/^\d+$/).required(),
        height: Joi.string().regex(/^\d+$/).required(),
        x: Joi.string().regex(/^\d+$/).required(),
        y: Joi.string().regex(/^\d+$/).required(),
        qrCodeData: Joi.string().required(),
        qrDarkColor: Joi.string(),
        qrLightColor: Joi.string(),
      });

     app.post("/addQrToPdf", filesToProcess.array("file", 1), async (req, res) => {
        const pathToImage = "public/uploads/" + Date.now() + "temp-qr.png";
        const pathToOutputPDF = "public/uploads/" + Date.now() + "-output.pdf";

        if (req.files) {
            const [file] = req.files;
        
            if (!file) {
              res.send("No file detected on input");
            }
            const pathToPDF = file.path;

            try {
              const { width, height, x, y, qrCodeData, qrDarkColor, qrLightColor } =
                await schema.validateAsync(req.body);
        
              await run({
                width: +width,
                height: +height,
                x: +x,
                y: +y,
                qrDarkColor,
                qrLightColor,
                qrCodeText: qrCodeData,
                pathToImage,
                pathToOutputPDF,
                pathToPDF,
              });
        
              const pdfFile = await readFile(pathToOutputPDF);
              res.contentType("application/pdf");
              res.send(pdfFile);
        
              await unlink(pathToImage);
              await unlink(pathToPDF);
              await unlink(pathToOutputPDF);
            } catch (error) {
              try {
                await unlink(pathToPDF);
                await unlink(pathToImage);
              } catch (err) {
                console.warn(err);
              }
              res.send(error);
            }
          }})
};

genQR();


module.exports = { generateQr, getQr, genQR };