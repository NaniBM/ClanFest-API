var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');



// ethereal.email.com  este mail usara el Nodemailer
//Name	Bryce Collins
//Username	bryce.collins72@ethereal.email
//Password	JqGuSvNPSV8Q5xgS2d



const enviarMailAsistir = async (req, res) =>{
    console.log("intenta aca")
    const {  nombreDeComprador, nombreDelEvento, mailDeAutor } = req.body;

    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: "clanfest04@gmail.com",
            pass: "Clanfest2021"
        }
    });

    var mailOptions = {
        from: "Remitente",
        to: `${mailDeAutor}`,
        subject: "Tiene un nuevo asistente en su evento",
        text: `Querido señxr se le infroma desde la App ClanFest que el usuario ${nombreDeComprador} asistira al evento ${nombreDelEvento}`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

};



module.exports = {enviarMailAsistir};