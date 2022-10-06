const express = require('express');
const app = express();

const nodemailer = require('nodemailer');

const PORT = process.env.PORT || 5000;

//Middleware
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    //res.send('hello!!');
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/', (req, res) => {

    console.log(req.body);
    const transporter = nodemailer.createTransport({
        host: "smtp.simply.com",
        port: 587,
        secure: false,
        auth: {
            user: 'mailer@michgonzalez.com',
            pass: 's8jrJVQSS7agx5'
        }
    })

    const mailOptions = {
        from: req.body.email,
        to: 'hola@michgonzalez.com',
        subject: `message from ${req.body.email}`,
        text: req.body.message,
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.send('error');
        } else {
            console.log('Email sent:' + info.response);
            res.send('success');
        }
    })

});

app.listen(PORT, () => {
    console.log(`Server runnig on port ${PORT}`);
});