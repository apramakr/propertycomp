const express = require('express');
const nodemailer = require('nodemailer');
const creds = require('../config');
const bodyParser = require('body-parser');

//const app = express();
const router = express.Router();
/*
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
*/
const transport = {
  service: 'gmail',
  auth: {
    user: creds.USER,
    pass: creds.PASS
  }
}

const transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

router.post('/sendEmail', (req, res) => {
  //console.log(req.ip);
  //console.log(request.connection.remoteAddress);
  var name = req.body.name
  var email = req.body.email
  var message = req.body.message
  var content = `message: ${message} \n IP Address: ${req.ip}`
  var mail = {
    from: name,
    to: email,
    subject: 'Thank you for registering with PropertyCo!',
    text: content
  }

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        msg: 'fail'
      })
    } else {
      res.json({
        msg: 'success'
      })
    }
  })
})

module.exports = router;